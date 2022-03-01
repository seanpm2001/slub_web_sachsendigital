// @ts-check

import shaka from 'shaka-player/dist/shaka-player.ui';

import Chapters from './Chapters';
import ImageFetcher from './ImageFetcher';
import {
  clamp,
  disableDragging,
  e,
  filterNonNull,
  setElementClass,
} from '../lib/util';
import buildTimeString from './lib/buildTimeString';
import sanitizeThumbnail from './lib/thumbnails/sanitizeThumbnail';

/**
 * @typedef {{
 *  absolute: number;
 *  seconds: number;
 *  chapter: Chapter | undefined;
 *  onChapterMarker: boolean;
 *  }} SeekPosition
 *
 * @typedef {{
 *  uri: string;
 *  thumb: Thumbnail;
 *  tilesetImage: HTMLImageElement;
 * }} LastRendered
 *
 * @typedef Current
 * @property {SeekPosition} seekPosition
 * @property {Thumbnail[]} thumbs Ordered by quality/bandwidth descending.
 *
 * @typedef {{
 *  onChangeStart: () => void;
 *  onChange: (pos: SeekPosition) => void;
 *  onChangeEnd: () => void;
 * }} Interaction
 *
 * @typedef {{
 *  seekBar: HTMLElement;
 *  player: shaka.Player;
 *  network: ImageFetcher;
 *  interaction: Interaction;
 * }} Params
 */

const DISPLAY_WIDTH = 160;
const INITIAL_ASPECT_RATIO = 16 / 9;

/**
 * Amount of the available video height allotted to thumbnail preview. If the
 * container would exceed that height, the thumbnail image should be hidden.
 */
const MAXIMUM_THUMBNAIL_QUOTA = 0.4;

/**
 * Component for a thumbnail preview when sliding over the seekbar.
 *
 * Oriented at https://github.com/google/shaka-player/issues/3371#issuecomment-830001465.
 */
export default class ThumbnailPreview {
  /**
   *
   * @param {Params} params
   */
  constructor(params) {
    this.seekBar = params.seekBar;
    this.player = params.player;
    this.network = params.network;
    this.interaction = params.interaction;

    /** @private @type {number | null} */
    this.fps = null;
    /** @private @type {Chapters | null} */
    this.chapters = null;
    /**
     * Thumbnail tracks, ordered by quality/bandwidth descending.
     * @private
     * @type {ThumbnailTrack[]}
     */
    this.thumbnailTracks = [];
    /** @private @type {LastRendered | null} */
    this.lastRendered = null;
    /** @private @type {boolean} */
    this.isChanging = false;
    /** @private @type {Current | null} */
    this.current = null;
    /** @private @type {number | null} */
    this.renderAnimationFrame = null;

    /** @private */
    this.handlers = {
      onWindowBlur: this.onWindowBlur.bind(this),
      onWindowResize: this.onWindowResize.bind(this),
      onPointerMove: this.onPointerMove.bind(this),
      onPointerDown: this.onPointerDown.bind(this),
      onPointerUpOrCancel: this.onPointerUpOrCancel.bind(this),
    };

    // Make preview unselectable so that, for example, the info text won't
    // accidentally be selected when scrubbing on FlatSeekBar.
    this.$container = e('div', { className: "sxnd-thumbnail-preview noselect" }, [
      e('div', { className: "content-box" }, [
        this.$display = e('div', { className: "display" }, [
          this.$img = e('img'),
          this.$thumbTimecode = e('div', { className: "thumb-timecode" }),
        ]),
        this.$info = e('span', { className: "info" }, [
          this.$chapterText = e('span', { className: "chapter-text" }),
          this.$timecodeText = e('span', { className: "timecode-text" }),
        ]),
      ]),
    ]);

    this.$seekMarker = e('div', { className: "seek-marker" });

    this.seekBar.append(this.$seekMarker, this.$container);

    this.ensureDisplaySize(DISPLAY_WIDTH, DISPLAY_WIDTH / INITIAL_ASPECT_RATIO);

    window.addEventListener('blur', this.handlers.onWindowBlur);
    window.addEventListener('resize', this.handlers.onWindowResize);
    // TODO: Find a better solution for this
    document.addEventListener('pointermove', this.handlers.onPointerMove);
    document.addEventListener('pointerdown', this.handlers.onPointerDown);
    document.addEventListener('pointerup', this.handlers.onPointerUpOrCancel);
    document.addEventListener('pointercancel', this.handlers.onPointerUpOrCancel);
  }

  release() {
    window.removeEventListener('blur', this.handlers.onWindowBlur);
    window.removeEventListener('resize', this.handlers.onWindowResize);
    document.removeEventListener('pointermove', this.handlers.onPointerMove);
    document.removeEventListener('pointerdown', this.handlers.onPointerDown);
    document.removeEventListener('pointerup', this.handlers.onPointerUpOrCancel);
    document.removeEventListener('pointercancel', this.handlers.onPointerUpOrCancel);
  }

  /**
   * @param {number | null} fps
   */
  setFps(fps) {
    this.fps = fps;
    this.currentRenderBest();
  }

  /**
   * @param {Chapters} chapters
   */
  setChapters(chapters) {
    this.chapters = chapters;
    this.currentRenderBest();
  }

  /**
   * @param {readonly ThumbnailTrack[]} thumbnails
   */
  setThumbnailTracks(thumbnails) {
    this.thumbnailTracks = thumbnails.slice();
    this.thumbnailTracks.sort((a, b) => b.bandwidth - a.bandwidth);

    this.currentRenderBest();
  }

  /**
   * @private
   */
  onWindowBlur() {
    // The blur event is fired, for example, when the user switches the tab via
    // Ctrl+Tab. If they then move the mouse and return to the player tab, it may
    // be surprising to have the thumbnail preview still open. Thus, close the
    // preview to avoid that.
    this.cancelPreview();
  }

  /**
   * @private
   */
  onWindowResize() {
    this.cancelPreview();
  }

  /**
   * @private
   * @param {PointerEvent} e
   */
  async onPointerMove(e) {
    const seekPosition = this.mouseEventToPosition(e);
    if (seekPosition === undefined) {
      return this.setIsVisible(false);
    }

    if (e.pointerType === 'touch') {
      this.beginChange();
    }

    /** @type {Thumbnail[]} */
    let thumbs = [];

    // If thumbnails are not shown, also avoid unnecessary downloads of images
    if (this.showThumbnailImage()) {
      const position = seekPosition.seconds;
      const maximumBandwidth = 0.01 * this.player.getStats().estimatedBandwidth;
      thumbs = await this.getThumbnails(position, maximumBandwidth);
    }

    this.current = { seekPosition, thumbs };

    // Check primary button
    if (this.isChanging && (e.buttons & 1) !== 0) {
      this.interaction?.onChange?.(seekPosition);
    }

    this.currentRenderBest();
  }

  /**
   * @private
   * @param {PointerEvent} e
   */
  onPointerDown(e) {
    // Check primary button
    if ((e.buttons & 1) !== 0) {
      const position = this.mouseEventToPosition(e, e.pointerType === 'mouse');
      if (position !== undefined) {
        this.beginChange();

        this.interaction?.onChange?.(position);
      }
    }
  }

  /**
   * @private
   * @param {PointerEvent} e
   */
  onPointerUpOrCancel(e) {
    this.endChange();

    // Pen & touch: Always close when released
    // Mouse: Only close when also out of screen area
    if (e.pointerType !== 'mouse' || this.mouseEventToPosition(e) === undefined) {
      this.setIsVisible(false);
    }
  }

  /**
   * @private
   * @param {MouseEvent} e
   * @param {boolean} allowWideSeekArea
   * @returns {SeekPosition | undefined}
   */
  mouseEventToPosition(e, allowWideSeekArea = true) {
    const duration = this.saneVideoDuration();
    if (duration === undefined) {
      return;
    }

    const isHoveringButton = document.querySelector("input[type=button]:hover, button:hover") !== null;
    if (isHoveringButton) {
      return;
    }

    const bounding = this.seekBar.getBoundingClientRect();

    // Don't check bounds when scrubbing
    if (!this.isChanging) {
      if (this.isVisible && allowWideSeekArea) {
        // A seek has already been initiated by hovering the seekbar. Check
        // bounds in such a way that quickly moving the mouse left/right won't
        // accidentally close the container.

        const { left, right, bottom } = bounding;
        if (!(left <= e.clientX && e.clientX <= right && e.clientY <= bottom)) {
          return;
        }

        const { top } = this.$container.getBoundingClientRect();
        if (!(top <= e.clientY)) {
          return;
        }
      } else {
        // Before initiating a seek, check that the seek bar (or a descendant)
        // is actually hovered (= not only an element that visually overlays the
        // seek bar, such as a modal).

        if (!(e.target instanceof Node) || !this.seekBar.contains(e.target)) {
          return;
        }
      }
    }

    const secondsPerPixel = duration / bounding.width;

    let absolute = e.clientX - bounding.left;
    let seconds = clamp(absolute * secondsPerPixel, [0, duration]);
    const chapter = this.chapters?.timeToChapter(seconds);
    let onChapterMarker = false;

    // "Capture" mouse on chapter markers,
    // but only if the user is not currently scrubbing.
    if (chapter && !this.isChanging) {
      const offsetPixels = (seconds - chapter.timecode) / secondsPerPixel;
      if (-2 <= offsetPixels && offsetPixels < 6) {
        seconds = chapter.timecode;
        absolute = seconds / secondsPerPixel;
        onChapterMarker = true;
      }
    }

    return { absolute, seconds, chapter, onChapterMarker };
  }

  /**
   * Resizes display to match aspect ratio of given thumbnail size.
   *
   * @private
   * @param {number} thumbWidth
   * @param {number} thumbHeight
   */
  ensureDisplaySize(thumbWidth, thumbHeight) {
    const previewHeight = Math.floor(DISPLAY_WIDTH / thumbWidth * thumbHeight);
    if (this.$display.clientHeight !== previewHeight) {
      this.$display.style.height = `${previewHeight}px`;
    }
  }

  /**
   * Renders best available thumbnail at current position.
   *
   * @private
   */
  currentRenderBest() {
    if (this.renderAnimationFrame !== null) {
      return;
    }

    this.renderAnimationFrame = window.requestAnimationFrame(() => {
      this.renderAnimationFrame = null;

      const current = this.current;
      if (current === null) {
        return;
      }

      this.setIsVisible(true, current.thumbs.length > 0, false);
      this.renderSeekPosition(current.seekPosition);

      for (const thumb of current.thumbs) {
        const uri = thumb.uris[0];
        if (uri === undefined) {
          continue;
        }

        const tilesetImage = this.network.getCached(uri);
        if (tilesetImage === null) {
          this.network.get(uri)
            .then(() => {
              this.currentRenderBest();
            });

          continue;
        }

        this.renderImageAndShow(uri, thumb, tilesetImage, current.seekPosition);
        break;
      }
    });
  }

  /**
   * Renders the specified thumbnail to the display and shows it to the user.
   *
   * @private
   * @param {string} uri
   * @param {Thumbnail} thumb
   * @param {HTMLImageElement} tilesetImage
   * @param {SeekPosition} seekPosition
   */
  renderImageAndShow(uri, thumb, tilesetImage, seekPosition) {
    this.ensureDisplaySize(thumb.width, thumb.height);

    this.renderImage(uri, thumb, tilesetImage);
    this.setIsVisible(true);

    // If the image has just become visible, the container position may change
    this.positionContainer(seekPosition);
  }

  /**
   * Renders the specified thumbnail to the display.
   *
   * @private
   * @param {string} uri
   * @param {Thumbnail} thumb
   * @param {HTMLImageElement} tilesetImage
   * @param {boolean} force
   */
  renderImage(uri, thumb, tilesetImage, force = false) {
    // Check if it's another thumbnail (`imageTime` and `bandwidth` as proxy)
    const shouldRender = (
      force
      || this.lastRendered === null
      || thumb.imageTime !== this.lastRendered.thumb.imageTime
      || thumb.bandwidth !== this.lastRendered.thumb.bandwidth
    );

    if (shouldRender) {
      const { positionX, positionY, width, height } = thumb;

      const scale = DISPLAY_WIDTH / width;
      this.$img.replaceWith(tilesetImage);
      this.$img = tilesetImage;
      this.$img.style.transform = [
        `scale(${scale})`,
        `translateX(-${positionX}px)`,
        `translateY(-${positionY}px)`,
      ].join(' ');
      this.$img.style.transformOrigin = 'left top';

      this.renderThumbTimecode(thumb);

      this.lastRendered = { uri, thumb, tilesetImage };
    }
  }

  /**
   * Renders timecode label of thumbnail (top right corner).
   *
   * @private
   * @param {Thumbnail} thumb
   */
  renderThumbTimecode(thumb) {
    const videoDuration = this.saneVideoDuration();
    const showHour = videoDuration === undefined || videoDuration >= 3600;
    const timecode = buildTimeString(thumb.imageTime, showHour, this.fps);

    this.$thumbTimecode.innerText = timecode;
  }

  /**
   * Positions the thumbnail container to match {@link seekPosition}.
   *
   * @private
   * @param {SeekPosition} seekPosition
   */
  positionContainer(seekPosition) {
    // Align the container so that the mouse underneath is centered,
    // but avoid overflowing at the left or right of the seek bar
    const containerX = clamp(
      seekPosition.absolute - this.$container.offsetWidth / 2,
      [0, this.seekBar.clientWidth - this.$container.offsetWidth]
    );
    this.$container.style.left = `${containerX}px`;
  }

  /**
   * Does all rendering related to seek position:
   * - Positions seek marker on timeline
   * - Highlights text if on chapter marker
   * - Sets chapter and timecode texts
   * - Positions the container
   *
   * @private
   * @param {SeekPosition} seekPosition
   */
  renderSeekPosition(seekPosition) {
    const duration = this.saneVideoDuration();
    if (duration === undefined) {
      this.setIsVisible(false);
      return;
    }

    this.$seekMarker.style.left = `${seekPosition.absolute}px`;

    if (seekPosition.onChapterMarker) {
      this.$info.classList.add("on-chapter-marker");
    } else {
      this.$info.classList.remove("on-chapter-marker");
    }

    // Empty chapter titles are hidden to maintain correct distance of info text
    // to thumbnail image
    const title = seekPosition.chapter?.title ?? "";
    this.$chapterText.innerText = title;
    setElementClass(this.$chapterText, 'displayed', title !== "");

    this.$timecodeText.innerText = buildTimeString(seekPosition.seconds, duration >= 3600, this.fps);

    // The info text length may influence the container position, so position
    // after setting the text.
    this.positionContainer(seekPosition);
  }

  /**
   * @private
   */
  cancelPreview() {
    this.setIsVisible(false);

    this.endChange();
  }

  /**
   * Stops seeking and scrubbing.
   *
   * @private
   */
  beginChange() {
    if (!this.isChanging) {
      this.interaction?.onChangeStart?.();
      document.body.classList.add('seek-or-scrub');
      this.isChanging = true;
    }
  }

  /**
   * Stops seeking and scrubbing.
   *
   * @private
   */
  endChange() {
    if (this.isChanging) {
      this.interaction?.onChangeEnd?.();
      document.body.classList.remove('seek-or-scrub');
      this.isChanging = false;
    }
  }

  /**
   * Whether or not the thumbnail preview container is currently shown.
   *
   * @type {boolean}
   */
  get isVisible() {
    return this.current !== null;
  }

  /**
   *
   * @param {boolean} showContainer Whether or not to show the main container.
   * @param {boolean} openThumb Whether or not to open up the image container/space.
   * @param {boolean} showThumb Whether or not to show the thumbnail image.
   */
  setIsVisible(showContainer, openThumb = showContainer, showThumb = openThumb) {
    if (!showContainer) {
      this.current = null;
    }

    setElementClass(this.$container, 'sxnd-visible', showContainer);
    setElementClass(this.$seekMarker, 'sxnd-visible', showContainer);

    setElementClass(this.$display, 'is-open', openThumb)
    setElementClass(this.$img, 'sxnd-visible', showThumb);
    setElementClass(this.$thumbTimecode, 'sxnd-visible', showThumb);

    // Make sure the thumbnail image won't be dragged when scrubbing
    disableDragging(this.$img);
  }

  /**
   * @private
   * @param {number} position
   * @param {number} maximumBandwidth
   * @returns {Promise<Thumbnail[]>}
   */
  async getThumbnails(position, maximumBandwidth) {
    /** @type {ThumbnailTrack[]} */
    let tracks = [];

    // Find best and cheapest track of acceptable bandwidth
    // Thumbnail tracks are ordered descending
    let best = this.thumbnailTracks.find(track => track.bandwidth < maximumBandwidth);
    if (best !== undefined) {
      let cheapest = /** @type {ThumbnailTrack} */(
        this.thumbnailTracks[this.thumbnailTracks.length - 1]
      );

      tracks = best === cheapest
        ? [best]
        : [best, cheapest];
    }

    const thumbPromises = tracks.map(
      (track) => this.getSingleThumbnail(track, position)
    );

    return filterNonNull(await Promise.all(thumbPromises));
  }

  /**
   *
   * @private
   * @param {ThumbnailTrack} track
   * @param {number} position
   * @returns {Promise<ThumbnailOnTrack | null>}
   */
  async getSingleThumbnail(track, position) {
    const thumbRaw = await track.getThumb(position);
    const videoDuration = this.saneVideoDuration();

    if (thumbRaw === null || videoDuration === undefined) {
      return null;
    }

    return sanitizeThumbnail(thumbRaw, videoDuration);
  }

  /**
   * Whether or not to show a thumbnail image (if available).
   *
   * @private
   * @returns {boolean}
   */
  showThumbnailImage() {
    const video = this.player.getMediaElement();
    const maximumContainerHeight =
      (video?.clientHeight ?? 0) * MAXIMUM_THUMBNAIL_QUOTA;
    const estimatedContainerHeight = 300;
    return estimatedContainerHeight <= maximumContainerHeight;
  }

  /**
   * Returns either the video duration as finite, non-negative number,
   * or `undefined` otherwise.
   *
   * @private
   * @returns {number | undefined}
   */
  saneVideoDuration() {
    const duration = this.player.getMediaElement()?.duration;
    return duration !== undefined && duration > 0
      ? duration
      : undefined;
  }
}
