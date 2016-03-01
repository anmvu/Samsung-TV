// Copyright: Samsung Electronics 2011-2012
// Author: Yevgen Poltavets<yevgen.poltavets@samsung.com>
// Project : AST - AllShare Test  widget application
// Description: This part included helpers for debug output
// 

alert("allshare_api_test_debug.js begin");


//=============================================================================

allshare_helper.log.flags = 
{
    print : true,
    nonimplemented : true,
    trace : true,
    info : true,
    debug : true,
    error : true
}


//=============================================================================
// DEBUG function definition

astDebug = {};

function astErrorInfo(counter, text)
{
    this.counter = counter;
    this.text = text;

    this.getCounter = function() { return this.counter; }
    this.getText = function() { return this.text; }
}


astDebug.errorsArray = [];
astDebug.errorCounter = 0;


function astSetErrorText(divElement, text_value)
{
    if (document)
    {
        var element = document.getElementById(divElement);
        if (element)
        {
            alert("astSetText:  [" + divElement + "]=" + text_value);
            try
            {
                if (widgetAPI) // TV or emulator
                {
                    widgetAPI.putInnerHTML(element, text_value);
                }
                else
                {
                    element.innerHTML = text_value;
                }
            }
            catch(e)
            {
                alert("astSetText cause exception: code:" + e);
            }
        }
        else
        {
            alert("astSetText:   element == null   [" + divElement + "]=" + text_value);
        }
     }
     else
     {
        alert("astSetText:   document == null   [" + divElement + "]=" + text_value);
     }
}


// printError function handle history of 4 last errors, and display it into DIV_ID_LOG
astDebug.printError = function(msg)
{
    var self = this;
    
    alert("astDebug.printError: " + msg);
// return; // !!!  possible recursion printError() -> astSetText() -> printError() -> 
    self.errorsArray.push(new astErrorInfo(self.errorCounter, msg));
    self.errorCounter ++;
    if (self.errorsArray.length > 4)
    {
        self.errorsArray.shift();
    }

    var htmlStr ="<table border=1>\n";
    htmlStr += "<tr><td>Errors history</td><td>\n";
    for (i = 0; i < self.errorsArray.length; i++)
    {
        if (i != 0)
        {
            htmlStr += "<br>";
        }
        var errorInfo = self.errorsArray[i];
        htmlStr += "<span class=\"errorCounter\">" + errorInfo.getCounter() + " : </span>";
        htmlStr += errorInfo.getText() + "\n";
    }
    htmlStr += "</td></tr>";
    htmlStr += "</table>";

    astSetErrorText(DIV_ID_LOG, htmlStr);
}


astDebug.printDebug = function(msg)
{
    alert("astDebug.printDebug: " + msg);
}


astDebug.printInfo = function(msg)
{
    alert("astDebug.printInfo: " + msg);
}


astDebug.printObject = function(obj)
{
    if (obj)
    {
        var output = '';
        for (property in obj)
        {
            output += property + ': ' + obj[property]+'; ';
        }
        alert("printObject: " + output);
    }
    else
    {
        alert("printObject: null");
    }
}


astDebug.printItem = function(item)
{
    var self = this;

    self.printInfo("astPrintItem() begin");

    if (item)
    {
        self.printDebug("  albumTitle: " + item.albumTitle);
        self.printDebug("  artist: " + item.artist);
        self.printDebug("  date: " + item.date);
        self.printDebug("  duration: " + item.duration);
        self.printDebug("  extension: " + item.extension);
        self.printDebug("  fileSize: " + item.fileSize);
        self.printDebug("  genre: " + item.genre);
        self.printDebug("  location: " + item.location);
        self.printDebug("  mimeType: " + item.mimeType);
        self.printDebug("  width: " + item.width);
        self.printDebug("  height: " + item.height);
        self.printDebug("  subtitleUri: " + item.subtitleUri);
        self.printDebug("  thumbnailUri: " + item.thumbnailUri);
        self.printDebug("  title: " + item.title);
        self.printDebug("  itemType: " + item.itemType);
        self.printDebug("  itemUri: " + item.itemUri);
        self.printDebug("  isRootFolder: " + item.isRootFolder);
        self.printDebug("  contentBuildType: " + item.contentBuildType);
    }
    else
    {
        self.printDebug("  item == null");
    }

    self.printInfo("astDebug.printItem() end");
}


//=============================================================================
// END


alert("allshare_api_test_debug.js end");


