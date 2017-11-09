"use strict";

if (window.rpk === undefined) {
    window.rpk = {};
}

window.rpk.Renderer = (function() {
    function Renderer() {}

    Renderer.prototype.renderTemplateToSelector = function (selector, templateHTML, dataObj) {
        const renderedHTML = renderTemplate(templateHTML, dataObj);
        this.setInnerHTMLToSelector(selector, renderedHTML);
    }
    
    Renderer.prototype.renderTemplate = function (templateHTML, dataObj) {
        const replacer = function (substring, offset) {
            const expression = substring.slice(1, -1);
            return eval('dataObj.' + expression);
        };
        const templateVarRegex = /{[^{]+}/gi;
        return templateHTML.replace(templateVarRegex, replacer);   
    }
    
    Renderer.prototype.setInnerHTMLToSelector = function (selector, innerHTML) {
        const anchors = document.querySelectorAll(selector);
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].innerHTML = innerHTML;
        }
    }

    return Renderer
})();

