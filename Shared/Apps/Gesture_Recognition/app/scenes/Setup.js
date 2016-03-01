/**
 * Dispatches received gesture event to currently focused scene.
 */
var GestureDispatcher = {
    currentScene: null, /**< Current scene object, set it when a scene is focused */

    /**
     * Passes received gesture event to currently focused scene.
     * The scene object needs to have handleGesture() method.
     * @param e Gesture event object
     */
    handleGesture: function(e) {
        log("Dispatching event, type: '" + e.eventtype + "', result: '" + e.result + "'");

        if (GestureDispatcher.currentScene !== null) {
            GestureDispatcher.currentScene.handleGesture(e);
        }
    }
};

/**
 * Setup scene checks for gesture recognition support and subscribes for
 * gesture recognition event. Displays error messages if recognition support is
 * not detected.
 * @constructor
 */
function SceneSetup() {
    this.initialize = function() {
    };

    this.handleShow = function () {
        log("SceneInit.handleShow()");

        // sets key help bar

        $("#keyhelp").sfKeyHelp({
            "RETURN" : "Return"
        });

        // checks for WebAPIs

        if (typeof webapis !== "object" || typeof webapis.recognition !== "object") {
            document.getElementById("error").innerHTML = "ERROR: webapis not present";
            return;
        }

        // checks if device supports voice and gesture recognition

        if (webapis.recognition.IsRecognitionSupported() !== true) {
            document.getElementById("error").innerHTML = "ERROR: Gesture recognition not supported";
            return;
        }

        // checks if gesture recognition is enabled

        if (webapis.recognition.IsGestureRecognitionEnabled() !== true) {
            document.getElementById("error").innerHTML = "ERROR: Gesture recognition is not enabled";
            return;
        }

        // subscribes for gesture events

        var subscribeResult = webapis.recognition.SubscribeExEvent(
            webapis.recognition.PL_RECOGNITION_TYPE_GESTURE, "testApp",
            GestureDispatcher.handleGesture);

        if (subscribeResult !== true) {
            document.getElementById("error").innerHTML = "ERROR: Failed subscribing for gesture events";
            return;
        }

        // all is fine, show the gallery

        sf.scene.hide("Setup");
        sf.scene.show("Gallery");
        sf.scene.focus("Gallery");
    };

    this.handleHide = function () {
    };

    this.handleFocus = function () {
    };

    this.handleBlur = function () {
    };

    this.handleKeyDown = function (keyCode) {
        log("SceneInit.handleKeyDown(" + keyCode + ")");

        switch (this.state) {
        case sf.key.RETURN:
        case sf.key.EXIT:
            sf.core.exit();
            break;

        default:
            break;
        }
    };
}
