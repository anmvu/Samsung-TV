var PreviewHASTutorial =
{
}

PreviewHASTutorial.init = function (widgetID, callback, extra)
{
    var previewHTML = this.getPreviewHTML();
    
    callback(widgetID, previewHTML);
}

PreviewHASTutorial.getPreviewHTML = function ()
{
    var previewHTML = "";
    
    previewHTML += "<div style='position: absolute; left: 10px; top: 34px; width: 310px; height: 128px>";
    previewHTML += "    <p style='text-align:center>Video Widget Tutorial Preview</p>";
    previewHTML += "</div>";
    
    return previewHTML;
}