var Main = {
   // Main object 
};
var widgetAPI = new Common.API.Widget(); // Create Common module


Main.onLoad = function () { 
  // called by <body>'s onload event
 widgetAPI.sendReadyEvent(); // Send ready message to Application Manager
};