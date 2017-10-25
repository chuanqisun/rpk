// event hub
// https://github.com/henrysun918/rpk/blob/master/modules/rpk-event-hub/rpk-event-hub.js
"use strict";window.rpk===void 0&&(window.rpk={}),window.rpk.EventHub=function(){function a(){this.channels={}}return a.prototype.subscribe=function(b,c){void 0===this.channels[b]&&(this.channels[b]=[]),this.channels[b].push(c)},a.prototype.unsubscribe=function(b,c){const d=this.channels[b].indexOf(c);-1<d&&this.channels[b].splice(d,1),0===this.channels[b].length&&delete this.channels[b]},a.prototype.publish=function(b,c){if(void 0!==this.channels[b])for(let d=0;d<this.channels[b].length;d++)this.channels[b][d](c)},a}();

// renderer
// https://github.com/henrysun918/rpk/blob/master/modules/rpk-renderer/rpk-renderer.js
"use strict";window.rpk===void 0&&(window.rpk={}),window.rpk.Renderer=function(){function Renderer(){}return Renderer.prototype.renderTemplateToSelector=function(a,b,c){const d=renderTemplate(b,c);setInnerHTMLToSelector(a,d)},Renderer.prototype.renderTemplate=function(templateHTML){const templateVarRegex=/{[^{]+}/gi;return templateHTML.replace(templateVarRegex,function(substring){const expression=substring.slice(1,-1);return eval("dataObj."+expression)})},Renderer.prototype.setInnerHTMLToSelector=function(a,b){const c=document.querySelectorAll(a);for(let d=0;d<c.length;d++)c[d].innerHTML=b},Renderer}();

// playlist
// https://github.com/henrysun918/rpk/blob/master/modules/rpk-playlist/rpk-playlist.js
"use strict";window.rpk===void 0&&(window.rpk={}),window.rpk.Playlist=function(){function a(){this.previousStack=[],this.nextStack=[],this.currentStack=[]}return a.prototype.addToQueue=function(b){this.nextStack.unshift(b)},a.prototype.addToNext=function(b){this.nextStack.push(b)},a.prototype.hasPrevious=function(){return 0<this.previousStack.length},a.prototype.hasCurrent=function(){return 0<this.currentStack.length},a.prototype.hasNext=function(){return 0<this.nextStack.length},a.prototype.goToNext=function(){return this.hasCurrent()&&this.previousStack.push(this.currentStack.pop()),this.hasNext()&&this.currentStack.push(this.nextStack.pop()),this.getCurrent()},a.prototype.goToPrevious=function(){return this.hasCurrent()&&this.nextStack.push(this.currentStack.pop()),this.hasPrevious()&&this.currentStack.push(this.previousStack.pop()),this.getCurrent()},a.prototype.getCurrent=function(){return this.currentStack[0]},a}();