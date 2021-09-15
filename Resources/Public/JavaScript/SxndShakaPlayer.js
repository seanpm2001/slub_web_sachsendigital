(()=>{var e={707:(e,t,n)=>{"use strict";n.r(t)},201:(e,t,n)=>{"use strict";n.r(t)},623:(e,t,n)=>{const r=n(311);function a(e,t,n){const[r,a]=e instanceof HTMLCanvasElement?[e,e.getContext("2d")]:[e.canvas,e];for(var o=[],i="",s=0;s<n.screenshotFields.length;s++)"string"==typeof n.metadata[n.screenshotFields[s]]&&o.push(n.metadata[n.screenshotFields[s]]);for(s=0;s<o.length;s++)o.length-1!==s?i+=o[s]+" / ":i+=o[s];r.width=t.videoWidth,r.height=t.videoHeight,a.drawImage(t,0,0,r.width,r.height),a.font="25px Arial",a.textAlign="end",a.fillStyle="#FFFFFF",a.shadowBlur=5,a.shadowColor="black",a.fillText(i,r.width-10,r.height-10),r.style.width="80%",r.style.height="auto"}e.exports={drawCanvas:a,renderScreenshot:function(e){var t=r("<div id='screenshot-overlay'><span class='close-screenshot-modal icon-close'></span><canvas id='screenshot-canvas'></canvas></div>");r("body").append(t),r(".close-screenshot-modal").bind("click",(function(){r("#screenshot-overlay").detach()})),a(document.getElementById("screenshot-canvas"),e,function(){var e=r("#metadata"),t={metadata:[]};t.screenshotFields=e.data("screenshotfields").split(",");for(var n=0;n<e.children().length;n++)e.children()[n].value.length&&(t.metadata[e.children()[n].id]=e.children()[n].value);return t}())}}},311:e=>{"use strict";e.exports=jQuery}},t={};function n(r){var a=t[r];if(void 0!==a)return a.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,n),o.exports}n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{const e=n(311),{renderScreenshot:t}=n(623);var r,a,o,i,s;n(201),n(707);var u=function(e){var t={},n=document.createElement("a");n.href=e;var r=n.search.substring(1).split("&");if(r[0].length){for(var a=0;a<r.length;a++){var o=r[a].split("=");t[o[0]]=decodeURIComponent(o[1])}return t}return!1};function l(e){c(event.detail)}function c(e){console.error("Error code",e.code,"object",e)}function d(e){c(event.detail)}document.addEventListener("shaka-ui-loaded",(async function(){r=document.getElementById("video"),o=document.getElementsByClassName("mime-type-video")[0].getAttribute("data-url")+".mpd";const t=r.ui;a=t.getControls(),i=new shaka.Player(r),t.configure({addSeekBar:!0,controlPanelElements:["play_pause","chapters_menu","time_and_duration_frame","spacer","volume","mute","replay_10","skip_previous","skip_next","forward_10","capture","bookmark","fullscreen","overflow_menu"],overflowMenuButtons:["language","playback_rate","loop","quality","picture_in_picture","captions"],addBigPlayButton:!0,seekBarColors:{base:"rgba(255, 255, 255, 0.3)",buffered:"rgba(255, 255, 255, 0.54)",played:"rgb(255, 255, 255)",adBreaks:"rgb(255, 204, 0)"}}),window.player=i,window.ui=t,i.addEventListener("error",l),a.addEventListener("error",d),s=VideoFrame({id:"video",frameRate:25,callback:function(e){console.log("callback response: "+e)}}),e("a[data-timecode]").on("click",(function(){var t;t=e(this).data("timecode"),r.paused&&r.play(),r.currentTime=t}));try{console.log("The video has now been loaded!"),u(document.URL).timecode?await i.load(o,parseFloat(u(document.URL).timecode)):await i.load(o)}catch(e){onError(e)}})),document.addEventListener("shaka-ui-load-failed",(function(e){console.error("Unable to load the UI library!")})),document.addEventListener("keydown",(e=>{const t=document.querySelector("video");let n=r.volume;if("f"==e.key)document.fullscreenElement?document.exitFullscreen():t.requestFullscreen(),e.preventDefault();else if(" "==e.key)r.paused?r.play():r.pause(),e.preventDefault();else if("ArrowUp"==e.key){if(e.preventDefault(),1!=n)try{r.volume=n+.05}catch(e){r.volume=1}}else if("ArrowDown"==e.key){if(e.preventDefault(),0!=n)try{r.volume=n-.05}catch(e){r.volume=0}}else"p"==e.key&&(e.preventDefault(),s.seekForward(1))}));class h{}function m(){var t=document.URL,n=e("#url-field"),r=e("#url-container");t=u(t)?t+"&timecode="+a.getDisplayTime():t+"?timecode="+a.getDisplayTime(),n.val(t),r.show("fast")}h.CaptureButton=class extends shaka.ui.Element{constructor(e,n){super(e,n),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="Screenshot",this.button_.textContent="photo_camera",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{t(document.getElementById("video"))}))}},h.CaptureButton.Factory=class{create(e,t){return new h.CaptureButton(e,t)}},shaka.ui.Controls.registerElement("capture",new h.CaptureButton.Factory),h.SkipNextButton=class extends shaka.ui.Element{constructor(e,t){super(e,t),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="Einzelbild zurück",this.button_.textContent="skip_next",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{s.seekForward(1)}))}},h.SkipNextButton.Factory=class{create(e,t){return new h.SkipNextButton(e,t)}},shaka.ui.Controls.registerElement("skip_next",new h.SkipNextButton.Factory),h.SkipPreviousButton=class extends shaka.ui.Element{constructor(e,t){super(e,t),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="Einzelbild zurück",this.button_.textContent="skip_previous",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{s.seekBackward(1)}))}},h.SkipPreviousButton.Factory=class{create(e,t){return new h.SkipPreviousButton(e,t)}},shaka.ui.Controls.registerElement("skip_previous",new h.SkipPreviousButton.Factory),h.Forward10Button=class extends shaka.ui.Element{constructor(e,t){super(e,t),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="10 Sekunden vor",this.button_.textContent="forward_10",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{r.currentTime=r.currentTime+10}))}},h.Forward10Button.Factory=class{create(e,t){return new h.Forward10Button(e,t)}},shaka.ui.Controls.registerElement("forward_10",new h.Forward10Button.Factory),h.Replay10Button=class extends shaka.ui.Element{constructor(e,t){super(e,t),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="10 Sekunden zurück",this.button_.textContent="replay_10",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{r.currentTime=r.currentTime-10}))}},h.Replay10Button.Factory=class{create(e,t){return new h.Replay10Button(e,t)}},shaka.ui.Controls.registerElement("replay_10",new h.Replay10Button.Factory),h.BookmarkButton=class extends shaka.ui.Element{constructor(e,t){super(e,t),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="Bookmark",this.button_.textContent="bookmark_border",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{m()}))}},h.BookmarkButton.Factory=class{create(e,t){return new h.BookmarkButton(e,t)}},shaka.ui.Controls.registerElement("bookmark",new h.BookmarkButton.Factory),h.PresentationTimeTracker=class extends shaka.ui.Element{constructor(e,t){super(e,t),this.currentTime_=document.createElement("button"),this.currentTime_.classList.add("shaka-current-time"),this.currentTime_.title="Aktuelle Laufzeit / Gesamtlaufzeit",this.setValue_("0:00"),this.parent.appendChild(this.currentTime_),this.mode=["currentTime","remainingTime","currentFrame"],this.modeActive=this.mode[0],this.eventManager.listen(this.currentTime_,"click",(()=>{switch(this.modeActive){default:this.modeActive=this.mode[1];break;case"remainingTime":this.modeActive=this.mode[2];break;case"currentFrame":this.modeActive=this.mode[0]}})),this.eventManager.listen(this.controls,"timeandseekrangeupdated",(()=>{let e=this.controls.getDisplayTime();const t=r.duration>=3600;switch(this.modeActive){default:this.updateTime_();break;case"remainingTime":this.setValue_(this.buildTimeString_(r.duration-e,t)),this.currentTime_.title="Restlaufzeit";break;case"currentFrame":this.setValue_(s.get()),this.currentTime_.title="Frame-Nummer"}}))}setValue_(e){e!=this.currentTime_.textContent&&(this.currentTime_.textContent=e)}updateTime_(){const e=r.duration>=3600;let t=this.controls.getDisplayTime(),n=this.buildTimeString_(t,e);n+=":"+("0"+s.get()%25).slice(-2),r.duration&&(n+=" / "+this.buildTimeString_(r.duration,e)),this.setValue_(n),this.currentTime=n}buildTimeString_(e,t){const n=Math.floor(e/3600),r=Math.floor(e/60%60);let a=Math.floor(e%60);a<10&&(a="0"+a);let o=r+":"+a;return t&&(r<10&&(o="0"+o),o=n+":"+o),o}},h.PresentationTimeTracker.Factory=class{create(e,t){return new h.PresentationTimeTracker(e,t)}},shaka.ui.Controls.registerElement("time_and_duration_frame",new h.PresentationTimeTracker.Factory)})()})();
//# sourceMappingURL=SxndShakaPlayer.js.map