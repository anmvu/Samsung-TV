// Copyright: Samsung Electronics 2011-2012
// Author: Yevgen Poltavets<yevgen.poltavets@samsung.com>
// Project : AST - AllShare Test  widget application
// Description: This part implements test application
// 

alert("allshare_api_test.js begin");

var VERSION_SAMPLE_APP = "1.3.0.10";
astDebug.printDebug("Version of sample app: " + VERSION_SAMPLE_APP);
var VERSION_ALLSHARE_WEBAPI = "1.3.0.10";
astDebug.printDebug("Expected versioin of AllShare WebAPI js : " + VERSION_ALLSHARE_WEBAPI);


//=============================================================================
// Modifying document


function astSetText(divElement, text_value)
{
    if (document)
    {
        var element = document.getElementById(divElement);
        if (element)
        {
            astDebug.printDebug("astSetText:  [" + divElement + "]=" + text_value);
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
                astDebug.printError("astSetText cause exception: code:" + e);
            }
        }
        else
        {
            astDebug.printError("astSetText:   element == null   [" + divElement + "]=" + text_value);
        }
     }
     else
     {
        astDebug.printError("astSetText:   document == null   [" + divElement + "]=" + text_value);
     }
}


//=============================================================================
// Check for environment

if (window)
{
    if (window.webapis)
    {
        if (window.webapis.allshare)
        {
            if (window.webapis.allshare.serviceconnector)
            {
                astDebug.printDebug("window.webapis.allshare.serviceconnector exists");
            }
            else
            {
                astDebug.printError("window.webapis.allshare.serviceconnector == null");
            }
        }
        else
        {
            astDebug.printError("window.webapis.allshare == null");
        }
    }
    else
    {
        astDebug.printError("window.webapis == null");
    }
}
else
{
    astDebug.printError("window == null");
}


var widgetAPI = null;
try
{
    widgetAPI = new Common.API.Widget();
    astDebug.printDebug("new Common.API.Widget()");
}
catch(e)
{
    astDebug.printError("new Common.API.Widget() failed");
}


var tvKey = null;
try
{
    tvKey = new Common.API.TVKeyValue();
    astDebug.printDebug("new Common.API.TVKeyValue()");
}
catch(e)
{
    astDebug.printError("new Common.API.TVKeyValue() failed");
}



//=============================================================================
// Globals

// definition for HTML's sections
var DIV_ID_DEVICES_LIST = "div_id_devices_list";
var DIV_ID_BROWSE_PATH = "div_id_browse_path";  // 
var DIV_ID_BROWSE = "div_id_browse";
var DIV_ID_KEYWORD = "div_id_keyword";
var DIV_ID_ITEM = "div_id_item";
var DIV_ID_ITEM_INFO = "div_id_item_info";
var DIV_ID_LOG = "div_id_log";
var DIV_ID_WAITING_RESPONSE = "div_id_waiting_response";
var DIV_ID_VERSION_INFO = "div_id_version_info";
var DIV_ID_HELPER = "div_id_helper";
var PLAYER_ID = "player_id";


var DEVICE_VIEW_SIZE = 5;
var ITEMS_VIEW_SIZE = 7;

var CONTENTS_VIEWER_HEIGHT = 340;
var CONTENTS_VIEWER_WIDTH = 600;
var DEVICE_ICON_HEIGHT = 48;
var DEVICE_ICON_WIDTH = 48;
var THUMBNAIL_HEIGHT = 160;
var THUMBNAIL_WIDTH = 160;


//var CLIENT_PAGE_WIDTH = document.body.clientWidth;
var CLIENT_PAGE_WIDTH = document.documentElement.clientWidth;
alert("CLIENT_PAGE_WIDTH:" + CLIENT_PAGE_WIDTH);
var SCREEN_WIDE_TABLE_WIDTH = CLIENT_PAGE_WIDTH - 40;


// 
var astMain = {};
var astModeBrowse = {};
var astModeSearch = {};


// definitions for widget modes
var AST_MODE_DEVICE_SELECTION = "device_selection";
var AST_MODE_BROWSE = "browse";
var AST_MODE_SEARCH = "search";


var UI_LENGTH_NAME_PATH = 30;
var UI_LENGTH_FIELD = 50;
var UI_LENGTH_TITLE = 100;
var UI_LENGTH_URL = 100;

function cutNames(str, length)
{
    if (str)
    {
        if (length == null)
            length = UI_LENGTH_FIELD;


        if (str.length > length)
        {
            return str.substring(0, length) + "...";
        }
    }
    return str;
}


//=============================================================================
// astDataSource


function astDataSource(dataArray)
{
    this.dataArray = dataArray;

    this.getSize = function()
    {
//        astDebug.printInfo("astDataSource.getSize()");
        return this.dataArray.length;
    }

    this.getItem = function(itemIdx)
    {
//        astDebug.printInfo("astDataSource.getItem(itemIdx:" + itemIdx + ")");
        if (itemIdx < this.dataArray.length)
        {
            return this.dataArray[itemIdx];
        }

        return null;
    }
}


//=============================================================================
// astViewGenerator


function astViewGenerator()
{
    this.getPrefix = function(dataSource) { return ""; }
    this.getBody = function(dataSource, itemIdx, selectedItemIdx) { return ""; }
    this.getSuffix = function(dataSource) { return ""; }
}


//=============================================================================
// astViewList


function astViewList(numOfVisibleItems, resultDiv, viewGenerator)
{
    this.numOfVisibleItems = numOfVisibleItems;
    this.resultDiv = resultDiv;
    this.viewGenerator = viewGenerator;

    var emptyArray = [];
    this.dataSource = new astDataSource(emptyArray);
    this.selectedItemIdx = 0;


    // set array with data
    this.setDataArray = function(dataArray, selectedItemIdx)
    {
        astDebug.printInfo("astViewList.setData()");
        
        this.dataSource = new astDataSource(dataArray);
        this.selectedItemIdx = selectedItemIdx;
        if (this.selectedItemIdx < 0 || this.selectedItemIdx >= this.dataSource.getSize())
        {
            this.selectedItemIdx = 0;
        }
        this.updateViewList();
    }

    this.getNumberOfVisibleItems = function() { return this.numOfVisibleItems; }

    this.getSelectedItemIdx = function()
    {
        return this.selectedItemIdx;
    }


    this.getSelectedItem = function()
    {
        return this.dataSource.getItem(this.selectedItemIdx);
    }


    this.getViewGenerator = function()
    {
        return this.viewGenerator;
    }


    this.previous = function()
    {
        astDebug.printInfo("astViewList.previous()");
        if (this.dataSource)
        {
            if (this.dataSource.getSize() > 0)
            {
                this.selectedItemIdx --;
                if (this.selectedItemIdx < 0)
                {
                    this.selectedItemIdx = this.dataSource.getSize() - 1;
                }
            }
        }
        this.updateViewList();
    }


    this.next = function()
    {
        astDebug.printInfo("astViewList.next()");

        if (this.dataSource)
        {
            if (this.dataSource.getSize() > 0)
            {
                this.selectedItemIdx ++;
                if (this.selectedItemIdx >= this.dataSource.getSize())
                {
                    this.selectedItemIdx = 0;
                }
            }
        }
        this.updateViewList();
    }


    this.makeViewHtml = function()
    {
        astDebug.printInfo("astViewList.makeViewHtml() begin");

        var halfOfVisibleItems = Math.floor(this.numOfVisibleItems / 2);

//        astDebug.printInfo("astViewList.makeViewHtml() halfOfVisibleItems: " + halfOfVisibleItems);
//        astDebug.printInfo("astViewList.makeViewHtml()  numOfVisibleItems: " + this.numOfVisibleItems);
//        astDebug.printInfo("astViewList.makeViewHtml()  dataSource.getSize(): " + this.dataSource.getSize());

        var startIdx = 0;
        if (this.numOfVisibleItems < this.dataSource.getSize())
        {

            if (this.selectedItemIdx - halfOfVisibleItems > 0)
                startIdx = this.selectedItemIdx - halfOfVisibleItems;

            if (startIdx + this.numOfVisibleItems >= this.dataSource.getSize())
            {
                startIdx = this.dataSource.getSize() - this.numOfVisibleItems;
            }
        }

        var htmlString = this.viewGenerator.getPrefix(this.dataSource);

        for (idx = 0; idx < this.numOfVisibleItems; idx++)
        {
            if (idx + startIdx == this.dataSource.getSize())
            {
                break;
            }

            htmlString += this.viewGenerator.getBody(this.dataSource, idx + startIdx, this.selectedItemIdx);
        }

        htmlString += this.viewGenerator.getSuffix(this.dataSource);

        astDebug.printInfo("astViewList.makeViewHtml() end");

        return htmlString;
    }


    this.updateViewList = function()
    {
        astDebug.printInfo("astViewList.updateViewList()");

        var htmlStr = this.makeViewHtml();
        astSetText(this.resultDiv, htmlStr);
    }
    
} // function astViewList


//=============================================================================
// astContentsViewGenerator


function astContentsViewGenerator()
{
    this.getPrefix = function(dataSource) 
    {
        astDebug.printInfo("astContentsViewGenerator.getPrefix()");

        var htmlStr = "";
        htmlStr += "Total number of media items: " + dataSource.getSize() + "<br>\n"
        htmlStr += "<table border=1>\n";

        htmlStr += "<tr>";
        htmlStr += "<th>#</th>";
        htmlStr += "<th>Type</th>";
        htmlStr += "<th>Name</th>";
        htmlStr += "</tr>\n";

        return htmlStr;
    }


    this.getBody = function(dataSource, itemIdx, selectedItemIdx) 
    {
        var self = this;

        astDebug.printDebug("astContentsViewGenerator.getBody(itemIdx:" + itemIdx + ", selectedItemIdx:" + selectedItemIdx + ")");
        var htmlStr = "";
        var item = dataSource.getItem(itemIdx);

        htmlStr += "<tr>";

        htmlStr += "<td style=\"text-align:center;\">";
        // mark for selected item
        if (itemIdx == selectedItemIdx)
        {
            htmlStr += "&gt;";
        }
        htmlStr += itemIdx;
        if (itemIdx == selectedItemIdx)
        {
            htmlStr += "&lt;";
        }
        htmlStr += "</td>";

        htmlStr += "<td>";
        switch(item.itemType)
        {
            case "FOLDER": // FOLDER
            htmlStr += "F";
            break;

            case "AUDIO": // AUDIO
            htmlStr += "A";
            break;

            case "IMAGE": // IMAGE
            htmlStr += "I";
            break;

            case "VIDEO": // VIDEO
            htmlStr += "V";
            break;

            case "UNKNOWN": ;// UNKNOWN

            default:
            htmlStr += "U";
            break;
        }
        htmlStr += "</td>";

        htmlStr += "<td class=\"wrapText\">";
//        astDebug.printDebug("itemTitle:" + item.title);


        if (item.itemType == "FOLDER")
        {
            htmlStr += "[" + cutNames(item.title) + "]";
        }
        else
        {
            htmlStr += cutNames(item.title);
        }

        htmlStr += "</td>";
        htmlStr += "</tr>\n";
        
        return htmlStr;
    }


    this.getSuffix = function(dataSource)
    {
        astDebug.printInfo("astContentsViewGenerator.getSuffix()");

        var htmlStr = "";
        htmlStr += "</table>\n";
        return htmlStr;
    }

};


//=============================================================================
// astDevicesViewGenerator


function astDevicesViewGenerator()
{
    this.MODE_SHOW_ALL = 1;
    this.MODE_SHOW_SELECTED_ONLY = 2;

    this.mode = this.MODE_SHOW_ALL;

    this.setModeAll = function() { this.mode = this.MODE_SHOW_ALL; }
    this.setModeSelectedOnly = function() { this.mode = this.MODE_SHOW_SELECTED_ONLY; }


    this.getPrefix = function(dataSource) 
    {
        astDebug.printInfo("astDevicesViewGenerator.getPrefix()");

        var htmlStr = "";
        htmlStr += "Total number of available media providers: " + dataSource.getSize() + "<br>\n"
        htmlStr += "<table border=1>\n";
        htmlStr += "<tr><th>#</th><th>Icon</th><th>Name</th><th>Details</th></tr>\n";

        return htmlStr;
    }


    this.getBody = function(dataSource, itemIdx, selectedItemIdx) 
    {
        var self = this;

        astDebug.printDebug("astDevicesViewGenerator.getBody(itemIdx:" + itemIdx + ", selectedItemIdx:" + selectedItemIdx + ")");

        var htmlStr = "";

        if (self.mode == this.MODE_SHOW_SELECTED_ONLY && itemIdx != selectedItemIdx)
        {
        }
        else
        {
            var mediaProvider = dataSource.getItem(itemIdx);

            htmlStr += "<tr>";
            htmlStr += "<td style=\"text-align:center;\">";
            // mark for selected item
            if (itemIdx == selectedItemIdx)
            {
                htmlStr +=  "&gt;";
            }
            htmlStr += itemIdx;
            if (itemIdx == selectedItemIdx)
            {
                htmlStr +=  "&lt;";
            }
            htmlStr += "</td>";

            // icon
            htmlStr += "<td>";
//            astDebug.printDebug("Provider :" + mediaProvider.name);
            if (mediaProvider.iconArray.length > 0)
            {
                var icon = mediaProvider.iconArray[0];
                if (icon.iconUri.length > 0)
                {
                    htmlStr += "<img src=\"" + icon.iconUri + "\"";
                    htmlStr += " height=" + DEVICE_ICON_HEIGHT;
                    htmlStr += " width=" + DEVICE_ICON_WIDTH;
                    htmlStr += ">";
                }
            }
            htmlStr += "</td>";

            // name
            htmlStr += "<td>";
            htmlStr += mediaProvider.name;
            htmlStr += "</td>";

            // details
            htmlStr += "<td>";

            // id
            htmlStr += "id:" + mediaProvider.id;
            htmlStr += "<br>";
            
            // type
            htmlStr += "deviceType:" + mediaProvider.deviceType;
            htmlStr += "<br>";

            // modelName
            htmlStr += "modelName:" + mediaProvider.modelName;
            htmlStr += "<br>";

            // Domain
            htmlStr += "deviceDomain:" + mediaProvider.deviceDomain;
            htmlStr += "<br>";

            // ipAddress
            htmlStr += "ipAddress:" + mediaProvider.ipAddress;

            htmlStr += "</td>";
            htmlStr += "</tr>\n";
        }

        return htmlStr;
    }


    this.getSuffix = function(dataSource)
    {
        astDebug.printInfo("astDevicesViewGenerator.getSuffix()");

        var htmlStr = "";
        htmlStr += "</table>\n";
        return htmlStr;
    }

};


//=============================================================================
// definition of astItemViewer


function astShowItemInfo(item)
{
    astDebug.printInfo("astShowItemInfo() begin");

    var htmlStr = "";
    if (item)
    {
        htmlStr += "<table border=0 style=\"\">\n";
//        htmlStr += "<table border=0 style=\"width:" + SCREEN_WIDE_TABLE_WIDTH + "px;\">\n";
        htmlStr += "<tr><td>\n";

        htmlStr += "<table border=1>\n";
        htmlStr += "<tr><th>Item info</th><td class=\"wrapText\">";
        htmlStr += "title: " + cutNames(item.title, UI_LENGTH_TITLE) + "<br>";
        htmlStr += "itemType: " + item.itemType + "<br>";
        htmlStr += "date: " + item.date;
        htmlStr += "</td></tr>\n";

        htmlStr += "<tr>";
        switch(item.itemType)
        {
            case "FOLDER":
            htmlStr += "<th>FOLDER</th>\n";
//            htmlStr += "<td>";
//            htmlStr += "isRootFolder: " + item.isRootFolder;
//            htmlStr += "</td>\n";
            break;

            case "AUDIO":
            htmlStr += "<th>AUDIO</th>\n";
            htmlStr += "<td class=\"wrapText\">";
            htmlStr += "mimeType: " + item.mimeType +"<br>";
            htmlStr += "extension: " + item.extension +"<br>";
            htmlStr += "fileSize: " + item.fileSize +"<br>";
            htmlStr += "duration(sec): " + item.duration +"<br>";
            htmlStr += "artist: " + item.artist +"<br>";
            htmlStr += "albumTitle: " + item.albumTitle +"<br>";
            htmlStr += "genre: " + item.genre +"<br>";
            htmlStr += "itemUri: " + cutNames(item.itemUri, UI_LENGTH_URL);
            htmlStr += "</td>\n";
            break;

            case "IMAGE":
            htmlStr += "<th>IMAGE</th>\n";
            htmlStr += "<td class=\"wrapText\">";
            htmlStr += "mimeType: " + item.mimeType +"<br>";
            htmlStr += "extension: " + item.extension +"<br>";
            htmlStr += "fileSize: " + item.fileSize +"<br>";
            htmlStr += "width x height: " + item.width + "x" + item.height +"<br>";
            htmlStr += "itemUri: " + cutNames(item.itemUri, UI_LENGTH_URL) +"<br>";
            htmlStr += "thumbnailUri: " + cutNames(item.thumbnailUri, UI_LENGTH_URL);
            htmlStr += "</td>\n";
            break;

            case "VIDEO":
            htmlStr += "<th>VIDEO</th>\n";
            htmlStr += "<td class=\"wrapText\">";
            htmlStr += "mimeType: " + item.mimeType +"<br>";
            htmlStr += "extension: " + item.extension +"<br>";
            htmlStr += "fileSize: " + item.fileSize +"<br>";
            htmlStr += "duration(sec): " + item.duration +"<br>";
            htmlStr += "width x height: " + item.width + "x" + item.height +"<br>";
            htmlStr += "itemUri: " + cutNames(item.itemUri, UI_LENGTH_URL) +"<br>";
            htmlStr += "thumbnailUri: " + cutNames(item.thumbnailUri, UI_LENGTH_URL);
            htmlStr += "</td>\n";
            break;

            case "UNKNOWN":
            htmlStr += "<th>UNKNOWN</th>\n";
            htmlStr += "<td></td>\n";
            break;

            default:
            htmlStr += "<th>unexpected value</th>\n";
            htmlStr += "<td></td>\n";
            break;
        }

        htmlStr += "</tr>\n";
        htmlStr += "</table>";

        htmlStr += "</td><td>\n";
        if (item.thumbnailUri)
        {
            htmlStr += "<img src=\"" + item.thumbnailUri + "\"";
            htmlStr += " height=" + THUMBNAIL_HEIGHT;
            htmlStr += " width=" + THUMBNAIL_WIDTH;
            htmlStr += ">";
        }
        htmlStr += "</td></tr>\n";
        htmlStr += "</table>\n";

    }

    astSetText(DIV_ID_ITEM_INFO, htmlStr);

    astDebug.printInfo("astShowItemInfo() end");
}


//=============================================================================
// definition of astItemViewer


var astItemViewer = {};

astItemViewer.currentItem = null;


astItemViewer.getHelperStr = function()
{
    var self = this;
    var htmlStr = "";

    if (self.currentItem)
    {
        var itemType = self.currentItem.itemType;
        if (itemType == "AUDIO" || itemType == "VIDEO")
        {
            htmlStr += "; <span class=\"helperKey\">Play, Pause</span> - audio/video operations";
        }
    }

    return htmlStr;
}


astItemViewer.init = function(item)
{
    var self = this;

    astDebug.printInfo("astItemViewer.init() begin");

    self.currentItem = item;
    self.show();

    astDebug.printInfo("astItemViewer.init() end");
}


astItemViewer.finit = function()
{
    var self = this;

    self.currentItem = null;

    astDebug.printInfo("astItemViewer.finit() begin");

    astSetText(DIV_ID_ITEM, "");

    astDebug.printInfo("astItemViewer.finit() end");
}


astItemViewer.showImage = function()
{
    var self = this;

    astDebug.printInfo("astItemViewer.showImage() begin");

    var htmlStr = "";

    htmlStr += "<table border=1>\n<tr><td>\n";

    var url = self.currentItem.itemUri;
    if (url)
    {
//        htmlStr += "URL: " + url + "<br>\n";
        htmlStr += "<img src=\"" + url + "\"";
        htmlStr += " height=" + CONTENTS_VIEWER_HEIGHT;
        htmlStr += " width=" + CONTENTS_VIEWER_WIDTH;
        htmlStr += ">\n";
    }
    htmlStr += "</td></tr>\n</table>\n";

    astSetText(DIV_ID_ITEM, "Image viewer:" + cutNames(self.currentItem.title) + "<br>" + htmlStr);

    astDebug.printInfo("astItemViewer.showImage() end");
}


astItemViewer.showAudio = function()
{
    var self = this;

    astDebug.printInfo("astItemViewer.showAudio() begin");

    var htmlStr = "";
    var playerId = PLAYER_ID;
    var url = self.currentItem.itemUri;
    if (url)
    {
//        htmlStr += "URL: " + url + "<br>\n";
        htmlStr += "<audio id=\"" + playerId + "\" src=\"" + url + "\" controls=\"controls\" >\nBrowser does not support the audio tag</audio>";
    }

    astSetText(DIV_ID_ITEM, "Audio viewer:" + cutNames(self.currentItem.title) + "<br>" + htmlStr);

    astDebug.printInfo("astItemViewer.showAudio() end");
}


astItemViewer.showVideo = function()
{
    var self = this;

    astDebug.printInfo("astItemViewer.showVideo() begin");

    var htmlStr = "";
    var playerId = PLAYER_ID;
    var url = self.currentItem.itemUri;
    if (url)
    {
//        htmlStr += "URL: " + url + "<br>\n";

        htmlStr += "<video id=\"" + playerId + "\"";
        htmlStr += " height=" + CONTENTS_VIEWER_HEIGHT;
        htmlStr += " width=" + CONTENTS_VIEWER_WIDTH;
        htmlStr += " src=\"" + url + "\" controls=\"controls\" >\nBrowser does not support the video tag</video>";
    }

    astSetText(DIV_ID_ITEM, "Video viewer:" + cutNames(self.currentItem.title) + "<br>" + htmlStr);

    astDebug.printInfo("astItemViewer.showVideo() end");
}


astItemViewer.show = function()
{
    var self = this;

    astDebug.printInfo("astItemViewer.show() begin");

    if (self.currentItem)
    {
        var itemType = self.currentItem.itemType;
        switch(itemType)
        {
            case "IMAGE":
                self.showImage();
            break;

            case "AUDIO":
                self.showAudio();
            break;

            case "VIDEO":
                self.showVideo();
            break;

            default:
                astSetText(DIV_ID_ITEM, "Viewer: Unknown type of media item");
            break;
        }
    }

    astDebug.printInfo("astItemViewer.show() end");
}


astItemViewer.keyDown = function(keyCode)
{
    var self = this;

    astDebug.printInfo("astItemViewer.keyDown() begin");
    astDebug.printDebug("astItemViewer.keyDown: " + keyCode);

    if (self.currentItem)
    {
        switch(keyCode)
        {

            case tvKey.KEY_PLAY:
                astDebug.printDebug("KEY_PLAY");
                {
                    var player = document.getElementById(PLAYER_ID);
                    if (player)
                    {
                        try
                        {
                            player.play();
                        }
                        catch (e)
                        {
                            astDebug.printError("player.play cause exception: "+ e);
                        }
                    }
                    else
                    {
                        astDebug.printError("no playerId item");
                    }
                }
                break;

            case tvKey.KEY_PAUSE:
                astDebug.printDebug("KEY_PAUSE");
                {
                    var player = document.getElementById(PLAYER_ID);
                    if (player)
                    {
                        try
                        {
                            player.pause();
                        }
                        catch (e)
                        {
                            astDebug.printError("player.pause cause exception: "+ e);
                        }
                    }
                    else
                    {
                        astDebug.printError("no playerId item");
                    }
                }
                break;

        }

    }
    astDebug.printInfo("astItemViewer.keyDown() end");
}


//=============================================================================
// list of devices


var astModeDeviceSelection = {};

astModeDeviceSelection.mediaProvidersArray = [];
astModeDeviceSelection.viewList = new astViewList(DEVICE_VIEW_SIZE, DIV_ID_DEVICES_LIST, new astDevicesViewGenerator());


astModeDeviceSelection.getMode = function()
{
    return AST_MODE_DEVICE_SELECTION;
}


astModeDeviceSelection.updateHelper = function()
{
    var self = this;
    var htmlStr = "<span class=\"helperMode\">&nbsp;Device Selection: </span>\n"
           + "<span class=\"helperKey\">Yellow</span> - Refresh list; \n"
           + "<span class=\"helperKey\">Up, Down</span> - Navigation; \n"
           + "<span class=\"helperKey\">Right</span> - Select device for Browse; \n";

    var currentMediaProvider = self.viewList.getSelectedItem();
    if (currentMediaProvider && currentMediaProvider.isSearchable)
    {
        htmlStr += "<span class=\"helperKey\">Green</span> - Select device for Search";
    }

    astSetText(DIV_ID_HELPER, htmlStr);
}


astModeDeviceSelection.init = function()
{
    var self = this;

    astDebug.printInfo("astModeDeviceSelection.init() begin")

    self.viewList.getViewGenerator().setModeAll();

    self.ondeviceadded = function(d)
    {
        astDebug.printDebug("ondeviceadded()");
        astDebug.printDebug("ondeviceadded: " + d.name);

        self.show();
    }

    self.ondeviceremoved = function(d)
    {
        astDebug.printDebug("ondeviceremoved()");
        astDebug.printDebug("ondeviceremoved: " + d.name);

        var currentMediaProvider = self.viewList.getSelectedItem();
        if (currentMediaProvider)
        {
            if (currentMediaProvider.id == d.id)
            {
                astDebug.printDebug("currentMediaProvider removed");
                astMain.SetMode(astModeDeviceSelection);
            }
        }

        self.show();
    }

    try
    {
        var serviceProvider = window.webapis.allshare.serviceconnector.getServiceProvider();
        if (serviceProvider)
        {
            var deviceFinder = serviceProvider.getDeviceFinder();
            if (deviceFinder)
            {
                // avoid double registration when return to device selection mode again
                if (this.listenerId == null)
                {
                    this.listenerId = deviceFinder.addDeviceDiscoveryListener(self);

try{
}catch(e)
{
        astDebug.printError("near addDeviceDiscoveryListener exception : " + e.name + "(" + e.code + ") :" + e.message);
}

                    // deviceFinder.removeDeviceDiscoveryListener(this.listenerId); // ?? test
                }
            }
        }
        else
        {
            astDebug.printDebug("serviceProvider == null");
        }
    }
    catch(e)
    {
        // e. WebAPIException
        astDebug.printError("near addDeviceDiscoveryListener exception : " + e.name + "(" + e.code + ") :" + e.message);
    }

    self.show();

    astDebug.printInfo("astModeDeviceSelection.init() end")
}


astModeDeviceSelection.finit = function()
{
    var self = this;

    astDebug.printInfo("astModeDeviceSelection.finit() begin");

    var currentMediaProvider = self.viewList.getSelectedItem();
    if (currentMediaProvider)
    {
        self.viewList.getViewGenerator().setModeSelectedOnly();
        self.viewList.updateViewList();
    }
    else
    {
        astDebug.printDebug("self.currentMediaProvider is null");
    }

    astDebug.printInfo("astModeDeviceSelection.finit() end");
}


astModeDeviceSelection.show = function()
{
    var self = this;

    astDebug.printInfo("astModeDeviceSelection.show() begin");

    var currentMediaProvider = self.viewList.getSelectedItem();

    self.mediaProvidersArray = [];
    var currentMediaProviderIdx = 0;

    var deviceFinder = window.webapis.allshare.serviceconnector.getServiceProvider().getDeviceFinder();

    var deviceType = "MEDIAPROVIDER";
    var mediaProvidersArray = deviceFinder.getDeviceList(deviceType);
    // if some media provider was selected find it index in new list of media providers
    if (currentMediaProvider)
    {
        for (i = 0; i < mediaProvidersArray.length; i++)
        {
            if (currentMediaProvider.id == mediaProvidersArray[i].id)
            {
                astDebug.printDebug("currentMediaProviderIdx:" + currentMediaProviderIdx);
                currentMediaProviderIdx = i;
                break;
            }
        }
    }

    if (mediaProvidersArray)
    {
        // providers array could be empty, but avoid null value
        self.mediaProvidersArray = mediaProvidersArray;
    }
    self.viewList.setDataArray(self.mediaProvidersArray, currentMediaProviderIdx);

    self.updateHelper();

    astDebug.printInfo("astModeDeviceSelection.show() end");
}


astModeDeviceSelection.getCurrentMediaProvider = function()
{
    var self = this;
    return self.viewList.getSelectedItem();
}


astModeDeviceSelection.refresh = function()
{
    try
    {
        var serviceProvider = window.webapis.allshare.serviceconnector.getServiceProvider();
        if (serviceProvider)
        {
            var deviceFinder = serviceProvider.getDeviceFinder();
            if (deviceFinder)
            {
                deviceFinder.refresh();
            }
            else
            {
                astDebug.printDebug("deviceFinder == null");
            }
        }
        else
        {
            astDebug.printDebug("serviceProvider == null");
        }
    }
    catch(e)
    {
        // e. WebAPIException
        astDebug.printError("near addDeviceDiscoveryListener exception : " + e.name + "(" + e.code + ") :" + e.message);
    }
}

astModeDeviceSelection.keyDown = function(keyCode)
{
    var self = this;

    astDebug.printInfo("astModeDeviceSelection.keyDown() begin");

    astDebug.printDebug("astModeDeviceSelection.keyDown: " + keyCode);

    switch(keyCode)
    {
        case tvKey.KEY_UP:
            astDebug.printDebug("KEY_UP");
            self.viewList.previous();
            break;

        case tvKey.KEY_DOWN:
            astDebug.printDebug("KEY_DOWN");
            self.viewList.next();
            break;

        case tvKey.KEY_ENTER:
            astDebug.printDebug("KEY_ENTER");
            astMain.SetMode(astModeBrowse);
            break;

        case tvKey.KEY_RIGHT:
            astDebug.printDebug("KEY_RIGHT");
            astMain.SetMode(astModeBrowse);
            break;

        case tvKey.KEY_GREEN:
            astDebug.printDebug("KEY_GREEN");
            var currentMediaProvider = self.viewList.getSelectedItem();
            if (currentMediaProvider && currentMediaProvider.isSearchable)
            {
                astMain.SetMode(astModeSearch);
            }
            break;

        case tvKey.KEY_YELLOW:
            astDebug.printDebug("KEY_YELLOW");
            self.refresh();
            self.show();
            break;
    }

    astDebug.printInfo("astModeDeviceSelection.keyDown() end");
}


//=============================================================================
//  navigationPathItem


function astNavigationPathItem(folder, selectedItemIdx)
{
    this.folder = folder;
    this.selectedItemIdx = selectedItemIdx;

    this.getFolder = function()
    {
        return this.folder;
    }

    this.getSelectedItemIdx = function()
    {
        return this.selectedItemIdx;
    }

    this.setSelectedItemIdx = function(selectedItemIdx)
    {
        this.selectedItemIdx = selectedItemIdx;
    }

    this.debug = function()
    {
        astDebug.printDebug("astNavigationPathItem : folder:" + this.folder.title + "   idx:" + this.selectedItemIdx);
    }
    
}


//=============================================================================
//  astModeBrowse


astModeBrowse.resultItems = [];

astModeBrowse.navigationPath = null;

astModeBrowse.viewList = new astViewList(ITEMS_VIEW_SIZE, DIV_ID_BROWSE, new astContentsViewGenerator());


astModeBrowse.getMode = function()
{
    return AST_MODE_BROWSE;
}


astModeBrowse.updateHelper = function()
{
    var self = this;

    var htmlStr = "<span class=\"helperMode\">&nbsp;Contents browsing: </span>\n"
        + "<span class=\"helperKey\">Left, Up, Down, Right, Enter</span> - Navigation";

    htmlStr += astItemViewer.getHelperStr();

    astSetText(DIV_ID_HELPER, htmlStr);
}


astModeBrowse.browseFolder = function(mediaProvider, folderItem, startIndex)
{
    var self = this;

    astDebug.printInfo("astModeBrowse.browseFolder() begin");

    var mediaProviderSuccessCallback = function(sc_itemList, sc_fEndOfItems, sc_providerId)
    {
        astDebug.printInfo("success browse callback begin");

        self.updateHelper();
        astSetText(DIV_ID_WAITING_RESPONSE, "");

        astDebug.printDebug("itemsList.length : " + sc_itemList.length);
        astDebug.printDebug("fEndOfItems : " + sc_fEndOfItems);

        // copy result into 'resultItems' and request for another portion if needed
        self.resultItems = self.resultItems.concat(sc_itemList);
        astDebug.printDebug("add items into resultItems, new length :" + self.resultItems.length);

        if (! sc_fEndOfItems)
        {
            // make another request
            astDebug.printError("sc_fEndOfItems == false");
        }

       // all items readed
       astDebug.printDebug("all data readed");
       var navigationPathItem = self.navigationPath[self.navigationPath.length - 1];
       var selectedItemIdx = navigationPathItem.getSelectedItemIdx();

        self.viewList.setDataArray(self.resultItems, selectedItemIdx);
        astShowItemInfo(self.viewList.getSelectedItem());

        astDebug.printDebug("success callback end");
    }

    var mediaProviderErrorCallback = function(webAPIError, providerId)
    {
//        astDebug.printError("browseItemsErrorCallback()");
        astDebug.printError("browseItemsErrorCallback() webAPIError:" + webAPIError.name + ", " + webAPIError.message);

        self.updateHelper();
        astSetText(DIV_ID_WAITING_RESPONSE, "");

        self.viewList.setDataArray(self.resultItems, 0); // set empty
    }


    if (folderItem == null)
    {
        astDebug.printError("folderItem == null");
    }
    else
    {
        var itemType = folderItem.itemType;
        if (itemType != "FOLDER")
        {
            astDebug.printError("item type of folderItem argument is not ITEM_FOLDER. Type is : "+ itemType);
        }
    //    else
        {
            try
            {
                astDebug.printDebug("before browse");
                var requestCount = 0; // mean get all

                self.updateHelper();
                astSetText(DIV_ID_WAITING_RESPONSE, "&nbsp;Waiting browse result&nbsp;");

                var browseFilter = null; // not implemented
/*
                var attributeFilter2_1 = new window.webapis.AttributeFilter("itemType", "EXACTLY", "AUDIO");
//                var attributeRangeFilter2_1 = new window.webapis.AttributeRangeFilter("fileSize", 700000, 2000000);
//                var attributeRangeFilter2_1 = new window.webapis.AttributeRangeFilter("fileSize", null, 2000000);
                var attributeRangeFilter2_1 = new window.webapis.AttributeRangeFilter("fileSize", 2000000);
                var compositeFilter2 = new window.webapis.CompositeFilter("INTERSECTION", [attributeFilter2_1, attributeRangeFilter2_1]);

                var attributeFilter1 = new window.webapis.AttributeFilter("title", "CONTAINS", "sh");
                var attributeFilter2 = new window.webapis.AttributeFilter("title", "CONTAINS", "i");
                var attributeFilter3 = new window.webapis.AttributeFilter("title", "CONTAINS", "set");

                var browseFilter = new window.webapis.CompositeFilter("UNION", [attributeFilter1, attributeFilter2, attributeFilter3, compositeFilter2]);
*/                
//                var browseFilter = new window.webapis.AttributeFilter("title", "ENDSWITH", "fOlder");
                
                var sortMode = null; // not implemented
// requestCount = 2; // for debug
                mediaProvider.browse(folderItem, startIndex, requestCount, mediaProviderSuccessCallback, mediaProviderErrorCallback, browseFilter, sortMode); // may throw exception

                astDebug.printDebug("after browse");
            }
            catch(e)
            {
                // e. WebAPIException
                astDebug.printError("browseItems() exception : " + e.name + "(" + e.code + ") :" + e.message);

                self.updateHelper();
                astSetText(DIV_ID_WAITING_RESPONSE, "");
            }
        }
    }

    astDebug.printInfo("astModeBrowse.browseFolder() end");
}


astModeBrowse.init = function()
{
    var self = this;

    astDebug.printInfo("astModeBrowse.init() begin");

    self.updateHelper();

    self.resultItems = [];
    self.navigationPath = [];

    self.viewList.setDataArray(self.resultItems, 0); // empty
    astShowItemInfo(null);

    var mediaProvider = astModeDeviceSelection.getCurrentMediaProvider();

    if (mediaProvider)
    {
        astDebug.printDebug("mediaProvider.name : " + mediaProvider.name);

        var folderItem = null;
        try
        {
            folderItem = mediaProvider.rootFolder; 
        }
        catch(e)
        {
            // e. WebAPIException
            astDebug.printError("get root folder exception : " + e.name + "(" + e.code + ") :" + e.message);
        }

        self.navigationPath.push(new astNavigationPathItem(folderItem, 0));
        self.updateNavigationPath();

        astDebug.printDebug("after get root folder");

        if (folderItem)
        {
            astDebug.printDebug("checking for root folder");

            var startIndex = 0;
            self.browseFolder(mediaProvider, folderItem, startIndex);
        }
    }

    astDebug.printInfo("astModeBrowse.init() end");
}


astModeBrowse.finit = function()
{
    var self = this;

    astDebug.printInfo("astModeBrowse.finit() begin");

    astSetText(DIV_ID_BROWSE_PATH, "");
    astSetText(DIV_ID_BROWSE, ""); 

    astShowItemInfo(null);

    astItemViewer.finit();

    astDebug.printInfo("astModeBrowse.finit() end");
}


astModeBrowse.show = function()
{
    var self = this;

    astDebug.printInfo("astModeBrowse.show");
}


astModeBrowse.updateNavigationPath = function()
{
    astDebug.printInfo("astModeBrowse:updateNavigationPath() begin");

    var self = this;

    // shows folders path
    var pathHtml = "";
    for (i = 0; i < self.navigationPath.length; i++)
    {
        astDebug.printDebug("i:" + i);

        var navigationPathItem = self.navigationPath[i];
        navigationPathItem.debug();
        var item = navigationPathItem.getFolder();
        astDebug.printDebug("itemName:" + item.title);
        if (item.isRootFolder)
        {
            pathHtml += "/"; 
        }
        else
        {
            astDebug.printDebug("before itemType == FOLDER");
            pathHtml += cutNames(item.title, UI_LENGTH_NAME_PATH);
            if (item.itemType == "FOLDER")
            {
                pathHtml += "/";
            }
        }
    }

    astSetText(DIV_ID_BROWSE_PATH, "Current item path: " + pathHtml);

    astDebug.printInfo("astModeBrowse:updateNavigationPath() end");
}


astModeBrowse.leaveFolder = function()
{
    var self = this;

    astDebug.printInfo("astMoveBrowse.leaveFolder() begin");

    astItemViewer.finit();

    var result  = { isLeavingRoot: false };

    if (self.navigationPath.length == 1)
    {
        result.isLeavingRoot = true;
        astDebug.printDebug("result.isLeavingRoot = true");

        return result;
    }
    else
    if (self.navigationPath.length > 1)
    {
        self.navigationPath.pop();
        var navigationPathItem = self.navigationPath[self.navigationPath.length - 1];
        self.updateNavigationPath();

        self.resultItems = [];
        self.viewList.setDataArray(self.resultItems, 0); // set empty
        astShowItemInfo(null);

        var mediaProvider = astModeDeviceSelection.getCurrentMediaProvider();

        if (mediaProvider)
        {
            astDebug.printDebug("mediaProvider.name : " + mediaProvider.name);

            var folderItem = navigationPathItem.getFolder();
            if (folderItem)
            {
                var startIndex = 0;
                self.browseFolder(mediaProvider, folderItem, startIndex);
            }
        }
    }

    astDebug.printInfo("astMoveBrowse.leaveFolder() end");

    return result;
}


astModeBrowse.selectCurrentItem = function()
{
    var self = this;

    astDebug.printInfo("astModeBrowse.selectCurrentItem() begin");
    // enter folder

    var item = self.viewList.getSelectedItem();
    if (item)
    {
        var itemType = item.itemType;
        if (itemType == "FOLDER")
        {
            var folderItem = item;
            self.navigationPath[self.navigationPath.length - 1].setSelectedItemIdx(self.viewList.getSelectedItemIdx());
            var navigationPathItem = new astNavigationPathItem(folderItem, 0);
            self.navigationPath.push(navigationPathItem);
            self.updateNavigationPath();

            self.resultItems = [];
            self.viewList.setDataArray(self.resultItems, 0); // set empty
            astShowItemInfo(null);

            var mediaProvider = astModeDeviceSelection.getCurrentMediaProvider();

            if (mediaProvider)
            {
                astDebug.printDebug("mediaProvider.name : " + mediaProvider.name);

                if (folderItem)
                {
                    var startIndex = 0;
                    self.browseFolder(mediaProvider, folderItem, startIndex);
                }
            }
        }
        else
        {
            // activate item viewer
            astDebug.printDebug("activate ItemViewer ");
            astDebug.printItem(item);

            astItemViewer.init(item);
            self.updateHelper();
        }
    }

    astDebug.printInfo("astModeBrowse.selectCurrentItem() end");
}


astModeBrowse.keyDown = function(keyCode)
{
    var self = this;

    astDebug.printInfo("astModeBrowse.keyDown() begin");

    astDebug.printDebug("astModeBrowse.keyDown: " + keyCode);

    switch(keyCode)
    {
        case tvKey.KEY_LEFT:
            astDebug.printDebug("KEY_LEFT");
            var result = self.leaveFolder();
            if (result.isLeavingRoot)
            {
                astMain.SetMode(astModeDeviceSelection);
            }
            break;

        case tvKey.KEY_UP:
            astDebug.printDebug("KEY_UP");
            self.viewList.previous();
            astShowItemInfo(self.viewList.getSelectedItem());
            astItemViewer.finit();
            self.updateHelper();
            break;

        case tvKey.KEY_DOWN:
            astDebug.printDebug("KEY_DOWN");
            self.viewList.next();
            astShowItemInfo(self.viewList.getSelectedItem());
            astItemViewer.finit();
            self.updateHelper();
            break;

        case tvKey.KEY_RIGHT:
            astDebug.printDebug("KEY_RIGHT");
            self.selectCurrentItem();
            break;

        case tvKey.KEY_ENTER:
            astDebug.printDebug("KEY_ENTER");
            self.selectCurrentItem();
            break;

//        case tvKey.KEY_RED:
//            astDebug.printDebug("KEY_RED");
//            break;

        default:
            astItemViewer.keyDown(keyCode);
            break;

    }

    astDebug.printInfo("astModeBrowse.keyDown() end");
}


//=============================================================================
//  astModeSearch


astModeSearch.resultItems = null;

astModeSearch.viewList = new astViewList(ITEMS_VIEW_SIZE, DIV_ID_BROWSE, new astContentsViewGenerator());

astModeSearch.fKeywordMode = false;


astModeSearch.getMode = function()
{
    return AST_MODE_SEARCH;
}


astModeSearch.updateHelper = function()
{
    var self = this;

    var htmlStr = "<span class=\"helperMode\">&nbsp;Search: </span>\n"
        + "<span class=\"helperKey\">Left, Up, Down, Right, Enter</span> - Navigation;  "
        + "<span class=\"helperKey\">Blue</span> - Edit keyword";
    
//    if (self.pendingOperation)
//    {
//        htmlStr += "; <span class=\"helperKey\">Red</span> - Cancel pending operation";
//    }

    htmlStr += astItemViewer.getHelperStr();

    astSetText(DIV_ID_HELPER, htmlStr);
}


astModeSearch.search = function(mediaProvider, keyword, startIndex)
{
    var self = this;

    astDebug.printInfo("astModeSearch.search() begin");

    var mediaProviderSuccessCallback = function(sc_itemList, sc_fEndOfItems, sc_providerId)
    {
        astDebug.printDebug("success search callback");

        self.updateHelper();
        astSetText(DIV_ID_WAITING_RESPONSE, "");

        astDebug.printDebug("itemsList.length : " + sc_itemList.length);
        astDebug.printDebug("fEndOfItems : " + sc_fEndOfItems);

        // copy result into 'resultItems' and request for another portion if needed
        self.resultItems = self.resultItems.concat(sc_itemList);
        astDebug.printDebug("add items into resultItems, new length :" + self.resultItems.length);

        if (! sc_fEndOfItems)
        {
            // make another request
            astDebug.printError("sc_fEndOfItems == false");
        }

        // all items readed
        astDebug.printDebug("all data readed");

        self.viewList.setDataArray(self.resultItems, 0);
        astShowItemInfo(self.viewList.getSelectedItem());
    }

    var mediaProviderErrorCallback = function(webAPIError, providerId)
    {
//        astDebug.printError("mediaProviderErrorCallback()");
        astDebug.printError("searchItemsErrorCallback() webAPIError:" + webAPIError.name + ", " + webAPIError.message);

        self.updateHelper();
        astSetText(DIV_ID_WAITING_RESPONSE, "");

        self.viewList.setDataArray(self.resultItems, 0); // set empty
    }

    try
    {
        astDebug.printDebug("before search");
        var requestCount = 0; // mean get all

        self.updateHelper();
        astSetText(DIV_ID_WAITING_RESPONSE, "&nbsp;Waiting search result&nbsp;");

        var searchFilter = null;
        mediaProvider.search(keyword, startIndex, requestCount, mediaProviderSuccessCallback, mediaProviderErrorCallback, searchFilter);

        astDebug.printDebug("after search");
    }
    catch(e)
    {
        // e. WebAPIException
        astDebug.printError("searchItems() exception : " + e.name + "(" + e.code + ") :" + e.message);

        self.updateHelper();
        astSetText(DIV_ID_WAITING_RESPONSE, "");
    }

    astDebug.printInfo("astModeSearch.search() end");
}


astModeSearch.doSearch = function()
{
    var self = this;

    astDebug.printInfo("astModeSearch.doSearch() begin");
    
    self.resultItems = [];
    self.viewList.setDataArray(self.resultItems, 0); // empty
    astShowItemInfo(null); // clean

    var keyword = astKeywordInput.getKeyword();
    astSetText(DIV_ID_BROWSE_PATH, "Searching keyword: " + keyword);

    var mediaProvider = astModeDeviceSelection.getCurrentMediaProvider();

    if (mediaProvider)
    {
        astDebug.printDebug("mediaProvider.name : " + mediaProvider.name);

        var startIndex = 0;
        self.search(mediaProvider, keyword, startIndex);
    }

    astDebug.printInfo("astModeSearch.doSearch() end");
}


astModeSearch.init = function()
{
    var self = this;

    astDebug.printInfo("astModeSearch.init() begin");

    self.updateHelper();

    self.fKeywordMode = false;

    self.doSearch();

    astDebug.printInfo("astModeSearch.init() end");
}


astModeSearch.finit = function()
{
    var self = this;

    astDebug.printInfo("astModeSearch.finit() begin");
    
    astSetText(DIV_ID_BROWSE_PATH, "");
    astSetText(DIV_ID_BROWSE, ""); 

    astShowItemInfo(null);

    astKeywordInput.finit();
    astItemViewer.finit();

    astDebug.printInfo("astModeSearch.finit() end");
}


astModeSearch.show = function()
{
    var self = this;

    astDebug.printInfo("astModeSearch.show()");
}


astModeSearch.leaveFolder = function()
{
    var self = this;

    astDebug.printInfo("astModeSearch.leaveFolder() begin");

    astItemViewer.finit();

    var result  = { isLeavingRoot: true };
    astDebug.printDebug("result.isLeavingRoot = true");

    astDebug.printInfo("astModeSearch.leaveFolder() end");

    return result;
}


astModeSearch.selectCurrentItem = function()
{
    var self = this;

    astDebug.printInfo("astModeSearch.selectCurrentItem() begin");
  
    var item = self.viewList.getSelectedItem();
    if (item)
    {
        if (item.itemType == "FOLDER")
        {
            var folderItem = item;
            astDebug.printError("FOLDER selection in search is not supported!");
        }
        else
        {
            // activate item viewer
            astDebug.printDebug("activate ItemViewer ");
            astDebug.printItem(item);

            astItemViewer.init(item);
            self.updateHelper();
        }
    }

    astDebug.printInfo("astModeSearch.selectCurrentItem() end");
}


astModeSearch.keyDown = function(keyCode)
{
    var self = this;

    astDebug.printInfo("astModeSearch.keyDown() begin");
    astDebug.printDebug("astModeSearch.keyDown: " + keyCode);

    if (self.fKeywordMode)
    {
        switch(keyCode)
        {
            case tvKey.KEY_BLUE:
                astDebug.printDebug("KEY_BLUE");
                self.fKeywordMode = false;
                astKeywordInput.finit();
                self.updateHelper();
                self.doSearch();
                break;

            default:
                astKeywordInput.keyDown(keyCode);
                break;
        }
    }
    else
    {
        switch(keyCode)
        {
            case tvKey.KEY_LEFT:
                astDebug.printDebug("KEY_LEFT");
                var result = self.leaveFolder();
                if (result.isLeavingRoot)
                {
                    astMain.SetMode(astModeDeviceSelection);
                }
                break;

            case tvKey.KEY_UP:
                astDebug.printDebug("KEY_UP");
                self.viewList.previous();
                astShowItemInfo(self.viewList.getSelectedItem());
                astItemViewer.finit();
                self.updateHelper();
                break;

            case tvKey.KEY_DOWN:
                astDebug.printDebug("KEY_DOWN");
                self.viewList.next();
                astShowItemInfo(self.viewList.getSelectedItem());
                astItemViewer.finit();
                self.updateHelper();
                break;

            case tvKey.KEY_RIGHT:
                astDebug.printDebug("KEY_RIGHT");
                self.selectCurrentItem();
                break;

            case tvKey.KEY_ENTER:
                astDebug.printDebug("KEY_ENTER");
                self.selectCurrentItem();
                break;

//            case tvKey.KEY_RED:
//                astDebug.printDebug("KEY_RED");
//                break;

            case tvKey.KEY_BLUE:
                astDebug.printDebug("KEY_BLUE");
                astItemViewer.finit();
                self.fKeywordMode = true;
                astKeywordInput.init();
                break;

            default:
                astItemViewer.keyDown(keyCode);
                break;

        }
    }
    astDebug.printInfo("astModeSearch.keyDown() end");
}


//=============================================================================
//  astModeKeywordInput

var astKeywordInput = {};


astKeywordInput.resultKeyword = "a";
astKeywordInput.selectedCharIdx = 0;
astKeywordInput.charArray = 
[
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
    "l", "m", "n", "o", "p", "q", "r", "s", "t","u", "v",
    "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "_", ",",
    ".", "-"
];

astKeywordInput.MAX_COLUMNS = 10;


astKeywordInput.updateHelper= function()
{
    var htmlStr = "<span class=\"helperMode\">&nbsp;KeywordInput: </span>\n"
        + "<span class=\"helperKey\">Left, Up, Down, Right</span> - Navigation; \n"
        + "<span class=\"helperKey\">Enter</span> - Add character; \n"
        + "<span class=\"helperKey\">Red</span> - Remove char; \n"
        + "<span class=\"helperKey\">Blue</span> - Hide keyword editor & search again";

    astSetText(DIV_ID_HELPER, htmlStr);
}


astKeywordInput.init = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.init() begin");

    self.updateHelper();
    self.update();

    astDebug.printInfo("astKeywordInput.init() end");
}


astKeywordInput.finit = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.finit() begin");

    astSetText(DIV_ID_KEYWORD, "");

    astDebug.printInfo("astKeywordInput.finit() end");
}


astKeywordInput.update = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.update() begin");

    var htmlStr = "<b>Current keyword: " + self.resultKeyword + "</b>";
    htmlStr += "<br>";
    htmlStr += "<table border=1>\n";
    

    var fAllElementsPrinted = false;
    for (rows = 0; ; rows++)
    {
        htmlStr += "<tr>";
        for (columns = 0; columns < self.MAX_COLUMNS; columns++)
        {
            var ch = "";
            var fSelected = false;
            var index = rows * self.MAX_COLUMNS + columns;
            if (index >= self.charArray.length)
            {
                fAllElementsPrinted = true;
            }
            else
            {
                ch = self.charArray[index];
                if (index == this.selectedCharIdx)
                {
                    fSelected = true;
                }
            }
            htmlStr += "<td";
            if (fSelected)
            {
                htmlStr += " style=\"background-color:#31B404;\"";
            }
            htmlStr += ">";
            htmlStr += ch;
            htmlStr += "</td>"
        }
        htmlStr += "</tr>\n";

        if (fAllElementsPrinted)
        {
            break;
        }
    }


    htmlStr += "</table>\n";

    astSetText(DIV_ID_KEYWORD, htmlStr);
    
    astDebug.printInfo("astKeywordInput.update() end");
}


astKeywordInput.moveUp = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.moveUp() begin");

    self.selectedCharIdx -= self.MAX_COLUMNS;
    if (self.selectedCharIdx < 0)
    {
        self.selectedCharIdx = self.charArray.length - 1;
    }

    self.update();

    astDebug.printInfo("astKeywordInput.moveUp() end");
}


astKeywordInput.moveDown = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.moveDown() begin");

    self.selectedCharIdx += self.MAX_COLUMNS;
    if (self.selectedCharIdx >= self.charArray.length)
    {
        self.selectedCharIdx = 0;
    }

    self.update();

    astDebug.printInfo("astKeywordInput.moveDown() end");
}


astKeywordInput.moveLeft = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.moveLeft() begin");

    self.selectedCharIdx -= 1;
    if (self.selectedCharIdx < 0)
    {
        self.selectedCharIdx = self.charArray.length - 1;
    }

    self.update();

    astDebug.printInfo("astKeywordInput.moveLeft() end");
}


astKeywordInput.moveRight = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.moveRight() begin");

    self.selectedCharIdx += 1;
    if (self.selectedCharIdx >= self.charArray.length)
    {
        self.selectedCharIdx = 0;
    }

    self.update();

    astDebug.printInfo("astKeywordInput.moveRight() end");
}


astKeywordInput.remove = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.remove() begin");

    var length = self.resultKeyword.length;
    if (length > 0)
    {
        self.resultKeyword = self.resultKeyword.substring(0, length - 1);
    }

    self.update();

    astDebug.printInfo("astKeywordInput.remove() end");
}


astKeywordInput.selectCurrentItem = function()
{
    var self = this;

    astDebug.printInfo("astKeywordInput.selectCurrentItem() begin");

    self.resultKeyword += self.charArray[self.selectedCharIdx];

    self.update();

    astDebug.printInfo("astKeywordInput.selectCurrentItem() end");
}


astKeywordInput.getKeyword = function()
{
    astDebug.printDebug("astKeywordInput.getKeyword()");
    var self = this;
    return self.resultKeyword;
}


astKeywordInput.keyDown = function(keyCode)
{
    var self = this;

    astDebug.printInfo("astKeywordInput.keyDown() begin");
    astDebug.printDebug("astKeywordInput.keyDown(): " + keyCode);


   switch(keyCode)
    {
        case tvKey.KEY_LEFT:
            astDebug.printDebug("KEY_LEFT");
            self.moveLeft();
            break;

        case tvKey.KEY_UP:
            astDebug.printDebug("KEY_UP");
            self.moveUp();
            break;

        case tvKey.KEY_DOWN:
            astDebug.printDebug("KEY_DOWN");
            self.moveDown();
            break;

        case tvKey.KEY_RIGHT:
            astDebug.printDebug("KEY_RIGHT");
            self.moveRight();
            break;

        case tvKey.KEY_ENTER:
            astDebug.printDebug("KEY_ENTER");
            self.selectCurrentItem();
            break;

        case tvKey.KEY_RED:
            astDebug.printDebug("KEY_RED");
            self.remove();
            break;

        // finish

    }

    astDebug.printInfo("astKeywordInput.keyDown() end");
}


//=============================================================================
// definition of astMain


astMain.currentMode = null;

astMain.onLoad = function()
{
    var self = this;

    astDebug.printDebug("astMain.onLoad()  begin");

    function serviceProviderCreateSuccessCallback(serviceProvider)
    {
        astDebug.printDebug("serviceProviderCreateSuccessCallback()");
    }

    function serviceProviderErrorCallback(error, state)
    {
        astDebug.printDebug("serviceProviderErrorCallback() error.name: " + error.name + "  error.message:" +error.message + "  state:" + state);
    }


    try
    {
        window.webapis.allshare.serviceconnector.createServiceProvider(serviceProviderCreateSuccessCallback, serviceProviderErrorCallback);
    }
    catch(e)
    {
        // e. WebAPIException
        astDebug.printError(" exception : " + e.name + "(" + e.code + ") :" + e.message);
    }


    if (widgetAPI)
    {
        widgetAPI.sendReadyEvent();
    }
    document.getElementById("anchor").focus();

    // clean html from temporary elements
    astSetText(DIV_ID_DEVICES_LIST, "");
    astSetText(DIV_ID_BROWSE_PATH, "");
    astSetText(DIV_ID_BROWSE, "");
    astSetText(DIV_ID_ITEM, "");
    astSetText(DIV_ID_ITEM_INFO, "");
    astSetText(DIV_ID_LOG, "");
    var versionInfo = "Implementation of AllShare WebAPI 1.3:";
    versionInfo += "&nbsp;&nbsp;&nbsp; AllShare WebAPI JS version:" + window.webapis.allshare.VERSION_ALLSHARE_WEBAPI;
    versionInfo += "  &nbsp;&nbsp;&nbsp; Sample application version:" + VERSION_SAMPLE_APP
    astSetText(DIV_ID_VERSION_INFO, versionInfo);
    astSetText(DIV_ID_HELPER, "");
    astSetText(DIV_ID_KEYWORD, "");

    self.SetMode(astModeDeviceSelection);

    astDebug.printDebug("astMain.onLoad()  end");
}


astMain.keyDown = function()
{
    var self = this;

    astDebug.printInfo("astMain.keyDown() begin");
    
    var keyCode = event.keyCode;
    astDebug.printDebug("Main Key code: " + keyCode);

    self.currentMode.keyDown(keyCode);

    astDebug.printInfo("astMain.keyDown() end");
}


astMain.SetMode = function(mode)
{
    var self = this;

    astDebug.printInfo("astMain.SetMode() begin");

    if (self.currentMode)
    {
        self.currentMode.finit();
    }

    astDebug.printDebug("astMain.SetMode: " + mode.getMode());

    self.currentMode = mode;

    mode.init();

    astDebug.printInfo("astMain.SetMode() end");
}


//=============================================================================
// END


alert("allshare_api_test.js end");


