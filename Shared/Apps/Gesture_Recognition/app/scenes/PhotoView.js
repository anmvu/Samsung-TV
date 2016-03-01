/**
 * Scene where enlarged photo is shown. Actual rendering is done by Grid object.
 * Handles gesture events and sets up the photo view accordingly.
 * @constructor
 */
function ScenePhotoView() {
    var SCREEN_W = 960;
    var rotationAngle = 0;
    var zoomDistance = 0;

    this.initialize = function() {
        Grid.callbacks.onPhotoChanged = function() {
            rotationAngle = 0;
            zoomDistance = 0;
        }
    };

    this.handleShow = function () {
        var helpBarInfo = {
            helpbarType: "HELPBAR_TYPE_GESTURE_CUSTOMIZE",
            itemList: [
                { itemType: "HELPBAR_GESTURE_ITEM_POSE_LIKE", itemText: "Like it" },
                { itemType: "HELPBAR_GESTURE_ITEM_ZOOM_OUT_IN", itemText: "Zoom in / out" },
                { itemType: "HELPBAR_GESTURE_ITEM_ROTATION", itemText: "Rotate photo" },
                { itemType: "HELPBAR_GESTURE_ITEM_RETURN", itemText: "Go back" }
            ]
        };

        webapis.recognition.SetGestureHelpbarInfo(JSON.stringify(helpBarInfo));

        $("#keyhelp").sfKeyHelp({
            "LEFTRIGHT" : "Navigate",
            "RETURN" : "Return"
        });
    };

    this.handleHide = function () {
        Grid.close();
    };

    this.handleFocus = function () {
        GestureDispatcher.currentScene = this;
    };

    this.handleBlur = function () {
    };

    this.handleKeyDown = function(keyCode) {
        log("ScenePhotoView.handleKeyDown(" + keyCode + ")");

        switch (keyCode) {
        case sf.key.LEFT:
            Grid.left();
            break;

        case sf.key.RIGHT:
            Grid.right();
            break;

        case sf.key.RETURN:
            sf.scene.hide("PhotoView");
            sf.scene.show("Gallery");
            sf.scene.focus("Gallery");
            sf.key.preventDefault();
            break;
        }
    };

    this.handleGesture = function(e) {
        log("ScenePhotoView.handleGesture, type: " + e.eventtype);

        switch (e.eventtype) {
        case "EVENT_GESTURE_2HAND_ZOOM":
            // calculate zoomRatio ratio based on the accumulated distance

            zoomDistance += parseInt(e.result, 10);
            // clamp zoom distance value to some arbitrary range
            zoomDistance = Math.max(-SCREEN_W * 0.75, Math.min(SCREEN_W * 1.25, zoomDistance));
            // current zoom ratio
            var zoomRatio = (SCREEN_W + zoomDistance) / SCREEN_W;

            Grid.zoom(zoomRatio);
            break;

        case "EVENT_GESTURE_2HAND_ROTATE":
            // use accumulated rotation angle
            rotationAngle += parseInt(e.result, 10);
            Grid.rotation(rotationAngle);
            break;

        case "EVENT_GESTURE_LIKE":
            Grid.likePhoto();
            break;
        }
    };
}
