/**
 * Sample to use IME module for Samsung TV Widget
 */

//Variable to save an IME object
var ime = null,
    ime2 = null;

/**
 * On load function
 */

function func_onLoad() {
    alert("func_onLoad begin...");

    keyc = new Common.API.TVKeyValue();
    widgetAPI = new Common.API.Widget();
    widgetAPI.sendReadyEvent();
    alert("======================URL>"+decodeURI(window.location.search));
    var pluginAPI = new Common.API.Plugin();
    pluginAPI.registIMEKey();
    //pluginAPI.registAllKey();
    
    //var AppCommonPlugin;
    //AppCommonPlugin = document.getElementById('pluginObjectAppCommon_IME');
    //AppCommonPlugin.RegisterNaviKey();
    
    //this.str_temp = "Folder#1";
    //this.str_temp = "http://media.daum.net/digital/";
    //document.getElementById('searchText1').value = str_temp;
    document.getElementById('searchText1').setAttribute("maxlength", 5);
    //document.getElementById('searchText3').setAttribute("alt", "id");
    document.getElementById('searchText1').style.width = "150px";
    
    
    //Smart Hub Debug(5)] ======================URL>?country=CN&language=17&lang=en-GB&modelid=12_ECHOP&server=development&remocon=0_650_259_10&area=ASIA_ATV&product=0&mgrver=4.286&totalMemory=823132160
    //_g_ime.init("th","0_35_259_1","Asia_ATV","","th"); //태국어
    //_g_ime.init("id","0_35_259_1","Asia_ATV","","id"); //인도네시아
    //_g_ime.init("ta","0_35_259_1","Asia_ATV","","ta"); //타밀어
    //_g_ime.init("vi","0_35_259_1","Asia_ATV","","vi"); //베트남
    //_g_ime.init("ar","0_35_259_4","Asia_ATV","","iq"); //아랍어 - 이라크
    //_g_ime.init("fa","0_35_259_2","Asia_ATV","","IR"); //이란
    //_g_ime.init("ur","0_35_259_4","Asia_ATV","","ur"); //우르두어
    //_g_ime.init("he","0_35_259_3","Asia_ATV","","IS"); //히브리어
    //_g_ime.init("zh-CN","0_650_259_10","ASIA_ATV","","cn");
    //_g_ime.init("zh-HK","0_650_259_10","ASIA_ATV","","hk");
    //_g_ime.init("zh-TW","0_650_259_10","ASIA_ATV","","tw");
    //_g_ime.init("zh-CN","2_35_259_0","CHI","","cn"); //_g_ime.area_id: 2 _g_ime.area_code: CHI _g_ime.IMElang: en _g_ime.lang_set: 0
    //_g_ime.init("ru","0_35_259_13","PANEURO","","ru");
    //_g_ime.init("kk","0_35_259_13","PANEURO","","kz");
    //_g_ime.init("sk", "0_35_259_13", "PANEURO", "", "sk");
    //_g_ime.init("el","0_35_259_13","PANEURO","","el");    //그리스
    //_g_ime.init("de","0_35_259_13","PANEURO","","de");    //독일
    //_g_ime.init("fr","0_35_259_13","PANEURO","","fr");    //프랑스
    //_g_ime.init("nl","0_35_259_13","PANEURO","","nl");    //네델란드(Dutch)
    //_g_ime.init("uk","0_35_259_13","PANEURO","","uk");    //uk
    //_g_ime.init("pt","0_35_259_13","PANEURO","","pt");    //포르투갈
    //_g_ime.init("ko","1_35_259_11","KOR","","kr");
    _g_ime.init("en","2_35_259_12","USA","","us");    //2_35_259_0 USA    
    //_g_ime.init("ko","2_35_259_12","USA");   //언어가 한국어
    //_g_ime.init("en","4_35_259_12","USA");    //SDK
    //_g_ime.init("en-GB","0_650_259_0","ASIA_DTV","","au");//호주
    //_g_ime.init("tr","0_650_259_14","PANEURO","","tr"); //터키



    //_g_ime.init("ko", "3_1089_655_-1", "USA", "", "us"); //BD
    //_g_ime.init("en", "3_1089_655_-1", "USA", "", "us"); //BD
    //_g_ime.init("ko", "3_1089_655_-1", "KOR", "", "ko"); //BD
    //_g_ime.init();

    //_og_ime.init("en", "2_35_259_12", "USA", "", "us"); //2_35_259_0 USA
    //_og_ime.init("zh-CN", "0_650_259_10", "ASIA_ATV", "", "cn");
    //_og_ime.init("zh-HK","0_650_259_10","ASIA_ATV","","hk");
    //_og_ime.init("zh-TW","0_650_259_10","ASIA_ATV","","tw");
    //alert("_og_ime.dimm_use_YN :" + _og_ime.dimm_use_YN);
    //_g_ime.pluginMouse_use_YN = true;
    //_g_ime.dimm_use_YN = true;
    //_g_ime.Recog_use_YN = true;

    /*var ime = new IMEShell('searchText1', function (imeobj) {
        alert('[SceneInputPopup] IME created.');

        //ime.setKeypadChangeFunc('12key', onKeypadChange);
        imeobj.setKeypadChangeFunc('12key', move12KeyPosition);
        imeobj.setKeypadChangeFunc('qwerty', moveqwertyPosition);
        imeobj.setKeyFunc(keyc.KEY_UP, textobjKeyFunc);
        imeobj.setKeyFunc(keyc.KEY_DOWN, textobjKeyFunc);
        if (_g_ime.pluginMouse_use_YN) {
            imeobj._focus();
            document.getElementById('searchText1').focus();
        }
        else {
            document.getElementById('searchText1').focus();
        }

    }, this);*/

    ime = new IMEShell("searchText1", ime_init_text,this);
    if(!ime){
        alert("object for IMEShell create failed", 3);
    }
    
    ime2 = new IMEShell("searchText2", ime_init_passwd, this);
    if (!ime2) {
        alert("object for IMEShell create failed", 3);
    }
    
    ime3 = new IMEShell("searchText3", ime_init_id, this);
    if (!ime3) {
        alert("object for IMEShell create failed", 3);
    }
    
    /*ime.setKeypadPos(427,130);
    ime.setQWERTYPos(427,130);
    
    ime2.setKeypadPos(427,130);
    ime2.setQWERTYPos(427, 130);        //IME XT9, new function 
    
    ime2.setShowHideString("hide password");
    
    */
    /*
    document.getElementById('search').style.zIndex = ime.keypad_xyz[2];
    $("#searchText1").bind('click',
         function(event){
            TRACE_IME("Call ime_object  searchText1 clcik !!");
            if(ime.inputObj.id == 'searchText1' ){
                //ime._focus();
            }
            if(ime2.inputObj.id == 'searchText2' ){
                //ime2._blur();
                ime._focus();
            }
        }
    );
    $("#searchText2").bind('click',
         function(event){
            TRACE_IME("Call ime_object searchText2 clcik !!");
            if(ime.inputObj.id == 'searchText1' ){
                //ime._blur();
                ime2._focus();
            }
            if(ime2.inputObj.id == 'searchText2' ){
                //ime2._focus();
            }
        }
    );*/
}
function func_onUnload() {
    //unload event
    alert("onUnload ====================================================");
    if (ime) {
        ime._blur();
    }
    if (ime2) {
        ime2._blur();
    }
    if (ime3) {
        ime3._blur();
    }
}
/**
 * it takes time to load IME module.
 * Use callBack function to setup IME property.
 * @param imeObj IME object that created
 */
function ime_init_text(imeobj){
    
    //if you need input object, use "getInputObj" function
    var inputobj = imeobj.getInputObj();
    
    alert("start initializing 123 : "+inputobj.id);
    
    
    //option : set function that keypad/qwerty select on IME start, default is 'qwerty'
    //imeobj.setKeySetFunc('qwerty');
    //imeobj.setKeySetFunc('12key');
    
    //option : keypad x,y position, IME XT9 default right alignment 
    //imeobj.setKeypadPos(1355, 159); //1080p 
    //imeobj.setKeypadPos(860, 159); //1080p 
    //imeobj.setQWERTYPos(860, 159);
     
    //imeobj.setKeypadPos(896, 150); //720p
    //imeobj.setQWERTYPos(570, 150);

    imeobj.setKeypadPos(imeobj.ABkeypad_xyz[0], imeobj.ABkeypad_xyz[1]); //540p
    imeobj.setQWERTYPos(imeobj.ABqwerty_xyz[0], imeobj.ABqwerty_xyz[1]);     //IME XT9, new function 
    
    //imeobj.setWordBoxPos(150,15);     //IME XT9, this function do not use more
    
    //option : set function that runs after all key input (pass array as arguments)
    //when IME runs the function, first argument is Keycode, second argument will be the first element of the array
    imeobj.setAnyKeyFunc(testf2);

    // option : set function that call when left key pressed on cursor position is at the beginning of input box
//    imeobj.setPrevEventOnLeftFunc(testf1);

    // option : set function that called when letter is completed
    imeobj.setOnCompleteFunc(onC);

    // option : set function that called when enter key is pressed.
    imeobj.setEnterFunc(sampleEnter);
    
    // option : set function that called when Key key is pressed with qwerty.
    //imeobj.setQWERTYKeyFunc(qwertyKeyFunc);
    
    // option : set function that called when input reached maxlength
    imeobj.setMaxLengthFunc(sampleMaxLength);

    //option : To run a function when some key is pressed ex) red key , blue key
    //if fuctions is registered, keycode will be a parameter when the function is called.
    //if the function returns true, IME continues
    //if the function returns false, IME returns
    //imeobj.setKeyFunc(88, textobjKeyFunc);
    imeobj.setKeyFunc(keyc.KEY_UP, textobjKeyFunc);
    imeobj.setKeyFunc(keyc.KEY_DOWN, textobjKeyFunc);
    //imeobj.setKeyFunc(keyc.KEY_RED, textobjKeyFunc);
    //imeobj.setKeyFunc(keyc.KEY_LEFT, textobjKeyFunc);
    //imeobj.setKeyFunc(keyc.KEY_RIGHT, textobjKeyFunc);
    //imeobj.setOnFocusFunc(testf2);
    imeobj.setBlockSpace(true);
//    imeobj.setKeyFunc(keyc.KEY_5, testf1);


//    imeobj.setKeyFunc(keyc.KEY_YELLOW, function(){});
//    imeobj.setKeyFunc(keyc.KEY_RIGHT, function(){});
    
    // to unregister key Function assign null function to keycode
//    imeobj.setKeyFunc(5, function(){});
    
    //option : when keypad/qwerty changed event callback function,for input object x,y position change  
    imeobj.setKeypadChangeFunc('12key',move12KeyPosition);
    imeobj.setKeypadChangeFunc('qwerty',moveqwertyPosition);
    
    //option : when inputbox highlight event callback function,for input object focus
    imeobj.setInputHighlightFunc(inputHighlight);
    
    
    imeobj.setAuto(false); //set flag for user autocomplete use or not use 
    
    /*
    //for autocomplete functions
    //set string value use autocomplete , 0-not use(default), 1-ime AutoComplete function use
    imeobj.setAutoCompleteFunc('strFlag',0);
    //set data used xml type, or used JSON type, 'xml' or 'JSON', default 'JSON'
    imeobj.setAutoCompleteFunc('strXml','JSON');
    //set user event manger function
    //imeobj.setAutoCompleteFunc('callback_func_data',autoCompleteFunc);
    //set request data max rows
    imeobj.setAutoCompleteFunc('nMaxRows',8);
    //set request data max rows of one page
    imeobj.setAutoCompleteFunc('nPages',8);
    //set xml load data id. option
    imeobj.setAutoCompleteFunc('strXmlLoadID','item');
    //set autocomplete div right,top,zindex position with 12key
    imeobj.setAutoCompleteFunc('12keyPos',[384,200,10]);
    //set autocomplete div right,top,zindex position with qwerty
    imeobj.setAutoCompleteFunc('qwertyPos',[714,200,10]);
    */
    //document.getElementById("item").focus();
    //document.getElementById("item2").focus();
    //document.getElementById("searchText1").focus();
    
    //get IME version : return string is 'XT9', 'T9'
    alert("[IME] ============================================ imeobj.IsSupportXT9:"+imeobj.IsSupportXT9);
    
    //get IME mode : return string is '12key', 'qwerty' 
    var strKeySet = imeobj.getKeySet();
    alert("[IME] ============================================ strKeySet:"+strKeySet);
    
    //_g_ime.pluginRecog_use_YN = false;
    //_g_ime.Recog_use_YN = true;
    var str_temp;
    //str_temp = "http://media.daum.net/digital/";
    //str_temp = "http://www.topmosttube.com/kylee91728/120108-ea-b0-9c-ea-b7-b8-ec-bd-98-ec-84-9c-ed-8a-b8-ec-95-a0-ec-a0-95-eb-82-a8-video_2a778d676.html";
    //document.getElementById('searchText1').value = str_temp;
    //document.getElementById('item').focus();
    if(_g_ime.pluginMouse_use_YN){
        imeobj._focus();
        document.getElementById('searchText1').focus();
    }
    else{
        document.getElementById('searchText1').focus();    
    }
    //document.getElementById('searchText1').setSelectionRange(0,8);
    
    //imeobj.setString('http://bing.search.daum.net/search?w=tot&nil_profile=rtupkwd&rtupcate=issue&rtupcoll=NNS&q=%EC%A0%95%EB%B4%89%EC%A3%BC%20%EC%83%81%EA%B3%A0%EC%8B%AC&enc=utf8');
    
    //option : setMode =_latin_small,_latin_cap,_latin_big,_num,_special
    //var ret;
    //if(ret = imeobj.setMode("_num")){
    //if(ret = imeobj.setMode("_latin_small")){
    //    alert("ret : true "+ret);
    //}
    if(imeobj.bRTLLang == true){
        //document.getElementById('searchText1').style.direction = "rtl";    
    }


    alert("ime_init end...");
}

function ime_init_passwd(imeobj){
    
    var inputobj = imeobj.getInputObj();
    
    alert("start initializing : "+inputobj.id);

    //imeobj.setKeypadPos(430,110);
    //imeobj.setQWERTYPos(428, 80);        //IME XT9, new function 
    
    imeobj.setKeyFunc(keyc.KEY_UP, passwdobjKeyFunc);
    imeobj.setKeyFunc(keyc.KEY_DOWN, passwdobjKeyFunc);
    imeobj.setKeyFunc(keyc.KEY_RED, passwdobjKeyFunc);
    //document.getElementById("searchText2").focus();

    if (imeobj.setShowHideString && imeobj.setShowHideString2) {
        //imeobj.setShowHideString("show password");
        //imeobj.setShowHideString("hide password");
        //imeobj.setShowHideString2("show password", "hide password");
    }
    
    alert("ime_init_passwd end...")
}
function ime_init_id(imeobj){
    
    //if you need input object, use "getInputObj" function
    var inputobj = imeobj.getInputObj();
    
    alert("start initializing 123 : "+inputobj.id);
    
    
    //option : set function that keypad/qwerty select on IME start, default is 'qwerty'
    imeobj.setKeySetFunc('qwerty');
    //imeobj.setKeySetFunc('12key');
    
    //option : keypad x,y position, IME XT9 default right alignment  
    //imeobj.setKeypadPos(673, 80);
    //imeobj.setQWERTYPos(673, 80);
    //imeobj.setQWERTYPos(428, 80);        //IME XT9, new function 
    //imeobj.setWordBoxPos(150,15);     //IME XT9, this function do not use more
    
    //option : set function that runs after all key input (pass array as arguments)
    //when IME runs the function, first argument is Keycode, second argument will be the first element of the array
    imeobj.setAnyKeyFunc(testf2);

    // option : set function that call when left key pressed on cursor position is at the beginning of input box
//    imeobj.setPrevEventOnLeftFunc(testf1);

    // option : set function that called when letter is completed
    imeobj.setOnCompleteFunc(onC);

    // option : set function that called when enter key is pressed.
    imeobj.setEnterFunc(sampleEnter3);
    
    // option : set function that called when Key key is pressed with qwerty.
    //imeobj.setQWERTYKeyFunc(qwertyKeyFunc);
    
    // option : set function that called when input reached maxlength
//    imeobj.setMaxLengthFunc(sampleMaxLength);

    //option : To run a function when some key is pressed ex) red key , blue key
    //if fuctions is registered, keycode will be a parameter when the function is called.
    //if the function returns true, IME continues
    //if the function returns false, IME returns
    //imeobj.setKeyFunc(88, textobjKeyFunc);
    imeobj.setKeyFunc(keyc.KEY_UP, idobjKeyFunc);
    imeobj.setKeyFunc(keyc.KEY_DOWN, idobjKeyFunc);
    //imeobj.setKeyFunc(keyc.KEY_RED, textobjKeyFunc);
    //imeobj.setOnFocusFunc(testf2);
    //imeobj.setBlockSpace(true);
//    imeobj.setKeyFunc(keyc.KEY_5, testf1);


//    imeobj.setKeyFunc(keyc.KEY_YELLOW, function(){});
//    imeobj.setKeyFunc(keyc.KEY_RIGHT, function(){});
    
    // to unregister key Function assign null function to keycode
//    imeobj.setKeyFunc(5, function(){});
    
    //option : when keypad/qwerty changed event callback function,for input object x,y position change  
    imeobj.setKeypadChangeFunc('12key',move12KeyPosition);
    imeobj.setKeypadChangeFunc('qwerty',moveqwertyPosition);
    
    //option : when inputbox highlight event callback function,for input object focus
    imeobj.setInputHighlightFunc(inputHighlight);
    
    
    //imeobj.setAuto(false); //set flag for user autocomplete use or not use 
    
    /*
    //for autocomplete functions
    //set string value use autocomplete , 0-not use(default), 1-ime AutoComplete function use
    imeobj.setAutoCompleteFunc('strFlag',0);
    //set data used xml type, or used JSON type, 'xml' or 'JSON', default 'JSON'
    imeobj.setAutoCompleteFunc('strXml','JSON');
    //set user event manger function
    //imeobj.setAutoCompleteFunc('callback_func_data',autoCompleteFunc);
    //set request data max rows
    imeobj.setAutoCompleteFunc('nMaxRows',8);
    //set request data max rows of one page
    imeobj.setAutoCompleteFunc('nPages',8);
    //set xml load data id. option
    imeobj.setAutoCompleteFunc('strXmlLoadID','item');
    //set autocomplete div right,top,zindex position with 12key
    imeobj.setAutoCompleteFunc('12keyPos',[384,200,10]);
    //set autocomplete div right,top,zindex position with qwerty
    imeobj.setAutoCompleteFunc('qwertyPos',[714,200,10]);
    */
    //document.getElementById("item").focus();
    //document.getElementById("item2").focus();
    //document.getElementById("searchText1").focus();
    
    //get IME version : return string is 'XT9', 'T9'
    alert("[IME] ============================================ imeobj.IsSupportXT9:"+imeobj.IsSupportXT9);
    
    //get IME mode : return string is '12key', 'qwerty' 
    var strKeySet = imeobj.getKeySet();
    alert("[IME] ============================================ strKeySet:"+strKeySet);
    
    //_g_ime.pluginRecog_use_YN = false;
    //_g_ime.Recog_use_YN = true;

    var ret;
    if (imeobj.setMode) {
        if (ret = imeobj.setMode(null)) {
            //if(ret = imeobj.setMode("_latin_small")){
            alert("ret : true " + ret);
        }
    }
    
    
    alert("ime_init end...")
}
//1st dummy function for testing
function testf1() {
    alert("-----------------------------------------");
    alert("---- testf1  testf1  testf1  testf1 -----");
    alert("-----------------------------------------");
    return true;
}

//2nd dummy function for testing
function testf2(a) {
    alert("------------- test2 ----------------");
    alert("-------- args1: "+ a +" ---------");
    alert("-------- args1: "+ a.id +" ---------");
    alert("-------- args1: "+ a.value +" ---------");
    alert("------------------------------------");
}
function move12KeyPosition(arg){
    //define 12key/qwerty keypad basic position : right alignment
    //960 :  IME: 676.82   /  QWERTY : 426.82
    //1280 : IME: 896.106  /  QWERTY : 566.106
    alert("12key position change:"+arg);
    if (arg == '12key') {
        
        if (curWidget.height == '1080') {
            document.getElementById("search").style.right = 384; //1280-896
            document.getElementById("search").style.top = 250;
        }
        else if (curWidget.height == '720') {
            document.getElementById("search").style.right = 384; //1280-896
            document.getElementById("search").style.top = 106;
        }
        else {
            document.getElementById("search").style.right = 534; //960-676
            document.getElementById("search").style.top =  82;
        }
    }
    else 
        if (arg == 'qwerty') {
        
            if (curWidget.height == '1080') {
                document.getElementById("search").style.right = 714; //1280-566
                document.getElementById("search").style.top =  250;
            }
            else if (curWidget.height == '720') {
                document.getElementById("search").style.right = 714; //1280-566
                document.getElementById("search").style.top =  106;
            }
            else {
                document.getElementById("search").style.right = 534; //960-426
                document.getElementById("search").style.top =  82;
            }
            
        }
}
function moveqwertyPosition(arg){
    alert("qwerty position change:"+arg);
    
    if (curWidget.height == '1080') {
        document.getElementById("search").style.right = 714;    //1280-566
        document.getElementById("search").style.top =  250;
    }
    else if (curWidget.height == '720') {
        document.getElementById("search").style.right = 714;    //1280-566
        document.getElementById("search").style.top =  106;
    }
    else{
        document.getElementById("search").style.right = 534;    //960-426
        document.getElementById("search").style.top = 82;    
    }
    
}
function itemFocus(obj) {
    obj.style.color = "#ff0000";
}

function onC(arg){
    alert("setOnCompleteFunc ===================: "+arg);
    $_('resultBox').innerHTML = arg;
}

function itemBlur(obj) {
    obj.style.color = "#000000";
}

// Function for enter (argument : enterd string)
function sampleEnter(str) {
    alert("Enter key pressed : "+str);
    document.getElementById('searchText1').blur();
    if (_g_ime.pluginMouse_use_YN) {
        ime._blur();
    }
    document.getElementById('item').focus();
}
function sampleEnter2(str) {
    alert("Enter key pressed : " + str);
    document.getElementById('searchText2').blur();
    if (_g_ime.pluginMouse_use_YN) {
        ime2._blur();
    }
    document.getElementById('item').focus();
}
function sampleEnter3(str) {
    alert("Enter key pressed : " + str);
    document.getElementById('searchText3').blur();
    if (_g_ime.pluginMouse_use_YN) {
        ime3._blur();
    }
    document.getElementById('item').focus();
}

// Function for maxlength
function sampleMaxLength() {
    alert("\n=============\n input length is MAX \n===================");
    if (_g_ime.pluginMouse_use_YN) {
        ime._blur();
    }

    document.getElementById('searchText1').blur();
    document.getElementById('item').focus();
}
/*function qwertyKeyFunc(keyChar){
    alert("[IME] =========================== keyChar");
}*/
function textobjKeyFunc(keyCode){
    switch(keyCode) {
        case(29460) : // Up Key
            alert("[IME] =========================== Up Key!");
            if (_g_ime.pluginMouse_use_YN) {
                ime._blur();
            }
            else{
                
            }
            document.getElementById('item').focus();
        break;
        
        case (29461) : // Down Key
            var objPass = document.getElementById('searchText2');
            if (objPass) {
                alert("[IME] searchText2 type change");
                if (objPass.type == "password") {
                    //ime2.setShowHideString("show password");
                }
                else{
                    //ime2.setShowHideString("hide password");dkfjd
                }
            }
            _g_ime.Recog_use_YN = false;
            if(_g_ime.pluginMouse_use_YN){
                ime._blur();
                ime2._focus();
            }
            else{
            }
            document.getElementById('searchText2').focus();
            
        break;

        case (88) : // return Key
            alert("=========================== here is it!");
            return false;
        break;

        case (keyc.KEY_RED) : // RED Key
            //location.reload();
            break;

        /*case (keyc.KEY_LEFT): // LEFT Key
            alert("=========================== LEFT KEY CLLBACK");
            break;
        case (keyc.KEY_RIGHT): // RIGHT Key
            alert("=========================== RIGHT KEY CLLBACK");
            break;*/

    }
    return false;
}

function passwdobjKeyFunc(keyCode){
    alert("passwdobjKeyFunc is called keyCode : "+keyCode);
    switch(keyCode) {
        case(29460) : // Up Key
        _g_ime.Recog_use_YN = true;
            if (_g_ime.pluginMouse_use_YN) {
                
                ime2._blur();
                ime._focus();
            }
            else{
                    
            }
            document.getElementById('searchText2').blur();
            document.getElementById('searchText1').focus();            
        break;
        
        case (29461) : // Down Key
            if (_g_ime.pluginMouse_use_YN) {
                ime2._blur();
                ime3._focus();
            }
            else{
            }    
            document.getElementById('searchText2').blur();
            document.getElementById('searchText3').focus();
        break;
        
        case (keyc.KEY_RED) : // RED Key
            //document.getElementById('searchText1').alt = "engonly";
            //ime2 = new IMEShell("searchText2", ime_init_passwd/*, "en", "3_35_259"*/);
            
            //location.reload();
            //ime2.setString('bus');
            var objPass = document.getElementById('searchText2');
            if(objPass){
                alert("[IME] searchText2 type change");
                if(objPass.type == "password"){
                    alert("[IME] searchText2 type change engonly");
                    objPass.type = "text";
                    objPass.alt = "engonly";
                    //objPass.blur();
                    ime2 = new IMEShell("searchText2", ime_init_passwd,this);
                    if(!ime2){
                        alert("object for IMEShell create failed", 3);
                    }
                    ime2.setString(objPass.value);
                    //ime2.setShowHideString("hide password");
                    
                    objPass.focus();
                    if (_g_ime.pluginMouse_use_YN) {
                        ime2._focus();
                    }
                    alert("[IME] searchText2 re focus");
                    
                    //ime2.reloadIMEShell("text","engonly","hide password");
                    //ime2._refreshKeypad();
                    return;
                }
                else if(objPass.type == "text" && objPass.alt == "engonly"){
                    alert("[IME] searchText2 type change password");
                    objPass.type = "password";
                    objPass.alt = "";
                    //objPass.blur();
                    ime2 = new IMEShell("searchText2", ime_init_passwd,this);
                    if(!ime2){
                        alert("object for IMEShell create failed", 3);
                    }
                    ime2.setString(objPass.value);
                    //ime2.setShowHideString("show password");
                    
                    objPass.focus();
                    if (_g_ime.pluginMouse_use_YN) {
                        ime2._focus();
                    }
                    alert("[IME] searchText2 re focus");
                    
                    //ime2.reloadIMEShell("password","","show password");
                    //ime2._refreshKeypad();
                    return;
                }
            }
            
        break;

    }
}
function idobjKeyFunc(keyCode){
    switch(keyCode) {
        case(29460) : // Up Key
            alert("[IME] =========================== Up Key!");
            if (_g_ime.pluginMouse_use_YN) {
                
                ime3._blur();
                ime2._focus();
            }
            else{
                    
            }
            document.getElementById('searchText3').blur();
            document.getElementById('searchText2').focus();        
            
        break;
        
        case (29461) : // Down Key
            alert("[IME] =========================== Up Key!");
            if (_g_ime.pluginMouse_use_YN) {
                
                ime3._blur();
            }
            else{
                    
            }
            document.getElementById('searchText3').blur();
            document.getElementById('item2').focus();        
            
        break;

        case (88) : // return Key
            alert("=========================== here is it!");
            return false;
        break;

        case (keyc.KEY_RED) : // RED Key
            //location.reload();
        break;
        
    }
    return false;
}
//function for test object focus managing
function normalobjKeyFunc(obj) {
    var EKC = event.keyCode;
    
    switch(EKC) {
        case(29460) : // Up Key
            if(obj.id == 'item2') {
                if (_g_ime.pluginMouse_use_YN) {
                    ime3._focus();
                }
                else{
                    
                }    
                document.getElementById('searchText3').focus();
            }
            break;
        
        case (29461) : // Down Key
            if(obj.id == 'item') {
                if (_g_ime.pluginMouse_use_YN) {
                    ime._focus();
                }
                else{
                    
                }
                document.getElementById('searchText1').focus();
            }
            break;

        case (29443) : // Enter Key
            if(obj.id == 'item') {
                location.reload();
            }
            else if(obj.id == 'item2') {
                ime.setString('test@ABC_def ds');
            }
            break;
        case (keyc.KEY_RED): // RED Key
            //location.reload();
            var strParam = decodeURI(window.location.search);
            alert("strParam:" + strParam);
            var nIndex = strParam.indexOf("?");
            if (nIndex == -1) {
                nindex = 0;
            }
            alert("nIndex:" + nIndex);
            strParam = strParam.substr(nIndex + 1);
            alert("strParam:" + strParam); //?country=KR&language=0&lang=ko&modelid=12_ECHOP&server=development&remocon=1_35_259_11&area=KOR&product=0&mgrver=4.426&totalMemory=802160640&webbrowser=true
            var strUrl = "http://www.daum.net?" + strParam;
            var strName = "new win1";
            var nwin = window.open(strUrl, strName, "width=1000,height=1080,left=0,top=0,resizable=yes,menubar=yes,toolbar=yes,scrollbars=yes,location=yes");
            //window.open("http://www.dreamwiz.com", "dreamwiz", "width=500,height=300,left=0,top=0,resizable=no"); 
            //nwin.close();
            break;
    }
}
function inputHighlight(keySet,focusObj){
    alert("[IME] inputHighlight callback ====================================");
    alert("[IME] inputHighlight keySet :"+keySet);
    alert("[IME] inputHighlight focusObj :"+focusObj);
    
    if(keySet == "qwerty"){
        if(focusObj == "inputobj"){
            document.getElementById("searchText1").style.borderWidth = "3px";    
            document.getElementById("searchText1").style.borderColor = "blue";
        }
        else {
            document.getElementById("searchText1").style.borderWidth = "0px";
            document.getElementById("searchText1").style.borderColor = "black";
        }
        
    }
    else{
        document.getElementById("searchText1").style.borderWidth = "3px";    
        document.getElementById("searchText1").style.borderColor = "blue";
    }
}
/**************************************************************************************
 * ajax autocomplete configuration
 * function setAutoCompleteFunc()
 * setting values : 
 *  strFlag : set string value use autocomplete , 0-not use(default), 1-ime AutoComplete function use
 *  callback_func_complete : set user event manger function
 *  nMaxRows : set request data max rows
 *  strXmlLoadID : set xml load data id
 *  bXml : set data used xml type, or used JSON type
 * html :
 *  <div id="ime_autocomplete"></div> 
 * css :
 *  #ime_autocomplete{
    position:absolute;
    padding:5px;
    left: 40px;
    top: 250px;
    width: 500px;
    height: 250px;
    background:#E1E1E1;
    } 
 ***************************************************************************************/ 
function autoCompleteFunc(keyCode){
    alert("autoCompleteFunc ============================== keyCode:"+keyCode);
    switch(keyCode) {
        case(keyc.KEY_UP) : // Up Key
        case (keyc.KEY_DOWN) : // Down Key
        case (keyc.KEY_LEFT) : // left Key
        case (keyc.KEY_RIGHT) : // right Key
        case (keyc.KEY_GREEN) : // green Key
        case (keyc.KEY_BLUE) : // blue Key
            return;
            break;
        
    }
    var strType = "GET";
    var nTimeout = 60000;
    var strURL = "http://sug.search.daum.net/search_nsuggest?mod=fxjson&core=utf_in_out&q=";
    loadAjax(strType,nTimeout);//_g_ime.loadAjax(strType,nTimeout,callback_func_before,callback_func_complete);
    //requestAjax(strURL);
}
function loadAjax(strType,nTimeout,callback_func_before,callback_func_complete){
    alert("[IME] loadAjax ================================================");
    $.ajaxSetup({
        type: 'GET',    //strType
        timeout: 60000,    //nTimeout
          beforeSend:function(req) {
               alert("========= beforeSend ===========");
            //if(callback_func_before){
            //    callback_func_before;
            //}
           },
  
          complete:function(req) {
               alert("========= complete ===========");
            //if(callback_func_complete){
            //    callback_func_complete;
            //}
           },
        error: function(xhrobj){
            alert("XHR error with code: "+xhrobj.status);
            if(xhrobj.status == 200) {
                return true;
            }
            else {
                alert("XHR FAILED");
                //Error
            }
        }
      })
}
function requestAjax(strURL){
    alert("[IME] requestAjax ================================================");
    alert("[IME] requestAjax strURL:"+strURL);
    if(!strURL || strURL.length == 0 || strURL == ""){
        alert("[IME] requestAjax strURL is null");
        return;
    }
    /*
    var obj = document.getElementById('searchText1'); //$("#searchText1");
    //검색어 강제 입력
    if (obj) {
        var keyword = obj.value;
        alert("[IME] requestAjax keyword:"+keyword);
        strURL = strURL + keyword;
    }
    alert("[IME] requestAjax strURL :"+strURL);        
    var strXml = imeobj.getXml();    //get data type : return string is 'xml', 'JSON' 
    if(strXml == 'xml'){
        ajaxObj = $.ajax({
                url: strURL,
                success:function(xhrobj){
                            alert("function call start !! ");
                            imeobj.setAutoCompleteFunc('onLoadStrings',xhrobj);
                        }
            });    
    }
    else{
        //var str = "";
        var strValue = [];
        ajaxObj = $.getJSON(
                strURL,
                {str:strValue},//pattern
                function(data){    //data handler
                    alert("[IME] $.getJSON:"+data);
                    imeobj.setAutoCompleteFunc('onLoadJSON',data);
                }
                
        );
    }*/        
}