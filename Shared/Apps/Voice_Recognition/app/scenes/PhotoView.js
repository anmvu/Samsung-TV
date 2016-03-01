/**
 * Scene where enlarged photo is shown. Actual rendering is done by Grid object.
 * Handles voice events and sets up the photo view accordingly.
 * @constructor
 */
function ScenePhotoView() {
    var isDescriptionOn = false,
    helpBarInfo = {
        helpbarType: "HELPBAR_TYPE_VOICE_CUSTOMIZE",
        helpbarItemsList: [
            { itemText: "Describe", commandList: [{command: "Describe"}]},
            { itemText: "Left", commandList: [{command: "Left"}]},
            { itemText: "Right", commandList: [{command: "Right"}]},
            { itemText: "Close", commandList: [{command: "Close"}]}
        ]
    },
    helpBarInfoDescribe = {
        helpbarType: "HELPBAR_TYPE_VOICE_SERVER_GUIDE_RETURN",
        guideText: "Say the word or phrase you wish to add as the image description"
    }

    this.initialize = function() {};

    this.handleShow = function () {

        webapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(helpBarInfo));

        $("#keyhelp").sfKeyHelp({
            "LEFTRIGHT" : "Navigate",
            "RETURN" : "Return"
        });
    };

    this.handleHide = function () {
        Grid.close();
    };

    this.handleFocus = function () {
        VoiceDispatcher.currentScene = this;
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

    this.handleVoice = function(e) {
        log("+++++++++++++++++++++++++ >  ScenePhotoView.handleVoice, type: " + e.eventtype);

        switch (e.result.toLowerCase()) {
            case "left": Grid.left(); break;
            case "right": Grid.right(); break;
            case "exit": sf.core.exit(); break;
            case "close":
                sf.scene.hide("PhotoView");
                sf.scene.show("Gallery");
                sf.scene.focus("Gallery");
                sf.key.preventDefault();
                break;
            case "describe":
                webapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(helpBarInfoDescribe));
                isDescriptionOn = true;
                break;
            case "return":
                if (isDescriptionOn) {
                    webapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(helpBarInfo));
                    isDescriptionOn = false;
                }
                break;
            default:
                if (isDescriptionOn) {
                    Grid.setDescription(e.result);
                    webapis.recognition.SetVoiceHelpbarInfo(JSON.stringify(helpBarInfo));
                    isDescriptionOn = false;
                }
                break;
        }
    };
}
