alert('SceneMain.js loaded');

function SceneMain() {
	this.titleIdx = 0;       // title index
 	this.articleIdx = 0;     // article index
	this.arrTitles = new Array();	// Array of Title Divs
  	this.arrList = new Array();      // Array of Title List Divs
   	this.title_max_num = 7;
   	this.arrArticles = [];
   	this.titlebar = null;
  
   	// category
   	this.categoryNum = 3;
   	this.arrCategryList = new Array();	// Array of Categry List Divs
   	this.arrCategryTitle = new Array();	// Array of Categry Title Divs
   	this.categoryIdx = 0;    // category index (url)
   	this.categoryFlag = new Boolean(true);
   
   	// date
   	this.nowDate = new Date();
   	this.day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   	this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   
   	// page
   	this.totalPage = 0;
   	this.currentPage = 0;
}

SceneMain.prototype.initialize = function () { 
	alert("SceneMain.initialize()");
	// this function will be called only once when the scene manager show this scene first time
	// initialize the scene controls and styles, and initialize your variables here 
	// scene HTML and CSS will be loaded before this function is called

    // initialize Title Bar
    this.titlebar = document.getElementById("MainTitleBar");
    this.titlebar.innerHTML = "News Service";
    
    // initialize Categry  	
   	for(var i=0; i < this.categoryNum; i++) {
   		this.arrCategryList[i] = document.getElementById("MainCategoryList"+i);
   		this.arrCategryTitle[i] = document.getElementById("MainCategoryTitle"+i);
   		this.arrCategryTitle[i].innerHTML = Controller.categoryData[i].name;
   	}
    this.focusCategory(this.categoryIdx);

    // initialize Date
    var mainDate = document.getElementById("MainDate");

    var date = this.day[this.nowDate.getDay()];
    date += ",  ";
    date += this.month[this.nowDate.getMonth()];
    date += "  ";
    date += this.nowDate.getDate();
    date += ",  ";
    date += this.nowDate.getFullYear();
    mainDate.innerHTML = date;
    
    // Mouse
    var _THIS_ = this;
    
    document.getElementById('MainCategoryList0').onclick = function(){  
		_THIS_.clickCategory(0);   
	}
	document.getElementById('MainCategoryList1').onclick = function(){
		_THIS_.clickCategory(1);     
	}
	document.getElementById('MainCategoryList2').onclick = function(){ 
		_THIS_.clickCategory(2);    
	}
		
	document.getElementById('MainList0').onclick = function(){
		_THIS_.clickList(0);   
	}
	document.getElementById('MainList1').onclick = function(){
		_THIS_.clickList(1);  
	}
	document.getElementById('MainList2').onclick = function(){
		_THIS_.clickList(2);
	}
	document.getElementById('MainList3').onclick = function(){
		_THIS_.clickList(3);
	}
	document.getElementById('MainList4').onclick = function(){
		_THIS_.clickList(4);  
	}
	document.getElementById('MainList5').onclick = function(){
		_THIS_.clickList(5); 
	}
	document.getElementById('MainList6').onclick = function(){
		_THIS_.clickList(6);  
	}
	
	document.getElementById('MainListTitles').onmousewheel = function() {
		if(_THIS_.categoryFlag == true) {	// 카테고리였을 때
			_THIS_.selectCategory(this.categoryIdx);  
			_THIS_.categoryFlag = false;
		}
    	if(event.wheelDelta >= 120) { // wheel UP
    		_THIS_.handleKeyDown(sf.key.REW);
    	}
    	else if(event.wheelDelta <= -120){ // wheel DOWN
    		_THIS_.handleKeyDown(sf.key.FF);
    	}
    }
 
    // initialize KeyHelp
    $('#Mainkeyhelp').sfKeyHelp({
		'iconset' : 'WHITE',
        'leftright' : 'Category/List',
        'rew' : ' Previous page',
        'ff' : 'Next page',
		'return': 'End'
	});
	
	$('#Mainkeyhelp').css({
		'height' : 34+'px'
	});
	
	// show Notice
	$('#Mainkeyhelp').sfKeyHelp('showNotice', {icons:['mouse'], text: 'Available', timeout: 10000});
}

SceneMain.prototype.initMainpage = function (Array) { 
    this.arrArticles = Array;

    // total page
    this.totalPage = parseInt(((this.arrArticles.length - 1) / this.title_max_num) + 1); 
	
	// initialize article List
	for (var i=0; i < this.title_max_num; i++) {
        this.arrTitles[i] = document.getElementById("MainListTitle"+i);
        this.arrList[i] = document.getElementById("MainList"+i);
    }
    
    this.showMainpage(this.articleIdx);
}

SceneMain.prototype.clickList = function (index) {
	if(this.categoryFlag == true) {	// 카테고리였을 때
		this.selectCategory(this.categoryIdx);  
		this.categoryFlag = false;
	}
	else{	// 리스트였을 때
		this.blurTitle(this.titleIdx);
	}
	 
	var currentArticleIdx = this.currentPage * 7 + index;
	alert("currentArticleIdx == " + currentArticleIdx);
	
	if(this.arrArticles[currentArticleIdx]) {
		this.articleIdx = currentArticleIdx;
		this.titleIdx = index;
    	this.highlightTitle(this.titleIdx);
    	
    	this.handleKeyDown(sf.key.ENTER);
    }
    this.highlightTitle(this.titleIdx);
}

SceneMain.prototype.clickCategory = function (index) {
	if(this.categoryFlag == false) {	// 리스트에 포커스였을 때
		this.blurTitle(this.titleIdx);
		this.categoryFlag = true;
	}
	this.blurCategory(this.categoryIdx);
	this.categoryIdx = index;
	this.focusCategory(this.categoryIdx);
	this.refreshCategory();		
}

SceneMain.prototype.handleShow = function (data) {
	alert("SceneMain.handleShow()");
	// this function will be called when the scene manager show this scene 
    
    if(data) {
        this.blurTitle(this.titleIdx);
        this.articleIdx = data.Index;
        this.titleIdx = this.articleIdx%this.title_max_num;
        this.showTitleList(this.articleIdx - this.titleIdx);
        this.highlightTitle(this.titleIdx);
        this.adjustScrollBar();
    }
}

SceneMain.prototype.showMainpage = function (articleIndex) {
    // title
    this.showTitleList(articleIndex);
}

SceneMain.prototype.showTitleList = function (index) {  // this index is starting index of articles shows first. 
    alert("SceneMain.showTitleList()");

    // page Number
    var showPage = document.getElementById("MainPageNumber");

    this.currentPage = parseInt(this.articleIdx / this.title_max_num);
    var page = this.currentPage + 1;
    page += "/";
    page += this.totalPage;
    showPage.innerHTML = page;
    
    // scroll
    this.adjustScrollBar();
	
	// article List
    var article = null;
    for(var a = 0; a < this.title_max_num; a++) {
        article = this.arrArticles[index + a];
        if(article) {
            this.arrTitles[a].innerHTML = this.wrapInTable(article.title, "", "MainListTitle_style");
        	this.arrList[a].style.cursor = "pointer";
        }
        else {
            this.arrTitles[a].innerHTML = "";
            this.arrList[a].style.cursor = "default";
        }
    }
}

SceneMain.prototype.wrapInTable = function (pStrContents, pStyle, pClass) {  // insert the contents in table
	var retValue = "";
	var strStyle = "";
	var strClass = "";
	if (pStyle) {
		strStyle = " style='" + pStyle + "' ";
	}
	if (pClass) {
		strClass = " class='" + pClass + "' ";
	}
	retValue += "<table cellpadding='0px' cellspacing='0px'>";
	retValue += "<tr>";
	retValue += "<td" + strStyle + strClass + ">";
	retValue += "<nobr>";
	retValue += pStrContents;
	retValue += "</nobr>";
	retValue += "</td>";
	retValue += "</tr>";
	retValue += "</table>";
	
	alert("SceneMain.wrapInTable() returns [" + retValue + "]");
	return retValue;
}

SceneMain.prototype.highlightTitle = function (index) {
	alert("SceneMain.prototype.highlightTitle()");
    this.arrList[index].style.backgroundImage = "url(images/newsImg/left_category_highlight.png)"; 
    this.arrTitles[index].style.color = "#000000";
}

SceneMain.prototype.blurTitle = function (index) {
	alert("SceneMain.prototype.blurTitle()");
    this.arrList[index].style.backgroundImage = "url(none)";
    this.arrTitles[index].style.color = "#eeeeee";
}

SceneMain.prototype.adjustScrollBar = function () {
    alert("SceneMain.adjustScrollBar()");
    
    if(this.totalPage <= 1) {
    	this.hideScrollBar();
    }
    else {
    	this.showScrollBar();
    }
}

SceneMain.prototype.showScrollBar = function () {
    alert("SceneMain.showScrollBar()");
    $('#MainScroll').sfScroll({
        pages: this.totalPage
    });
    $('#MainScroll').sfScroll('move', this.currentPage);
    $('#MainScroll').sfScroll('show');
}

SceneMain.prototype.hideScrollBar = function () {
    alert("SceneMain.hideScrollBar()");
    $('#MainScroll').sfScroll('hide');
}


SceneMain.prototype.handleHide = function () {
	alert("SceneMain.handleHide()");
	// this function will be called when the scene manager hide this scene  
}

SceneMain.prototype.handleFocus = function () {
	alert("SceneMain.handleFocus()");
	// this function will be called when the scene manager focus this scene
}

SceneMain.prototype.handleBlur = function () {
	alert("SceneMain.handleBlur()");
	// this function will be called when the scene manager move focus to another scene from this scene
}

SceneMain.prototype.upArticle = function () {
    this.blurTitle(this.titleIdx);
    this.articleIdx--;
    this.titleIdx--;
    
    if(this.titleIdx < 0) {
        this.titleIdx = this.title_max_num - 1; 
        
        if(this.articleIdx < 0) {
            this.articleIdx = this.arrArticles.length - 1;  // move to last article
            this.titleIdx = this.articleIdx % this.title_max_num;  
        }
        this.showTitleList(this.articleIdx - this.titleIdx);           
    }
    this.highlightTitle(this.titleIdx);
}

SceneMain.prototype.downArticle = function () {
    this.blurTitle(this.titleIdx);
    this.articleIdx++;
    this.titleIdx++;
    if(this.articleIdx % this.title_max_num == 0 || this.articleIdx > this.arrArticles.length - 1) {  
        this.titleIdx = 0;
        
        if(this.articleIdx > this.arrArticles.length - 1) { // if last index is focused, move to first index.
            this.articleIdx = 0;
        }
        this.showTitleList(this.articleIdx);
    }            
    this.highlightTitle(this.titleIdx);
}

SceneMain.prototype.refreshCategory = function () {
    this.titleIdx = 0; 
    this.articleIdx = 0;      
    delete this.arrArticles;           
    Controller.start(Controller.categoryData[this.categoryIdx]);
}

SceneMain.prototype.focusCategory = function (index) {
    this.arrCategryList[this.categoryIdx].style.backgroundImage = "url(images/newsImg/category_highlight.png)";
    this.arrCategryTitle[this.categoryIdx].style.color = "#000000";
}

SceneMain.prototype.selectCategory = function (index) {
	this.arrCategryList[this.categoryIdx].style.backgroundImage = "url(images/newsImg/category_selected.png)";
	this.arrCategryTitle[this.categoryIdx].style.color = "#86d7f2";
}

SceneMain.prototype.blurCategory = function (index) {
	this.arrCategryList[this.categoryIdx].style.backgroundImage = "url(none)";
	this.arrCategryTitle[this.categoryIdx].style.color = "#eeeeee";
}

SceneMain.prototype.previousPage = function () {
	alert("previousPage()");
	
	this.blurTitle(this.titleIdx);
  	this.currentPage--;
  	if(this.currentPage < 0) {
    	this.currentPage = this.totalPage - 1;
    }
    this.titleIdx = 0;
    this.articleIdx = this.currentPage * 7 + 0;
    
    // refresh List
    this.showTitleList(this.articleIdx);
    $('#MainScroll').sfScroll('move', this.currentPage);
    
    this.highlightTitle(this.titleIdx);
  	
  	
}

SceneMain.prototype.nextPage = function () {
	alert("nextPage()");
	
	this.blurTitle(this.titleIdx);
    this.currentPage++;
    if(this.currentPage >= this.totalPage) {
    	this.currentPage = 0;
    }
    this.titleIdx = 0;
    this.articleIdx = this.currentPage * 7 + 0;
    
    // refresh List
    this.showTitleList(this.articleIdx);
    $('#MainScroll').sfScroll('move', this.currentPage);
    
    this.highlightTitle(this.titleIdx);
    
}

SceneMain.prototype.handleKeyDown = function (keyCode) {
	alert("SceneMain.handleKeyDown(" + keyCode + ")");
	// TODO : write an key event handler when this scene get focued
	switch (keyCode) {
		case sf.key.LEFT:
            if(this.categoryFlag == false) {
                this.categoryFlag = true;
                this.focusCategory(this.categoryIdx);
                this.blurTitle(this.titleIdx);
            }
			break;
		case sf.key.RIGHT:
            if(this.categoryFlag == true) {
                this.categoryFlag = false;
                this.selectCategory(this.categoryIdx);
                this.highlightTitle(this.titleIdx);
            }
            else {
            	// change to the Contents scene
                sf.scene.hide('Main');
                Controller.showContents(this.articleIdx);
            }
            break;
		case sf.key.UP:		
            if(this.categoryFlag == false) {
                this.upArticle();
            }
            else {   // If the focus move to category.   
            	this.blurCategory(this.categoryIdx);               
                this.categoryIdx--;
                if(this.categoryIdx < 0) {
                    this.categoryIdx = 2;
                }  
                this.focusCategory(this.categoryIdx);
                this.refreshCategory();       
            }
            break;
		case sf.key.DOWN:
            if(this.categoryFlag == false) {
                this.downArticle();
            }
            else {   // If the focus move to category. 
            	this.blurCategory(this.categoryIdx);                   
                this.categoryIdx++;
                if(this.categoryIdx > 2) {
                    this.categoryIdx = 0;
                } 
                this.focusCategory(this.categoryIdx);
                this.refreshCategory();    
            }
			break;
		case sf.key.REW:
			alert(" << Key down REW <<");
			this.previousPage();
			break;
		case sf.key.FF:
			alert(" >> Key down FF >>");
			this.nextPage();
			break;	
		case sf.key.ENTER:
            if(this.categoryFlag == false) {	// TitleList
                // change to the Contents scene
                sf.scene.hide('Main');
                Controller.showContents(this.articleIdx);
            }
            else {	// Category
            	this.categoryFlag = false;
                this.selectCategory(this.categoryIdx);              
                this.highlightTitle(this.titleIdx);
            }
			break;
		case sf.key.RETURN:
			/*if(this.categoryFlag == false) {
                this.categoryFlag = true;
                this.focusCategory(this.categoryIdx);
                this.blurTitle(this.titleIdx);
                sf.key.preventDefault();    // Block default action of the RETURN key. Without this line, this application exits to Smart Hub.
            }*/
            sf.core.exit(false);
			break;
	}
}
