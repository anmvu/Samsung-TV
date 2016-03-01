/**
 * Renders and allows navigating a grid of photos. Selected photo can
 * be opened and show in detail.
 */
var Grid = (function () {
    "use strict";
    var PHOTO_W = 600,
        PHOTO_H = 400,
        SCREEN_W = 960,
        SCREEN_H = 540;

    var items = [],
        descriptions = [],
        index = 0,
        rowSize = 3,
        opened = false,
        elem = null,
        overlay = null,
        big = null, // opened image view
        desc = null,
        arrowLeft = null,
        arrowRight = null,
        callbacks = {
            onPhotoOpened: null // called when selected photo in the gallery is opened
        }

    function log(txt) {
        alert("[GRID] " + txt);
    }

    function focus(idx) {
        var i, len;

        idx = typeof idx !== "undefined" ? idx : index;

        if (idx >= 0 && idx < items.length) {
            for (i = 0, len = items.length; i < len; i += 1) {
                items[i].className = "";
            }

            items[idx].className = "focused";
            index = parseInt(idx, 10);
        }
    }

    function move(offset) {
        log("MOVE: index = " + index + ", offset = " + offset);

        if (isNaN(offset)) {
            log("Move: offseet is not a number");
            return;
        }
        var max = items.length ? (items.length - 1) : 0,
            newIndex = index + offset;

        focus(newIndex < 0 ? 0 : newIndex > max ? max : newIndex);
    }

    function updateClick() {
        log("Update click");
        updateBig();
        updateDesc();
    }

    function init(id, arr) {
        var frag = document.createDocumentFragment(), i, len,
            item, parent, like, that;

        elem = document.getElementById(id);
        parent = elem.parentElement || document.body;

        that = this;
        if (elem && arr && arr.length) {
            for (i = 0, len = arr.length; i < len; i += 1) {
                item = document.createElement("img");
                item.name = i;
                item.src = "images/" + arr[i];
                item.addEventListener('click', function(event) {
                    var it = event.target;

                    if (elem === it) {
                        return;
                    }

                    var id = parseInt(it.name, 10);

                    if (isNaN(id)) {
                        return;
                    }

                    that.focus(id);
                    that.open();
                    that.updateClick();
                });

                frag.appendChild(item);

                items[i] = item;
            }
            elem.appendChild(frag);

            focus();
        }

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "overlay";

            big = document.createElement("img");
            big.id = "big";
            overlay.appendChild(big);

            desc = document.createElement("div");
            desc.id = "description";
            desc.innerHTML = "sample description";
            overlay.appendChild(desc);

            arrowLeft = document.createElement("div");
            arrowLeft.className = "arrow-left";
            overlay.appendChild(arrowLeft);

            arrowRight = document.createElement("div");
            arrowRight.className = "arrow-right";
            overlay.appendChild(arrowRight);

            like = document.createElement("div");
            like.id = "like";
            overlay.appendChild(like);

            parent.appendChild(overlay);

            arrowRight.addEventListener('click', function() {
                Grid.right();
            });

            arrowLeft.addEventListener('click', function() {
                Grid.left();
            });
        }
    }

    function up() {
        move(-rowSize);
    }

    function down() {
        move(rowSize);
    }

    function left() {
        move(-1);
        if (opened) {
            updateBig();
            updateDesc();
        }
    }

    function right() {
        move(1);
        if (opened) {
            updateBig();
            updateDesc();
        }
    }

    function getItem() {
        return items[index < 0 ? 0 : (index < items.length ? index : items.length - 1)].src.split("/").pop() || null;
    }

    function updateArrows() {
        arrowLeft.style.display = index > 0 ? "block" : "none";
        arrowRight.style.display = index < items.length - 1 ? "block" : "none";
    }

    function updateBig() {

        log("index: " + index);
        big.src = "images/big/" + getItem();
        log("viewing: " + big.src);
        updateArrows();
        updatePosition(PHOTO_W, PHOTO_H);
    }

    function updateDesc() {
        var text = descriptions[index];
        if (text) {
            desc.style.display = "block";
            desc.innerHTML = text;
        } else {
            desc.style.display = "none";
            desc.innerHTML = "";
        }
    }

    function updatePosition(width, height) {
        log("updatePosition, width: " + width + ", height: " + height);

        var top = (SCREEN_H - height) / 2;
        var left = (SCREEN_W - width) / 2;

        big.style.top = top + "px";
        big.style.left = left + "px";
    }

    function setDescription(text) {
        descriptions[index] = text;
        updateDesc();
    }

    function open() {
        if (typeof callbacks.onPhotoOpened === "function") {
            callbacks.onPhotoOpened();
        }
        updateBig();
        updateDesc();
        overlay.style.display = "block";
        opened = true;
    }

    function close() {
        overlay.style.display = "none";
        big.src = "";
        opened = false;

    }

    // public interface
    return {
        init : init,
        callbacks: callbacks,
        setDescription : setDescription,
        focus : focus,
        left : left,
        right : right,
        up : up,
        down : down,
        move : move,
        getItem : getItem,
        open : open,
        close : close,
        updateClick : updateClick
    };
}());
