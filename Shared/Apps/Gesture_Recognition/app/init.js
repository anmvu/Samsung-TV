/**
 * Debug log function.
 * @param {String} txt Message to log
 */
var log = function(txt) {
    alert("[TUTORIAL] " + txt);
};

function onStart() {
    sf.scene.show('Setup');
    sf.scene.focus('Setup');
}

function onDestroy() {
    webapis.recognition.UnsubscribeExEvent(webapis.recognition.PL_RECOGNITION_TYPE_GESTURE, "testApp");
}
