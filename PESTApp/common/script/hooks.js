/*需配合WEB端的reader.css互补,解决图片裁剪问题*/
/*reader.css中不要指定img样式,要由hooks自行控制才可以*/
/*参考自:https://blog.csdn.net/yin138/article/details/48543255*/
EPUBJS.Hooks.register("beforeChapterDisplay").smartimages = function (callback, renderer) {
    var images = renderer.contents.querySelectorAll('img'),
        items = Array.prototype.slice.call(images),
        iheight = renderer.height,//chapter.bodyEl.clientHeight,//chapter.doc.body.getBoundingClientRect().height,
        oheight;

    if (renderer.layoutSettings.layout != "reflowable") {
        callback();
        return; //-- Only adjust images for reflowable text
    }

    items.forEach(function (item) {
        var columnWidth = parseInt(item.ownerDocument.documentElement.style[EPUBJS.core.prefixed('columnWidth')]);

        var size = function () {
            var itemRect = item.getBoundingClientRect(),
                rectHeight = itemRect.height,
                top = itemRect.top,
                oHeight = item.getAttribute('data-height'),
                height = oHeight || rectHeight,
                newHeight,
                fontSize = Number(getComputedStyle(item, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]),
                fontAdjust = fontSize ? fontSize / 2 : 0;

            iheight = renderer.contents.clientHeight;
            if (top < 0) top = 0;

            item.style.maxWidth = "100%";

            if (height + top >= iheight) {

                if (top < iheight / 2) {
                    // Remove top and half font-size from height to keep container from overflowing
                    newHeight = iheight - top - fontAdjust;
                    item.style.maxHeight = newHeight + "px";
                    item.style.width = "auto";
                } else {
                    if (height > iheight) {
                        item.style.maxHeight = iheight + "px";
                        item.style.width = "auto";
                        itemRect = item.getBoundingClientRect();
                        height = itemRect.height;
                    }
                    item.style.display = "block";
                    item.style["WebkitColumnBreakBefore"] = "always";
                    item.style["breakBefore"] = "column";

                }

                item.setAttribute('data-height', newHeight);

            } else {
                item.style.removeProperty('max-height');
                item.style.removeProperty('margin-top');
            }

            if (item.clientWidth > item.clientHeight) {
                //land image
                if (item.clientWidth > columnWidth) {
                    item.style.width = "100%";
                    item.style.height = "auto";
                    // recheck clientHeight
                    if (item.clientHeight > top + iheight) {
                        item.style.width = "auto";
                        item.style.height = "100%";
                        item.align = "middle";
                    }
                } else if (item.clientHeight > top + iheight) {
                    item.style.width = "auto";
                    item.style.height = "100%";
                } else {
                    item.style.width = "auto";
                    item.style.height = "auto";
                }
            } else {
                // port image
                if (item.clientHeight > top + iheight) {
                    item.style.width = "auto";
                    item.style.height = "100%";
                    //recheck clientWidth
                    if (item.clientWidth > columnWidth) {
                        item.style.width = "100%";
                        item.style.height = "auto";
                    }
                } else if (item.clientWidth > columnWidth) {
                    item.style.width = "100%";
                    item.style.height = "auto";
                } else {
                    item.style.width = "auto";
                    item.style.height = "auto";
                }
            }
            item.style.display = "block";
            item.style.marginLeft = "auto";
            item.style.marginRight = "auto";
        }

        var unloaded = function () {
            // item.removeEventListener('load', size); // crashes in IE
            renderer.off("renderer:resized", size);
            renderer.off("renderer:chapterUnload", this);
        };

        item.addEventListener('load', size, false);

        renderer.on("renderer:resized", size);

        renderer.on("renderer:chapterUnload", unloaded);

        size();

    });

    if (callback) callback();

}
//# sourceMappingURL=hooks.js.map