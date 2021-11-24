(()=>{"use strict";var e,t={615:(e,t,n)=>{var s=n(15);function i(e,t){return e<t[0]?t[0]:e>t[1]?t[1]:e}function a(e,t,n){const s=t?[e/3600,e/60%60,e%60]:[e/60,e%60];return n&&s.push(Math.floor(e%1*n)),s.map(((e,t)=>Math.floor(e).toString().padStart(0==t?0:2,"0"))).join(":")}function o(e){const t=document.createElement("template");return t.innerHTML=e,t.content.firstElementChild}class r{constructor(){this._idCnt=0,this._testCanvas=null,this._lang={locale:"en",phrasesInput:{},phrasesCompiled:{}}}mkid(){return"__autoid_"+ ++this._idCnt}supportsCanvasExport(e){return this._getTestCanvas().toDataURL(e).match(/data:(.*);/)[1]===e}setLang(e){this._lang={twoLetterIsoCode:e.twoLetterIsoCode,phrasesInput:e.phrases,phrasesCompiled:{}}}t(e,t={}){if(!(e in this._lang.phrasesCompiled)){if(!(e in this._lang.phrasesInput))return console.error(`Warning: Translation key '${e}' not defined.`),e;this._lang.phrasesCompiled[e]=new s.ZP(this._lang.phrasesInput[e],this._lang.twoLetterIsoCode)}return this._lang.phrasesCompiled[e].format(t)}_getTestCanvas(){return this._testCanvas||(this._testCanvas=document.createElement("canvas")),this._testCanvas}}const h=jQuery;var l=n.n(h);class c extends class{constructor(e={}){this._state=e,this._pendingStateUpdates=[],this._renderTimeout=null,this._renderPromise=Promise.resolve(),this._eventCallbacks={updated:[]}}on(e,t){this._eventCallbacks[e].push(t)}update(){return this._renderPromise}setState(e={}){this._pendingStateUpdates.push(e),this._renderTimeout||(this._renderPromise=new Promise((e=>{this._renderTimeout=setTimeout((()=>{const t=this._pendingStateUpdates.reduce(Object.assign,{}),n=Object.assign({},this._state,t);this.render(n),this._state=n,this._pendingStateUpdates=[],this._renderTimeout=null,this._renderPromise=Promise.resolve();for(const e of this._eventCallbacks.updated)e(n);e()}))})))}render(e){}}{constructor(e,t={}){super({show:!1,...t}),this._parent=e,this._isAnimating=!1,this._dom=this._createDom(),this._dom.close.addEventListener("click",this.close.bind(this)),this._parent.append(this._dom.main),this._$main=l()(this._dom.main)}_createDom(e=""){const t={main:document.createElement("div"),headline:document.createElement("div"),title:document.createElement("h3"),close:document.createElement("span"),body:document.createElement("div")};return t.main.className=`sxnd-modal ${e}`,t.headline.className="headline-container",t.close.className="modal-close icon-close",t.body.className="body-container",t.main.append(t.headline,t.body),t.headline.append(t.title,t.close),t}get isOpen(){return this._state.show}open(e=!0){this._isAnimating||this.setState({show:e})}close(){this.open(!1)}toggle(){this.open(!this._state.show)}render(e){const{show:t}=e;if(t!=this._state.show){this._isAnimating=!0;const e=t?"show":"hide";this._$main[e]({duration:"fast",complete:()=>{this._isAnimating=!1}})}}}class d extends c{constructor(e,t){super(e,{env:t,timecode:null,startAtTimecode:!0})}_createDom(){const e=this._state.env,t=super._createDom("bookmark-modal");t.title.innerText=e.t("modal.bookmark.title");const n=e.mkid();return t.container=o(`\n      <div>\n        <div class="url-line">\n          <input type="url" readonly value="https://sachsen.digital">\n          <a href="javascript:void(0)" class="copy-to-clipboard">\n            <i class="material-icons-round">content_copy</i>\n          </a>\n        </div>\n        <div class="start-at">\n          <input type="checkbox" id="${n}">\x3c!--\n          --\x3e<label for="${n}"></label>\n        </div>\n      </div>\n    `),t.url=t.container.querySelector("input"),t.copyToClipboard=t.container.querySelector(".copy-to-clipboard"),t.copyToClipboard.title=e.t("modal.bookmark.copy-link"),t.copyToClipboard.addEventListener("click",this.handleCopyToClipboard.bind(this)),t.startAt=t.container.querySelector(".start-at"),t.startAtTimecodeCheck=t.startAt.querySelector("input[type=checkbox]"),t.startAtTimecodeCheck.addEventListener("change",this.handleChangeStartAtTimecode.bind(this)),t.startAtTimecodeLabel=t.startAt.querySelector("label"),t.body.append(t.container),t}async handleCopyToClipboard(){const e=this.generateUrl(this._state).toString();this._dom.url.focus(),navigator.clipboard?navigator.clipboard.writeText(e):document.execCommand("copy")}handleChangeStartAtTimecode(e){this.setState({startAtTimecode:e.target.checked})}generateUrl(e){const t=new URL(window.location);return e.startAtTimecode&&null!=e.timecode&&0!==e.timecode?t.searchParams.set("timecode",e.timecode):t.searchParams.delete("timecode"),t}setTimecode(e){return this.setState({timecode:e}),this}render(e){super.render(e);const{env:t,show:n,timecode:s,startAtTimecode:i}=e;this._dom.url.value=this.generateUrl(e).toString(),null===s||0===s?this._dom.startAt.classList.remove("shown"):(this._dom.startAtTimecodeCheck.checked=i,this._dom.startAtTimecodeLabel.innerText=t.t("modal.bookmark.start-at-current-time",{timecode:a(s)}),this._dom.startAt.classList.add("shown")),n&&n!==this._state.show&&this._dom.url.select()}}let p=0;class m{constructor(e){this._chapters=e.map((e=>({id:p++,title:e.title,timecode:parseInt(e.timecode,10)}))),this._chapters.sort(((e,t)=>e.timecode-t.timecode)),this._idToIndex=new Map;for(let e=0;e<this._chapters.length;e++){const t=this._chapters[e];this._idToIndex.set(t.id,e)}}at(e){return this._chapters[e]}indexOf(e){return this._idToIndex.get(e.id)}advance(e,t=1){let n=this.indexOf(e);if(void 0!==n)return this._chapters[n+t]}timeToChapter(e){for(let t=this._chapters.length-1;t>=0;t--){const n=this._chapters[t];if(e>=n.timecode)return n}}[Symbol.iterator](){return this._chapters.values()}}var u=n(480),g=n.n(u);class v extends g().ui.Element{constructor(e,t,n={}){super(e,t,n.material_icon),this._config=n,this.button=document.createElement("button"),this.button.className="material-icons-round",this.button.title=n.title,this.button.textContent=n.material_icon,this.parent.appendChild(this.button),this._config.onClick&&this.eventManager.listen(this.button,"click",this._config.onClick)}static register(e,t={}){const n=e.mkid();return g().ui.Controls.registerElement(n,{create:(e,n)=>new v(e,n,t)}),n}}class y extends c{constructor(e,t,n){super(e,{env:t,config:n})}_createDom(){const{env:e,config:{constants:t,keybindings:n}}=this._state,s=super._createDom("help-modal");s.title.innerText=e.t("modal.help.title");const i=function(e){const t={navigate:{},other:{}},n=e.slice();n.sort(((e,t)=>e.order-t.order));for(const e of n)t[e.kind]||(t[e.kind]={}),t[e.kind][e.action]||(t[e.kind][e.action]=[]),t[e.kind][e.action].push(e);return t}(n);for(const[n,a]of Object.entries(i)){const i=[...Object.entries(a)];if(0===i.length)continue;const r=o('<h3 class="subheader"></h3>');r.innerText=e.t(`action.kind.${n}`),s.body.append(r);const h=o('\n        <table class="keybindings-table">\n          <tbody>\n            <tr>\n              <td class="legend key"></td>\n              <td class="legend action"></td>\n            </tr>\n          </tbody>\n        </table>\n      ');h.querySelector(".legend.key").innerText=e.t("modal.help.key"),h.querySelector(".legend.action").innerText=e.t("modal.help.action");const l=o('\n        <tr>\n          <td class="key"></td>\n          <td class="action"></td>\n        </tr>\n      '),c=h.querySelector("tbody");for(const[n,s]of i){const i=l.cloneNode(!0),a=i.querySelector(".key");for(let t=0;t<s.length;t++){const n=s[t];if(t>0){const t=o('<span class="or-sep"></span>');t.innerText=e.t("or"),a.append(t)}let i=n.mod?e.t(`key.mod.${n.mod}`)+" + "+e.t(`key.${n.key}.mod`):e.t(`key.${n.key}`);n.repeat&&(i=e.t("key.repeat",{key:i})),a.append(document.createTextNode(i))}i.querySelector(".action").innerText=e.t(`action.${n}`,t),c.append(i)}h.append(c),s.body.append(h)}return s}}const f={None:0,CtrlMeta:1,Shift:2,Alt:4};class k{constructor(){this.tasks={}}abortPending(){for(const e of Object.keys(this.tasks))this.tasks[e].loaded||(this.tasks[e].request.abort(),delete this.tasks[e])}get(e){if(!this.tasks[e]){let t;this.abortPending();const n=new Promise(((n,s)=>{t=new XMLHttpRequest,t.responseType="blob",t.onload=s=>{if(this.tasks[e].loaded=!0,i=t.status,2===Math.floor(i/100)){const s=URL.createObjectURL(t.response),i=document.createElement("img");i.onload=()=>{URL.revokeObjectURL(s),this.tasks[e].response=i,n(i)},i.src=s}else t.onerror(s);var i},t.onerror=t=>{delete this.tasks[e],s(t)},t.open("GET",e),t.send()}));this.tasks[e]={request:t,promise:n,loaded:!1}}return this.tasks[e].promise}}class b{constructor(e){this.seekBar=e.seekBar,this.player=e.player,this.getFps=e.getFps,this.getChapter=e.getChapter,this.network=e.network,this.interaction=e.interaction;const t=o('\n      <div class="thumbnail-preview noselect">\n        <div class="content-box">\n          <div class="display">\n            <canvas>\n          </div>\n          <span class="info">\n            <span class="chapter-text"></span>\n            <span class="timecode-text"></span>\n          </span>\n        </div>\n      </div>\n    '),n=o('\n      <div class="seek-marker"></div>\n    ');this.dom={seekMarker:n,container:t,display:t.querySelector(".display"),canvas:t.querySelector("canvas"),info:t.querySelector(".info"),chapterText:t.querySelector(".chapter-text"),timecodeText:t.querySelector(".timecode-text")},this.ctx=this.dom.canvas.getContext("2d"),this.setCanvasResolution(160,90),this.lastRendered=null,this.isChanging=!1,this.showContainer=!1,this.seekBar.append(this.dom.seekMarker,this.dom.container),this.handlers={onWindowBlur:this.onWindowBlur.bind(this),onPointerMove:this.onPointerMove.bind(this),onPointerDown:this.onPointerDown.bind(this),onPointerUp:this.onPointerUp.bind(this)},window.addEventListener("blur",this.handlers.onWindowBlur),document.addEventListener("pointermove",this.handlers.onPointerMove),document.addEventListener("pointerdown",this.handlers.onPointerDown),document.addEventListener("pointerup",this.handlers.onPointerUp)}release(){window.removeEventListener("blur",this.handlers.onWindowBlur),document.removeEventListener("pointermove",this.handlers.onPointerMove),document.removeEventListener("pointerdown",this.handlers.onPointerDown),document.removeEventListener("pointerup",this.handlers.onPointerUp)}setCanvasResolution(e,t){const n=window.devicePixelRatio;this.dom.canvas.width=n*e,this.dom.canvas.height=n*t,this.canvasResolution={scale:n,width:e,height:t},this.ctx.scale(n,n),this.lastRendered&&this.renderImage(this.lastRendered.uri,this.lastRendered.thumb,this.lastRendered.tilesetImage,!0)}ensureDisplaySize(e,t){const n=160/e*t;this.canvasResolution.height!==n&&(this.dom.display.style.height=`${n}px`,this.setCanvasResolution(160,n))}onWindowBlur(){this.setIsVisible(!1),this.changeEnd()}getVideoDuration(){return this.player.getMediaElement().duration}getThumbsTrack(){const e=this.player.getStats().estimatedBandwidth,t=this.player.getImageTracks().filter((t=>t.bandwidth<.01*e));return t.sort(((e,t)=>t.bandwidth-e.bandwidth)),t[0]}mouseEventToPosition(e){const t=this.getVideoDuration();if(!(t>0))return;if(null!==document.querySelector("input[type=button]:hover, button:hover"))return;const n=this.seekBar.getBoundingClientRect();if(!this.isChanging){const{left:t,right:s,bottom:i}=n;if(!(t<=e.clientX&&e.clientX<=s&&e.clientY<=i))return;const{top:a}=this.showContainer?this.dom.container.getBoundingClientRect():n;if(!(a<=e.clientY))return}const s=t/n.width;let a=e.clientX-n.left,o=i(a*s,[0,t]);const r=this.getChapter(o);let h=!1;if(r&&!this.isChanging){const e=(o-r.timecode)/s;-2<=e&&e<6&&(o=r.timecode,a=o/s,h=!0)}return{absolute:a,seconds:o,chapter:r,onChapterMarker:h}}async onPointerMove(e){const t=this.mouseEventToPosition(e);if(void 0===t)return this.setIsVisible(!1);this.isChanging&&!0&e.buttons&&this.interaction?.onChange?.(t),this.setIsVisible(!0,!1),this.renderSeekPosition(t);const n=this.getThumbsTrack();if(void 0===n)return;const s=await this.player.getThumbnails(n.id,t.seconds);if(null===s||0===s.uris.length)return;this.ensureDisplaySize(s.width,s.height);const i=s.uris[0];null===this.lastRendered||i!==this.lastRendered.uri?this.network.get(i).then((e=>{this.renderImageAndShow(i,s,e,t)})):this.renderImageAndShow(i,s,this.lastRendered.tilesetImage,t)}onPointerDown(e){const t=this.mouseEventToPosition(e);void 0!==t&&(this.isChanging||(this.interaction?.onChangeStart?.(),document.body.classList.add("seek-or-scrub"),this.isChanging=!0),this.interaction?.onChange?.(t))}onPointerUp(e){this.changeEnd(),void 0===this.mouseEventToPosition(e)&&this.setIsVisible(!1)}changeEnd(){this.isChanging&&(this.interaction?.onChangeEnd?.(),document.body.classList.remove("seek-or-scrub"),this.isChanging=!1)}renderThumbTimecode(e){const t=this.getFps(),n=a(e.startTime+e.duration/2-1e-5,this.getVideoDuration()>=3600,t);this.ctx.font="8px sans-serif",this.ctx.textBaseline="top";const s=this.ctx.measureText(n),i=s.width,o=s.actualBoundingBoxDescent,r=this.canvasResolution.width-(i+2);this.ctx.fillStyle="black",this.ctx.fillRect(r-2,0,i+4,o+4),this.ctx.fillStyle="white",this.ctx.fillText(n,r,2)}renderImage(e,t,n,s=!1){if(s||null===this.lastRendered||t.startTime!==this.lastRendered.thumb.startTime){let{positionX:s,positionY:i,width:a,height:o}=t;0<=a&&a<=1&&0<=o&&o<=1&&(s*=n.width,a*=n.width,i*=n.height,o*=n.height),this.ctx.drawImage(n,s,i,a,o,0,0,this.canvasResolution.width,this.canvasResolution.height),this.renderThumbTimecode(t),this.lastRendered={uri:e,thumb:t,tilesetImage:n}}}renderImageAndShow(e,t,n,s){this.renderImage(e,t,n),this.setIsVisible(!0),this.positionContainer(s)}positionContainer(e){const t=i(e.absolute-this.dom.container.offsetWidth/2,[0,this.seekBar.clientWidth-this.dom.container.offsetWidth]);this.dom.container.style.left=`${t}px`}renderSeekPosition(e){const t=this.getVideoDuration();if(!Number.isFinite(t))return void this.setIsVisible(!1);this.dom.seekMarker.style.left=`${e.absolute}px`,e.onChapterMarker?this.dom.info.classList.add("on-chapter-marker"):this.dom.info.classList.remove("on-chapter-marker");const n=e.chapter?.title??"";this.dom.chapterText.innerText=n,this.setElementVisible(this.dom.chapterText,""!==n),this.dom.timecodeText.innerText=a(e.seconds,t>=3600,this.getFps()),this.positionContainer(e)}setIsVisible(e,t=e){this.showContainer=e,this.setElementVisible(this.dom.container,e),this.setElementVisible(this.dom.seekMarker,e),this.setElementVisible(this.dom.display,t)}setElementVisible(e,t){t?e.classList.add("shown"):e.classList.remove("shown")}}class w extends g().ui.Element{static register(){g().ui.Controls.registerSeekBar({create:(e,t)=>new w(e,t)})}constructor(e,t){super(e,t),this._value=0,this._config=t.getConfig();const n=o('\n      <div class="sxnd-seek-bar">\n        <div class="range"></div>\n      </div>\n    ');e.prepend(n),this._dom={container:n,range:n.querySelector(".range")},this._seekTimer=new(g().util.Timer)((()=>{this.video.currentTime=this.getValue()})),this._wasPlaying=!1,this._thumbnailPreview=new b({seekBar:this._dom.container,player:this.player,getFps:()=>this.controls.elSxndPlayer.fps,getChapter:e=>this.controls.elSxndPlayer.chapters.timeToChapter(e),network:new k,interaction:{onChangeStart:()=>{this._wasPlaying=!this.video.paused,this.controls.setSeeking(!0),this.video.pause()},onChange:e=>{this._value=e.seconds,this.update(),this._seekTimer.tickAfter(.125)},onChangeEnd:()=>{this._seekTimer.tickNow(),this.controls.setSeeking(!1),this._wasPlaying&&this.video.play()}}}),this.eventManager.listen(this.player,"loaded",(()=>{this.renderChapterMarkers()})),this.eventManager.listen(this.controls,"sxnd-thumbs-close",(()=>{this._thumbnailPreview.setIsVisible(!1)}))}release(){this._seekTimer.stop(),this._seekTimer=null,this._thumbnailPreview.release(),this._thumbnailPreview=null,super.release()}getValue(){return this._value}setValue(e){this.controls.isSeeking()||(this._value=e)}makeColor_(e,t){return e+" "+100*t+"%"}update(){const e=this.video.duration;if(!e)return;const t=this._config.seekBarColors,n=this.getValue(),s=this.video.buffered.length,i=s?this.video.buffered.start(0):0,a=s?this.video.buffered.end(s-1):0,o={start:0,end:e},r=o.end-o.start;if(0==s)this._dom.range.style.background=t.base;else{const e=Math.max(i,o.start),s=Math.min(a,o.end),h=Math.min(Math.max(n,o.start),o.end),l=(e-o.start)/r||0,c=(s-o.start)/r||0,d=(h-o.start)/r||0,p=this._config.showUnbufferedStart?t.base:t.played,m=["to right",this.makeColor_(p,l),this.makeColor_(t.played,l),this.makeColor_(t.played,d),this.makeColor_(t.buffered,d),this.makeColor_(t.buffered,c),this.makeColor_(t.base,c)];this._dom.range.style.background="linear-gradient("+m.join(",")+")"}}isShowing(){return!0}renderChapterMarkers(){const{video:e,chapters:t}=this.controls.elSxndPlayer;if(e.duration>0)for(const n of t){const t=n.timecode/e.duration;if(!(0<=t&&t<1))continue;const s=document.createElement("span");s.className="sxnd-chapter-marker",s.style.position="absolute",s.style.left=100*t+"%",this._dom.range.append(s)}}}class _ extends g().ui.Element{constructor(e,t,n){super(e,t),this.env=n,this.currentTime_=document.createElement("button"),this.currentTime_.classList.add("shaka-current-time"),this.parent.appendChild(this.currentTime_),this.state={activeMode:0},this.eventManager.listen(this.currentTime_,"click",(()=>{this.render({activeMode:(this.state.activeMode+1)%3})}));const s=()=>{this.render({duration:this.controls.elSxndPlayer.video.duration,totalSeconds:this.controls.getDisplayTime()})};this.eventManager.listen(this.player,"loaded",s),this.eventManager.listen(this.controls,"timeandseekrangeupdated",s)}static register(e){const t=e.mkid();return g().ui.Controls.registerElement(t,{create:(t,n)=>new _(t,n,e)}),t}render(e){const t=Object.assign({},this.state,e),{totalSeconds:n,duration:s,activeMode:i}=t;if(n!==this.state.totalSeconds||s!==this.state.duration||i!==this.state.activeMode){let e="",t="";if(Number.isFinite(s)){const o=this.controls.elSxndPlayer,r=s>=3600;switch(i){default:e=`${a(n,r,o.fps)} / ${a(s,r,o.fps)}`,t=this.env.t("control.time.current-time.tooltip");break;case 1:e=this.env.t("control.time.remaining-time.text",{timecode:a(o.video.duration-n,r,o.fps)}),t=this.env.t("control.time.remaining-time.tooltip");break;case 2:e=`${o.vifa?.get()??this.env.t("control.time.current-frame.unknown")}`,t=this.env.t("control.time.current-frame.tooltip")}let h=o.chapters.timeToChapter(n);h&&(e+=` – ${h.title}`)}this.currentTime_.textContent=e,this.currentTime_.title=t}this.state=t}}class T{constructor(e){this.env=e.env,this.container=e.container,this.video=e.video,this.chapters=e.chapters,this.controlPanelButtons=e.controlPanelButtons??[],this.overflowMenuButtons=e.overflowMenuButtons??[],this.constants=Object.assign({prevChapterTolerance:5},e.constants),this.handlers={onTrackChange:this.onTrackChange.bind(this)}}static initSupport(e=!0){if(g().polyfill.installAll(),g().Player.isBrowserSupported()){if(e){class e extends g().hls.HlsParser{async start(e,t){const n=await super.start(e,t);for(const e of n.imageStreams)e.width=1,e.height=1;return n}}g().media.ManifestParser.registerParserByExtension("m3u8",(()=>new e)),g().media.ManifestParser.registerParserByMime("application/x-mpegurl",(()=>new e)),g().media.ManifestParser.registerParserByMime("application/vnd.apple.mpegurl",(()=>new e))}return window.MediaSource&&window.MediaSource.isTypeSupported?["mpd","hls"]:["hls"]}return[]}initialize(){this.fps=null,this.vifa=null,this.player=new(g().Player)(this.video);const e=new(g().ui.Overlay)(this.player,this.container,this.video);this.controls=e.getControls(),this.controls.elSxndPlayer=this,w.register();const t={addSeekBar:!0,controlPanelElements:["play_pause","chapters_menu",_.register(this.env),"spacer","volume","mute",...this.controlPanelButtons,"fullscreen","overflow_menu"],overflowMenuButtons:["language","playback_rate","loop","quality","picture_in_picture","captions",...this.overflowMenuButtons],addBigPlayButton:!0,seekBarColors:{base:"rgba(255, 255, 255, 0.3)",buffered:"rgba(255, 255, 255, 0.54)",played:"rgb(255, 255, 255)",adBreaks:"rgb(255, 204, 0)"}};e.configure(t),this.player.addEventListener("error",this.onPlayerErrorEvent.bind(this)),this.controls.addEventListener("error",this.onUiErrorEvent.bind(this)),this.player.addEventListener("adaptation",this.handlers.onTrackChange),this.player.addEventListener("variantchanged",this.handlers.onTrackChange)}async loadManifest(e,t){await this.player.load(e,t)}onTrackChange(){this.updateFrameRate()}updateFrameRate(){const e=this.player.getVariantTracks().find((e=>e.active))?.frameRate??null;null===e?(this.fps=null,this.vifa=null):e!==this.fps&&(this.fps=e,this.vifa=VideoFrame({id:this.video.id,frameRate:e}))}setLocale(e){this.controls.getLocalization().changeLocale([e])}onPlayerErrorEvent(e){this.onPlayerError(e.detail)}onUiErrorEvent(e){this.onPlayerError(e.detail)}onPlayerError(e){console.error("Error code",e.code,"object",e)}get currentTime(){return this.video.currentTime}get displayTime(){return this.controls.getDisplayTime()}getCurrentChapter(){return this.timeToChapter(this.currentTime)}timeToChapter(e){return this.chapters.timeToChapter(e)}play(){this.video.play()}pause(){this.video.pause()}seekTo(e){null!=e&&("number"==typeof e?this.video.currentTime=e:"number"==typeof e.timecode&&(this.video.currentTime=e.timecode))}skipSeconds(e){this.video.currentTime+=e}prevChapter(){this.seekTo(this.timeToChapter(this.currentTime-this.constants.prevChapterTolerance)??0)}nextChapter(){let e=this.getCurrentChapter();e&&this.seekTo(this.chapters.advance(e,1))}ensureTrickPlay(e){this.player.getPlaybackRate()!==e&&this.player.trickPlay(e)}cancelTrickPlay(){try{return this.player.cancelTrickPlay(),!0}catch(e){return!1}}}var C=n(8),x=n.n(C);class P{constructor(e){this._jpeg=e,this._exif={"0th":{},Exif:{}}}static fromBinaryString(e){return new P(e)}toBinaryString(){const e=x().dump(this._exif);return x().insert(e,this._jpeg)}addMetadata(e){e.title&&(this._exif["0th"][x().ImageIFD.ImageDescription]=e.title),e.comment&&(this._exif.Exif[x().ExifIFD.UserComment]=e.comment)}}const S=String.fromCharCode(137,80,78,71,13,10,26,10);class E{constructor(e,t){this._headerChunk=e,this._chunks=t}static createChunk(e){const t={};switch(e.type){case"raw":t.type=e.rawType,t.data=e.rawData;break;case"iTXt":t.type="iTXt",t.data=`${e.keyword.replace(/\0/g,"")}\0\0\0\0\0${e.text}`;break;case"IEND":t.type="IEND",t.data=""}return t.size=t.data.length,t.crc=function(e){for(var t=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],n=-1,s=0;s<e.length;s++)n=n>>>8^t[255&(n^e.charCodeAt(s))];return(-1^n)>>>0}(t.type+t.data),t}addChunk(e){const t=E.createChunk(e);if("iTXt"!==t.type)throw new Error(`Adding chunk type ${t.type} is not supported.`);this._chunks.unshift(t)}static fromBinaryString(e){if(!function(e){return e.substr(0,8)==S}(e.substr(0,8)))return;let t;e=e.substr(8);for(var n=[];""!=e;){var s={},i=M(e.substr(0,4));i<0&&(i=0);var a=e.substr(0,i+12);e=e.substr(i+12),s.size=i,s.type=a.substr(4,4),s.data=a.substr(8,i),s.crc=M(a.substr(8+i,4)),"IHDR"===s.type?t=s:"IEND"!==s.type&&n.push(s)}return new E(t,n)}toBinaryString(){var e=S;const t=t=>{var n="";n+=L(t.size,4),n+=t.type,n+=t.data,n+=L(t.crc,4),e+=n};for(var n in t(this._headerChunk),this._chunks)t(this._chunks[n]);return t(E.createChunk({type:"IEND"})),e}addMetadata(e){for(const t of Object.keys(e)){const n=e[t];if(!n)continue;const s={title:"Title",comment:"Comment"}[t];s&&this.addChunk({type:"iTXt",keyword:s,text:n})}}}function L(e,t){for(var n=[],s=t-1;s>=0;){var i=255&e;n[s--]=i,e>>=8}return n=n.map((function(e){return String.fromCharCode(e)})),n.join("")}function M(e){for(var t=0,n=0;n<e.length;n++)t=t<<8|255&e.charCodeAt(n);return t}const I=[{mimeType:"image/png",label:"PNG",parseBinaryString:e=>E.fromBinaryString(e)},{mimeType:"image/jpeg",label:"JPEG",parseBinaryString:e=>P.fromBinaryString(e)},{mimeType:"image/tiff",label:"TIFF",parseBinaryString:()=>{}}];class A extends c{constructor(e,t,n){const s=I.filter((e=>t.supportsCanvasExport(e.mimeType)));super(e,{env:t,metadata:null,showMetadata:!0,timecode:null,supportedImageFormats:s,selectedImageFormat:s[0]}),this._videoDomElement=n.video}_createDom(){const e=this._state.env,t=super._createDom("screenshot-modal");t.title.innerText=e.t("modal.screenshot.title");const n=e.mkid();t.config=o(`\n      <div class="screenshot-config">\n        <span class="show-metadata">\n          <input type="checkbox" id="${n}">\x3c!--\n          --\x3e<label for="${n}"></label>\n        </span>\n\n        ·\n\n        <span class="image-format">\n          <label></label>:\n          <span class="format-list"></span>\n        </span>\n\n        ·\n\n        <a href="#" class="download-image"></a>\n      </div>\n    `),t.showMetadata=t.config.querySelector(".show-metadata input[type=checkbox]"),t.showMetadata.checked=this._state.showMetadata,t.showMetadata.addEventListener("change",this.handleChangeShowMetadata.bind(this)),t.showMetadataLabel=t.config.querySelector(".show-metadata label"),t.showMetadataLabel.innerText=e.t("modal.screenshot.show-metadata"),t.formatListLabel=t.config.querySelector(".image-format label"),t.formatListLabel.innerText=e.t("modal.screenshot.file-format"),t.formatListSpan=t.config.querySelector(".image-format .format-list");const s=e.mkid();for(const n of this._state.supportedImageFormats){const i=e.mkid(),a=document.createElement("input");a.id=i,a.name=s,a.type="radio",a.checked=n.mimeType===this._state.selectedImageFormat.mimeType,a.addEventListener("change",(()=>{this.setState({selectedImageFormat:n})}));const o=document.createElement("label");o.htmlFor=i,o.innerText=` ${n.label}`,t.formatListSpan.append(a,o)}return t.downloadImage=t.config.querySelector(".download-image"),t.downloadImage.innerText=e.t("modal.screenshot.download-image"),t.downloadImage.addEventListener("click",this.handleDownloadImage.bind(this)),t.body.append(t.config),t.canvas=document.createElement("canvas"),t.body.append(t.canvas),t}setMetadata(e){return this.setState({metadata:e}),this}setTimecode(e){return this.setState({timecode:e}),this}handleChangeShowMetadata(e){this.setState({showMetadata:e.target.checked})}async handleDownloadImage(e){e.preventDefault();const t=this._state.selectedImageFormat,n=this._state.metadata.metadata.title,s=await(i=this._dom.canvas,o=t.mimeType,new Promise((e=>{i.toBlob(e,o,undefined)})));var i,o;const r=await(h=s,new Promise(((e,t)=>{const n=new FileReader;n.onload=t=>{e(t.target.result)},n.onerror=e=>{t(e.target.error)},n.readAsBinaryString(h)})));var h;const l=t.parseBinaryString(r);let c=s;if(l){const e=new URL(window.location);e.searchParams.set("timecode",this._state.timecode),l.addMetadata({title:n,comment:`Screenshot taken on Sachsen.Digital.\n\n${e.toString()}`});const t=function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(l.toBinaryString());c=new Blob([t],{type:s.type})}!function(e,t){const n=URL.createObjectURL(e);try{t(n)}catch(e){throw e}finally{URL.revokeObjectURL(n)}}(c,(e=>{const t=document.createElement("a");t.href=e,t.download=function(e){const t=e.replace(/[^a-zA-Z0-9()]+/g,"_");return t.length>0?t:"_"}(`Screenshot-${n}-T${a(this._state.timecode,!0)}`),t.click()}))}render(e){super.render(e);const{show:t,metadata:n,showMetadata:s}=e;var i;!t||this._state.show&&s===this._state.showMetadata||function(e,t,n){const[s,i]=e instanceof HTMLCanvasElement?[e,e.getContext("2d")]:[e.canvas,e];s.width=t.videoWidth,s.height=t.videoHeight,i.drawImage(t,0,0,s.width,s.height);const a=s.height/1080,o=10*a;i.font=`${Math.floor(25*a)}px Arial`,i.fillStyle="#FFFFFF",i.shadowBlur=5,i.shadowColor="black";for(const e of n.captions){const t="left"===e.h?o:s.width-o,n="top"===e.v?o:s.height-o;i.textAlign=e.h,i.fillText(e.text,t,n)}}(this._dom.canvas,this._videoDomElement,{captions:s?[{v:"bottom",h:"left",text:"https://sachsen.digital"},{v:"bottom",h:"right",text:(i=n,i.screenshotFields.map((e=>i.metadata[e])).filter((e=>"string"==typeof e)).join(" / "))}]:[]})}}const B=JSON.parse('[{"key":"Escape","action":"cancel","propagate":true,"kind":"other","order":100},{"key":"F1","action":"modal.help.toggle","kind":"other","order":99},{"key":"b","scope":"player","action":"modal.bookmark.open","kind":"other","order":30},{"key":"s","scope":"player","action":"modal.screenshot.open","kind":"other","order":31},{"key":"f","repeat":false,"scope":"player","action":"fullscreen.toggle","kind":"other","order":20},{"key":" ","repeat":false,"scope":"player","action":"playback.toggle","kind":"other","order":0},{"key":"m","repeat":false,"scope":"player","action":"playback.volume.mute.toggle","kind":"other","order":12},{"key":"ArrowUp","scope":"player","action":"playback.volume.inc","kind":"other","order":10},{"key":"ArrowDown","scope":"player","action":"playback.volume.dec","kind":"other","order":11},{"key":"ArrowLeft","repeat":false,"scope":"player","action":"navigate.rewind","kind":"navigate","order":0},{"key":"ArrowRight","repeat":false,"scope":"player","action":"navigate.seek","kind":"navigate","order":1},{"key":"ArrowLeft","repeat":true,"scope":"player","action":"navigate.continuous-rewind","kind":"navigate","order":2},{"key":"ArrowRight","repeat":true,"scope":"player","action":"navigate.continuous-seek","kind":"navigate","order":3},{"mod":"CtrlMeta","key":"ArrowLeft","scope":"player","action":"navigate.chapter.prev","kind":"navigate","order":10},{"mod":"CtrlMeta","key":"ArrowRight","scope":"player","action":"navigate.chapter.next","kind":"navigate","order":11},{"mod":"Shift","key":"ArrowLeft","scope":"player","action":"navigate.frame.prev","kind":"navigate","order":20},{"mod":"Shift","key":"ArrowRight","scope":"player","action":"navigate.frame.next","kind":"navigate","order":21},{"key":",","scope":"player","action":"navigate.frame.prev","kind":"navigate","order":20},{"key":".","scope":"player","action":"navigate.frame.next","kind":"navigate","order":21}]');window.SxndPlayerApp=class{constructor(e,t,n){this.container=e,this.videoInfo=t,this.lang=n,this.constants={prevChapterTolerance:5,volumeStep:.05,seekStep:10,trickPlayFactor:4},this.handlers={onKeyDown:this.onKeyDown.bind(this),onKeyUp:this.onKeyUp.bind(this),onClickChapterLink:this.onClickChapterLink.bind(this)},this.env=new r,this.env.setLang(n),this.manifestUri=null;for(const e of T.initSupport())if(t.url[e]){this.manifestUri=t.url[e];break}if(null===this.manifestUri)return void this.failWithError("error.playback-not-supported");const s=this.videoInfo.metadata.metadata;for(const e of Object.keys(s))Array.isArray(s[e])&&(s[e].length>0?s[e]=s[e][0]:delete s[e]);this.actions={cancel:()=>{this.hideThumbnailPreview(),this.modals.closeNext()},"modal.help.open":()=>{this.hideThumbnailPreview(),this.modals.help.open()},"modal.help.toggle":()=>{this.hideThumbnailPreview(),this.modals.help.toggle()},"modal.bookmark.open":()=>{this.showBookmarkUrl()},"modal.screenshot.open":()=>{this.showScreenshot()},"fullscreen.toggle":()=>{this.hideThumbnailPreview(),this.sxndPlayer.controls.toggleFullScreen()},"playback.toggle":()=>{this.sxndPlayer.video.paused?this.sxndPlayer.video.play():this.sxndPlayer.video.pause()},"playback.volume.mute.toggle":()=>{this.sxndPlayer.video.muted=!this.sxndPlayer.video.muted},"playback.volume.inc":()=>{this.sxndPlayer.video.volume=Math.min(1,this.sxndPlayer.video.volume+this.constants.volumeStep)},"playback.volume.dec":()=>{this.sxndPlayer.video.volume=Math.max(0,this.sxndPlayer.video.volume-this.constants.volumeStep)},"navigate.rewind":()=>{this.sxndPlayer.skipSeconds(-this.constants.seekStep)},"navigate.seek":()=>{this.sxndPlayer.skipSeconds(+this.constants.seekStep)},"navigate.continuous-rewind":()=>{this.sxndPlayer.ensureTrickPlay(-this.constants.trickPlayFactor)},"navigate.continuous-seek":()=>{this.sxndPlayer.ensureTrickPlay(this.constants.trickPlayFactor)},"navigate.chapter.prev":()=>{this.sxndPlayer.prevChapter()},"navigate.chapter.next":()=>{this.sxndPlayer.nextChapter()},"navigate.frame.prev":()=>{this.sxndPlayer.vifa?.seekBackward(1)},"navigate.frame.next":()=>{this.sxndPlayer.vifa?.seekForward(1)}},this.keybindings=B,this.load()}failWithError(e){const t=document.createElement("div");t.className="sxnd-player-fatal-error",t.innerText=this.env.t(e),this.container.innerHTML="",this.container.append(t)}load(){this.chapterLinks=Array.from(document.querySelectorAll("a[data-timecode]"));for(const e of this.chapterLinks)e.sxndTimecode=Number(e.getAttribute("data-timecode"));const e=document.createElement("video");e.id="video",e.poster=this.videoInfo.url.poster,e.style.width="100%",e.style.height="100%",this.container.append(e);const t=new m(this.videoInfo.chapters);let n=new URL(window.location).searchParams.get("timecode");null===n&&void 0!==this.videoInfo.pageNo&&(n=t.at(this.videoInfo.pageNo-1).timecode);const s=n?parseFloat(n):void 0,i=new T({env:this.env,container:this.container,video:document.getElementById("video"),chapters:t,controlPanelButtons:[v.register(this.env,{material_icon:"photo_camera",title:this.env.t("control.screenshot.tooltip"),onClick:this.actions["modal.screenshot.open"]}),v.register(this.env,{material_icon:"bookmark_border",title:this.env.t("control.bookmark.tooltip"),onClick:this.actions["modal.bookmark.open"]}),v.register(this.env,{material_icon:"help_outline",title:this.env.t("control.help.tooltip"),onClick:this.actions["modal.help.open"]})],constants:this.constants});i.initialize(),i.setLocale(this.lang.twoLetterIsoCode),i.loadManifest(this.manifestUri,s).then((()=>{document.addEventListener("keydown",this.handlers.onKeyDown,{capture:!0}),document.addEventListener("keyup",this.handlers.onKeyUp,{capture:!0});for(const e of this.chapterLinks)e.addEventListener("click",this.handlers.onClickChapterLink)})).catch((()=>{this.failWithError("error.load-failed")})),this.modals=function(e){const t=Object.assign({},e),n=Object.values(e),s=document.createElement("div");s.className="sxnd-modal-cover",s.addEventListener("click",(()=>{t.closeAll()})),document.body.append(s);for(const e of n)e.on("updated",(()=>{t.hasOpen()?s.classList.add("shown"):s.classList.remove("shown")}));return t.hasOpen=()=>n.some((e=>e.isOpen)),t.closeNext=()=>{for(const e of n)if(e.isOpen){e.close();break}},t.closeAll=()=>{for(const e of n)e.close()},t}({help:new y(this.container,this.env,{constants:this.constants,keybindings:this.keybindings}),bookmark:new d(this.container,this.env),screenshot:new A(this.container,this.env,{video:i.video})}),this.sxndPlayer=i}hideThumbnailPreview(){this.sxndPlayer.controls.dispatchEvent(new Event("sxnd-thumbs-close"))}getKeyboardScope(){return this.modals.hasOpen()?"modal":"player"}onKeyDown(e){let t=!0;const n=function(e){let t=f.None;return(e.ctrlKey||e.metaKey)&&(t|=f.CtrlMeta),e.shiftKey&&(t|=f.Shift),e.altKey&&(t|=f.Alt),t}(e),s=this.getKeyboardScope(),i=this.keybindings.find((t=>!("function"!=typeof this.actions[t.action]||t.key!==e.key||null!=t.repeat&&t.repeat!==e.repeat||null!=t.scope&&t.scope!==s||f[t.mod??"None"]!==n)));i&&(e.preventDefault(),this.actions[i.action](),!0===i.propagate&&(t=!1)),t&&e.stopImmediatePropagation()}onKeyUp(e){e.stopImmediatePropagation(),this.sxndPlayer.cancelTrickPlay()}onClickChapterLink(e){e.preventDefault();const t=Number(e.currentTarget.getAttribute("data-timecode"));this.sxndPlayer.play(),this.sxndPlayer.seekTo(t)}showBookmarkUrl(){this.sxndPlayer.pause(),this.hideThumbnailPreview(),this.modals.bookmark.setTimecode(this.sxndPlayer.displayTime).open()}showScreenshot(){this.sxndPlayer.pause(),this.hideThumbnailPreview(),this.modals.screenshot.setMetadata(this.videoInfo.metadata).setTimecode(this.sxndPlayer.displayTime).open()}}}},n={};function s(e){var i=n[e];if(void 0!==i)return i.exports;var a=n[e]={exports:{}};return t[e](a,a.exports,s),a.exports}s.m=t,e=[],s.O=(t,n,i,a)=>{if(!n){var o=1/0;for(c=0;c<e.length;c++){for(var[n,i,a]=e[c],r=!0,h=0;h<n.length;h++)(!1&a||o>=a)&&Object.keys(s.O).every((e=>s.O[e](n[h])))?n.splice(h--,1):(r=!1,a<o&&(o=a));if(r){e.splice(c--,1);var l=i();void 0!==l&&(t=l)}}return t}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[n,i,a]},s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var n in t)s.o(t,n)&&!s.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={825:0};s.O.j=t=>0===e[t];var t=(t,n)=>{var i,a,[o,r,h]=n,l=0;if(o.some((t=>0!==e[t]))){for(i in r)s.o(r,i)&&(s.m[i]=r[i]);if(h)var c=h(s)}for(t&&t(n);l<o.length;l++)a=o[l],s.o(e,a)&&e[a]&&e[a][0](),e[o[l]]=0;return s.O(c)},n=self.webpackChunkslub_web_sachsendigital=self.webpackChunkslub_web_sachsendigital||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var i=s.O(void 0,[276],(()=>s(615)));i=s.O(i)})();
//# sourceMappingURL=SxndPlayerApp.js.map