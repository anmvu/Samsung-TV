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
            helpbarType: "HELPBAR_TYPE_VOICE_CUSTOMIZE",
            helpbarItemsList: [
                { itemText: "Up", commandList: [{command: "Up"}] },
                { itemText: "Down", commandList: [{command: "Down"}] },
                { itemText: "Left", commandList: [{command: "Left"}]},
                { itemText: "Right", commandList: [{command: "Right"}]},
                { itemText: "Open", commandList: [{command: "Open"}]}
            ]
        };

        webapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(helpBarInfo));

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
        VoiceDispatcher.currentScene = this;
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

    this.handleVoice = function(e) {
        log("SceneGallery.handleVoicee, type: " + e.eventtype);

        switch (e.result.toLowerCase()) {
            case "up": Grid.up(); break;
            case "down": Grid.down(); break;
            case "left": Grid.left(); break;
            case "right": Grid.right(); break;
            case "open": Grid.open(); break;
            case "exit": sf.core.exit(); break;
        }
    };
}
