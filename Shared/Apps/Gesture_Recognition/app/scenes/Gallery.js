/**
 * Scene where the gallery is shown. Actual gallery rendering is done by Grid object.
 * @constructor
 */
function SceneGallery() {
    this.initialize = function () {
        log("SceneGallery.initialize()");

        // set gallery images

        var images = [];

        for (var i = 1; i < 10; i += 1) {
            images.push("image_0" + i + ".jpg");
        }

        Grid.init("gallery", images);

        // callback will be called when selected image is opened (by remote
        // controller or by clicking/grabbing)
        Grid.callbacks.onPhotoOpened = function() {
            sf.scene.show("PhotoView");
            sf.scene.focus("PhotoView");
        };
    };

    this.handleShow = function () {
        log("SceneGallery.handleShow()");

        var helpBarInfo = {
            helpbarType: "HELPBAR_TYPE_GESTURE_CUSTOMIZE",
            itemList: [
                { itemType: "HELPBAR_GESTURE_ITEM_RETURN", itemText: "Go back" },
                { itemType: "HELPBAR_GESTURE_ITEM_POINTING_GESTURE", itemText: "Choose picture" }
            ]
        };

        webapis.recognition.SetGestureHelpbarInfo(JSON.stringify(helpBarInfo));

        $("#keyhelp").sfKeyHelp({
            "MOVE" : "Navigate",
            "ENTER" : "Open",
            "RETURN" : "Return"
        });
    };

    this.handleHide = function () {
        log("SceneGallery.handleHide()");
    };

    this.handleFocus = function () {
        log("SceneGallery.handleFocus()");
        GestureDispatcher.currentScene = this;
    };

    this.handleBlur = function () {
        log("SceneGallery.handleBlur()");
    };

    this.handleKeyDown = function (keyCode) {
        log("SceneGallery.handleKeyDown(" + keyCode + ")");

        switch (keyCode) {
        case sf.key.UP:
            Grid.up();
            break;

        case sf.key.DOWN:
            Grid.down();
            break;

        case sf.key.LEFT:
            Grid.left();
            break;

        case sf.key.RIGHT:
            Grid.right();
            break;

        case sf.key.RETURN:
            sf.core.exit();
            break;

        case sf.key.ENTER:
            Grid.open();
            break;
        }
    };

    this.handleGesture = function(e) {
        log("SceneGallery.handleGesture, type: " + e.eventtype);

        // as for now no gesture events are handled here
        // please look at ScenePhotoView.handleGesture() method
    };
}
