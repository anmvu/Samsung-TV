alert("init.js loaded.");

function onStart() {
	// TODO : Add your Initilize code here
    
    // include file
    var arrPathToIncluded = new Array();
    arrPathToIncluded.push('app/Controller.js');
    
    sf.core.loadJS(arrPathToIncluded, function(){ 
        Controller.initialize([{
                name:"Corporate",
                url:"XML/category1.xml"
            },{
                name:"Exhibition",
                url:"XML/category2.xml"
            },{
                name:"Product",
                url:"XML/category3.xml"
            }]);
        Controller.start(Controller.categoryData[0]);
    });
}

function onDestroy () {
	// stop your XHR or Ajax operation and put codes to distroy your application here
}


