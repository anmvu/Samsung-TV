function SceneScene1(options) {
	this.options = options;
}

SceneScene1.prototype.initialize = function () {
	alert("SceneScene1.initialize()");
	// this function will be called only once when the scene manager show this scene first time
	// initialize the scene controls and styles, and initialize your variables here 
	// scene HTML and CSS will be loaded before this function is called
	
	var data = ['First', 'Second', 'Third', 'Forth', 'Fifth'
	];
	
	$('#svecListbox_QKNM').sfList({data:data, index:'0', itemsPerPage:'5'});
	$('#svecVertical_scrollbar_BEI0').sfScroll({page:'5'});
	
    $('#svecKeyHelp_IIZH').sfKeyHelp({
		'user': 'SamSung SDK',  'red': 'Stop',  
        'green':'Start', 'enter': 'Enter','updown' :'UpDown',
        'return': 'Back'

	});
    
}

SceneScene1.prototype.handleShow = function () {
	alert("SceneScene1.handleShow()");
    $('#svecVertical_scrollbar_BEI0').sfScroll('focus');
	// this function will be called when the scene manager show this scene 
}

SceneScene1.prototype.handleHide = function () {
	alert("SceneScene1.handleHide()");
	// this function will be called when the scene manager hide this scene  
}

SceneScene1.prototype.handleFocus = function () {
	alert("SceneScene1.handleFocus()");
	// this function will be called when the scene manager focus this scene
}

SceneScene1.prototype.handleBlur = function () {
	alert("SceneScene1.handleBlur()");
	// this function will be called when the scene manager move focus to another scene from this scene
}

SceneScene1.prototype.handleKeyDown = function (keyCode) {
	alert("SceneScene1.handleKeyDown(" + keyCode + ")");
	// TODO : write an key event handler when this scene get focued
	switch (keyCode) {
		case $.sfKey.LEFT:
			break;
		case $.sfKey.RIGHT:
			break;
		case $.sfKey.UP:
            $('#svecVertical_scrollbar_BEI0').sfScroll('prev');
            var idx = $('#svecListbox_QKNM').sfList('getIndex');
            alert( "idx = " + idx);
            if(idx == 0)
                break;
            $('#svecListbox_QKNM').sfList('prev');
			break;
		case $.sfKey.DOWN:
            $('#svecVertical_scrollbar_BEI0').sfScroll('next');
            var idx = $('#svecListbox_QKNM').sfList('getIndex');
            alert( "idx = " + idx);
            if(idx == 4)
                break;
            $('#svecListbox_QKNM').sfList('next');
			break;

		case $.sfKey.ENTER:
			break;
	}
}
