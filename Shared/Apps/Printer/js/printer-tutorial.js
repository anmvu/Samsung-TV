var widgetAPI;
var tvKey;
var printer = window.webapis.printer || {};
var canPrint = -1;


function OnLoad() {
    widgetAPI = new Common.API.Widget();
    tvKey = new Common.API.TVKeyValue();
    widgetAPI.sendReadyEvent();

    if (printer.isPrintingServiceSupported()) {
        document.getElementById('info').innerHTML = 'There IS a printer module available.<br><br>'
            + 'Press <span style="color: red; font-weight: bold;">RED</span> key to print an image from a file<br>'
            + 'or <span style="color: blue; font-weight: bold;">BLUE</span> key to print the whole TV screen.';
        canPrint = 1;
    } else {
        document.getElementById('info').innerHTML = 'There is NO printer module available.';
        canPrint = 0;
    }
}

function OnUnload() {
}

function OnKeyDown() {
    var keyCode = event.keyCode;

    switch(keyCode) {
        case tvKey.KEY_RED:
            alert('pressed KEY_RED');

            if (canPrint==1) {
                document.getElementById('message').innerHTML = 'Printing image from a file...';
                printer.runFilePrinting('file://images/testpage.png');
            }
            break;

        case tvKey.KEY_BLUE:
            alert('pressed KEY_BLUE');

            if (canPrint==1) {
                document.getElementById('message').innerHTML = 'Printing the whole TV screen...';
                var screenAreaToPrint = SRect(0, 0, curWidget.width, curWidget.height);
                printer.runScreenPrinting(printer.SCREEN_LAYER_ALL, screenAreaToPrint);
            }
            break;
    }
}
