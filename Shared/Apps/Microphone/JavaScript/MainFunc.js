var MainUI = (function() {

	var VoiceArr = {
		"FunnyVoice" : [ 1.0, 6.0, 30.0 ],
		"ManVoice" : [ 1.0, -6.5, 1.0 ],
		"WomanVoice" : [ -13.0, 8.0, 1.0 ]
	};

	var configArr = [
	                 {name: "Tempo", min: -50, max: 150, step: 1},
	                 {name: "Pitch", min: -20, max: 25, step: 1},
	                 {name: "Rate", min: -50, max: 150, step: 1}
	];
	
	var microphoneSetting = {
		//original: {reverb: "select", Tempo: 0, Pitch: 0, Rate:0}
	};
	
	var focusConfig = 100001;
	
	var focusMic = 719999;

	var microphoneArr = [];
	
	var microphoneBtnEl = '<button id="microphone#{ID}" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary my-select-btn-microphone">'
							/*+ '<span class="ui-button-icon-primary ui-icon"></span>'*/
							+ '<span class="ui-button-text">#{Name}</span>'
							+ '<span class="my-uid">#{UID}</span>'
						+ '</button>';				
	
	return {
		
		status: "enable",
		
		reverb: "select",
		
		currentPanel: "body",
		
		configPanelFocus: "checkbox",
		
		volumePanel: "hide",
		
		init : function() {
			this.initSlider();
			this.initProcessbar();
			this.disableUI();
		},

		initSlider : function() {
			$("#Tempo-slider").slider({
				range : "min",
				min : configArr[0].min,
				max : configArr[0].max,
				value : 1
			});

			$("#Pitch-slider").slider({
				range : "min",
				min : configArr[1].min,
				max : configArr[1].max,
				value : 1
			});

			$("#Rate-slider").slider({
				range : "min",
				min : configArr[2].min,
				max : configArr[2].max,
				value : 1
			});
		},
		
		initProcessbar: function(){
			$("#volume-processbar").progressbar({value: 50});
		},

		disableUI : function() {
			$(".header-icon").children("img").attr("src", "Resource/images/mic_020.png");
			$(".header-text").text('Please insert microphone.');
			$("#filter").addClass("ui-state-disabled");
			$(".mySelect-img").attr("src", "Resource/images/select-1.png");
			this.status = "disable";
			this.currentPanel = "body";
			$(".focus").hide();
			$("#helper").children().hide();
		},

		enableUI : function() {
			$(".header-text").text('Microphone Tutorial App');
			$("#filter").removeClass("ui-state-disabled");
			this.switchMic("down");
			this.switchPanel("microphone");
			this.status = "enable";
		},
		
		unselectReverb: function(){
			var s = microphoneSetting[this.getCurrentMic().getUniqueID()];
			var m = this.getCurrentMic();
			if(microphone.MICROPHONE_EFFECT_FILTER){
				m.setEffect(microphone.MICROPHONE_EFFECT_FILTER, false);
			}
			
			m.setEffect(window.webapis.microphone.MICROPHONE_EFFECT_REVERB, false);
			$("#reverb-select").children(".mySelect-img").attr("src", "Resource/images/select-1.png");
			if(s.filter == "enable" && microphone.MICROPHONE_EFFECT_FILTER){
				m.play();
				m.setEffect(microphone.MICROPHONE_EFFECT_FILTER, true, Number(s.Tempo), Number(s.Pitch), Number(s.Rate));
			}
			if(this.status == "enable"){
				s.reverb = "unselect";
			}
		},
		
		selectReverb: function(){
			
			var s = microphoneSetting[this.getCurrentMic().getUniqueID()];
			var m = this.getCurrentMic();
			if(microphone.MICROPHONE_EFFECT_FILTER){
				m.setEffect(microphone.MICROPHONE_EFFECT_FILTER, false);
			}

			m.setEffect(window.webapis.microphone.MICROPHONE_EFFECT_REVERB, true);
			$("#reverb-select").children(".mySelect-img").attr("src", "Resource/images/select-2.png");
			if(s.filter == "enable" && microphone.MICROPHONE_EFFECT_FILTER){
				m.play();
				m.setEffect(microphone.MICROPHONE_EFFECT_FILTER, true, Number(s.Tempo), Number(s.Pitch), Number(s.Rate));
			}
			if(this.status == "enable"){
				s.reverb = "select";
			}
		},
		
		enableFilter: function(m){
			m = m || this.getCurrentMic();
			var s = microphoneSetting[m.getUniqueID()];
			if(microphone.MICROPHONE_EFFECT_FILTER){
				m.play();
				m.setEffect(microphone.MICROPHONE_EFFECT_FILTER, true, Number(s.Tempo), Number(s.Pitch), Number(s.Rate));
			}

			s.filter = "enable";
			$("#filter-select").children(".mySelect-img").attr("src", "Resource/images/select-2.png");
			for ( var i = 0; i < configArr.length; i++) {
				$("#" + configArr[i].name).removeClass("ui-state-disabled");
			}
			this.changeHelper();
		},
		
		disableFilter: function(m){
			m = m || this.getCurrentMic();
			var s = microphoneSetting[m.getUniqueID()];
			if(microphone.MICROPHONE_EFFECT_FILTER){
				m.setEffect(microphone.MICROPHONE_EFFECT_FILTER, false);
			}

			s.filter = "disable";
			$("#filter-select").children(".mySelect-img").attr("src", "Resource/images/select-1.png");
			for ( var i = 0; i < configArr.length; i++) {
				$("#" + configArr[i].name).addClass("ui-state-disabled");
			}
			this.changeHelper();
		},
		
		switchPanel: function(v){

			if(this.currentPanel != v){
				$("#" + v + "-header").removeClass("ui-state-disabled");
				$("#" + v + "-foot").removeClass("ui-state-disabled");
				$("#" + (v=="microphone"?"config":"microphone") + "-foot").addClass("ui-state-disabled");
				$("#" + (v=="microphone"?"config":"microphone") + "-header").addClass("ui-state-disabled");
				if(v == "config"){
					//$("#reverb-select").removeClass("ui-state-disabled");
				}else{
					var o = $($("button[id^='microphone']")[focusMic%microphoneArr.length]);
					this.changeFocus(o);
					for ( var i = 0; i < configArr.length; i++) {
						$("#" + configArr[i].name).addClass("ui-state-disabled");
					}
					$("#filter-select,#reverb-select").addClass("ui-state-disabled");
				}
				this.currentPanel = v;
			}
		},

		switchVoice : function(voice) {
			// config value
			var s = microphoneSetting[this.getCurrentMic().getUniqueID()];
			if(this.currentPanel != "config"){
				return;
			}
			if(voice != "ReverbVoice"){
				if(s.filter == "disable"){
					this.enableFilter();
				}
			}
			$("#Tempo-label").text($("#Tempo-slider").slider("value", VoiceArr[voice][0]).slider("option", "value"));
			$("#Pitch-label").text($("#Pitch-slider").slider("value", VoiceArr[voice][1]).slider("option", "value"));
			$("#Rate-label").text($("#Rate-slider").slider("value", VoiceArr[voice][2]).slider("option", "value"));
			
			//set voice
			if(microphoneArr.length > 0){
				var mic = this.getCurrentMic();
				if(microphone.MICROPHONE_EFFECT_FILTER){
					mic.setEffect(microphone.MICROPHONE_EFFECT_FILTER, false);
				}

				if(s.filter == "enable" && microphone.MICROPHONE_EFFECT_FILTER){
					mic.play();
					mic.setEffect(microphone.MICROPHONE_EFFECT_FILTER, true, Number(VoiceArr[voice][0]), Number(VoiceArr[voice][1]), Number(VoiceArr[voice][2]));
				}
			}
			this.saveMicSetting({filter: "enable", Tempo: VoiceArr[voice][0], Pitch: VoiceArr[voice][1], Rate: VoiceArr[voice][2]});
		},

		switchConfig : function(v) {
			var s = microphoneSetting[this.getCurrentMic().getUniqueID()], o = null;
			if(s.filter != "enable"){
				return;
			}
			if(this.focusEl.attr("id")=="filter-select" || this.focusEl.attr("id")=="reverb-select"){
				focusConfig = v=="down" ? 100001 : 100002;
			}
			
			var f = false;
			if(v === "up"){
				focusConfig--;
				if(focusConfig%3 == 2){
					f = true;
				}
			}else if(v === "down"){
				focusConfig++;
				if(focusConfig%3 == 0){
					f = true;
				}
			}
			if(f && this.focusEl.attr("id")!="filter-select" && this.focusEl.attr("id")!="reverb-select"){
				if(s.reverbAvailable){
					o = $("#reverb-select");
				}else if(s.filterAvailable){
					o = $("#filter-select");
				}
				else{
					//alert("there is a error");
					o = $("#" + configArr[focusConfig%3].name);
				}
				
			}else{
				o = $("#" + configArr[focusConfig%3].name);
			}
			this.changeFocus(o);
			
		},
		
		switchMic: function(v){
			$("button[id^='microphone']").addClass("ui-state-disabled");
			if(v === "up"){
				focusMic--;
			}else if(v === "down"){
				focusMic++;
			}
			
			var bs = $("button[id^='microphone']");
			for(var i=0; i<bs.length; i++){
				if($(bs[i]).children(".my-uid").text() == microphoneArr[focusMic%microphoneArr.length].getUniqueID()){
					m = $(bs[i]);
				}
			}
			m.removeClass("ui-state-disabled");
			var offset = m.offset();
			if($(".focus").css("display") == "none"){
				$(".focus").width(m.outerWidth() - 2).height(m.outerHeight() - 2);
			}else{
				$(".focus").animate({top: offset.top-2, left: offset.left-2}, "normal");
			}
			
			var s = microphoneSetting[this.getCurrentMic().getUniqueID()];
			$("#Tempo-label").text($("#Tempo-slider").slider("value", s.Tempo).slider("option", "value"));
			$("#Pitch-label").text($("#Pitch-slider").slider("value", s.Pitch).slider("option", "value"));
			$("#Rate-label").text($("#Rate-slider").slider("value", s.Rate).slider("option", "value"));
			if(s.filter == "enable"){
				$("#filter-select").children(".mySelect-img").attr("src", "Resource/images/select-2.png");
			}else if(s.filter == "disable"){
				$("#filter-select").children(".mySelect-img").attr("src", "Resource/images/select-1.png");
			}
			if(s.reverb == "select"){
				$("#reverb-select").children(".mySelect-img").attr("src", "Resource/images/select-2.png");
			}else if(s.reverb == "unselect"){
				$("#reverb-select").children(".mySelect-img").attr("src", "Resource/images/select-1.png");
			}
		},
		
		initMic: function(m){
			m = m || this.getCurrentMic();
			alert("======== [initMic] m.name: " + m.name);
			var s = microphoneSetting[m.getUniqueID()];
			if(this.status=="enable"){
				var temp = Main.onPlayDevice(m);
				if(!temp){
					alert("microphone " + m.name + " init fail.");
					return false;
				}
			}
			
			//check the internal microphone
			
			if(m.name == "InternalMicrophone")
			{
				$("#reverb-select").addClass("ui-state-disabled");
				s.reverbAvailable = false; 
			}
			else
			{
				$("#reverb-select").removeClass("ui-state-disabled");
				s.reverbAvailable = true; 
			}
			
			// check whether support filter 
			supportedEffects = m.getSupportedEffects();
			alert("****** getSupportedEffects() = "+ supportedEffects);
			if(supportedEffects >= 16){
				$("#filter-select").removeClass("ui-state-disabled");
				s.filterAvailable = true;
			}else{
				$("#filter-select").addClass("ui-state-disabled");
				s.filterAvailable = false;
			}
			
			m.setVolumeLevel(s.volume);

			if(s.filterAvailable){
				m.setEffect(microphone.MICROPHONE_EFFECT_FILTER, false);
				$("#Tempo-label").text($("#Tempo-slider").slider("value", s.Tempo).slider("option", "value"));
				$("#Pitch-label").text($("#Pitch-slider").slider("value", s.Pitch).slider("option", "value"));
				$("#Rate-label").text($("#Rate-slider").slider("value", s.Rate).slider("option", "value"));
				if(s.filter == "enable"){
					this.enableFilter();
				}else{
					this.disableFilter();
				}
			}
			
			if(s.reverb == "select"){
				this.selectReverb();
			}else if(s.reverb == "unselect"){
				this.unselectReverb();
			}
			if(s.reverbAvailable){
				this.changeFocus($("#reverb-select"));
			}else if(s.filterAvailable){
				this.changeFocus($("#filter-select"));
			}
			return true;
		},
		
		changeFocus: function(o){
			var offset = o.offset();
			if($(".focus").css("display") == "none"){
				$(".focus").width(o.outerWidth() - 2).height(o.outerHeight() - 2);
				$(".focus").hide().show().offset({top: offset.top-2, left: offset.left-2});
			}else{
				$(".focus").animate({width: o.outerWidth() - 2, height: o.outerHeight() - 2, top: offset.top-2, left: offset.left-2}, "normal");
			}
			this.focusEl = o;
			this.changeHelper();
		},
		
		switchCheckbox: function(v){
			if(this.configPanelFocus == "checkbox"){
				var o = null, offset = null;
				if(v == "left"){
					o = $("#filter-select");
				}else if(v == "right"){
					o = $("#reverb-select");
				}
				offset = o.offset();
				$(".focus").width(o.outerWidth() - 2).height(o.outerHeight() - 2);
				$(".focus").hide().show().offset({top: offset.top-2, left: offset.left-2});
			}
		},
		
		getCurrentValue: function(){
			return $("#" + configArr[focusConfig%3].name + "-slider").slider("option", "value");
		},
		
		setCurrentValue: function(v){
			if(this.currentPanel == "config" /*&& this.getCurrentMicSetting().reverb == "select"*/){
				if(v > configArr[focusConfig%3].min && v < configArr[focusConfig%3].max){
					$("#" + configArr[focusConfig%3].name + "-slider").slider("option", "value", v);
					$("#" + configArr[focusConfig%3].name + "-label").text(v);
				}else if(v <= configArr[focusConfig%3].min){
					$("#" + configArr[focusConfig%3].name + "-slider").slider("option", "value", configArr[focusConfig%3].min);
					$("#" + configArr[focusConfig%3].name + "-label").text(configArr[focusConfig%3].min);
				}else if(v >= configArr[focusConfig%3].max){
					$("#" + configArr[focusConfig%3].name + "-slider").slider("option", "value", configArr[focusConfig%3].max);
					$("#" + configArr[focusConfig%3].name + "-label").text(configArr[focusConfig%3].max);
				}
			}
		},
		
		getCurrentConfigEl: function(){
			return configArr[focusConfig%3];
		},
		
		getCurrentMic: function(){
			var uid = $($("button[id^='microphone']")[focusMic%microphoneArr.length]).children(".my-uid").text();
			for(var i = 0;i < microphoneArr.length; i++){
				if(uid == microphoneArr[i].getUniqueID()){
					return microphoneArr[i];
				}
			}
			return null;
		},
		
		getCurrentMicSetting: function(){
			return microphoneSetting[this.getCurrentMic().getUniqueID()];
		},
		
		setParam: function(){
			if(this.currentPanel == "config"){
				var i = $("#" + configArr[focusConfig%3].name + "-label").text();
				var str = configArr[focusConfig%3].name;
				var mic = this.getCurrentMic();
				var s = microphoneSetting[mic.getUniqueID()];
				if(microphone.MICROPHONE_EFFECT_FILTER){
					mic.setEffect(microphone.MICROPHONE_EFFECT_FILTER, false);
				}

				switch(str){
					case "Tempo":
						this.saveMicSetting({Tempo: Number(i)});
						break;
					case "Pitch":
						this.saveMicSetting({Pitch: Number(i)});
						break;
					case "Rate":
						this.saveMicSetting({Rate: Number(i)});
						break;
					default: 
						break;
				}
				if(s.filter == "enable" && microphone.MICROPHONE_EFFECT_FILTER){
					mic.play();
					mic.setEffect(microphone.MICROPHONE_EFFECT_FILTER, true, Number(s.Tempo), Number(s.Pitch), Number(s.Rate));
				}
			}
		},
		
		addMicrophone: function(m){
			try{
				var v = focusMic%microphoneArr.length;
				microphoneArr.push(m);
				microphoneSetting[m.getUniqueID()] = microphoneSetting[m.getUniqueID()] || {filter: "disable", reverb: "unselect", Tempo: 0, Pitch: 0, Rate:0, volume: 50, filterAvailable:false};
				$("#microphone-wrapper").append(microphoneBtnEl.replace("#{ID}", microphoneArr.length).replace("#{Name}", CleanMicName(m.name)).replace("#{UID}", m.getUniqueID()));
				
				if(this.status == "enable"){
					var bs = $("button[id^='microphone']");
					for(var i = 0; i < bs.length; i++){
						if($(bs[i]).children(".my-uid").text() == m.getUniqueID()){
							$(bs[i]).addClass("ui-state-disabled");
						}
					}
					focusMic = 720000 + v;
				}
				return true;
			}catch(e){
				return false;
			}
		},
		
		checkMicrophone: function(uid){
			//var index = null, m = null;
			for(var i = 0; i< microphoneArr.length; i++){
				if(uid == microphoneArr[i].getUniqueID()){
					return true;
				}
			}
			return false;
		},
		
		removeMicrophone: function(uid){
			var index = null, m = null;
			for(var i = 0; i< microphoneArr.length; i++){
				if(uid == microphoneArr[i].getUniqueID()){
					index = i;
					m = microphoneArr[i];
				}
			}
			var v = focusMic%microphoneArr.length;
			var cm = this.getCurrentMic();
			if(cm.getUniqueID() == m.getUniqueID()){
				if(microphoneArr.length == 1){
					microphoneArr.splice(index, 1);
					delete microphoneSetting[uid];
					this.resetUI();
				}else{
					$($("button[id^='microphone']")[focusMic%microphoneArr.length]).remove();
					microphoneArr.splice(index, 1);
					delete microphoneSetting[uid];
					focusMic = 720000 + v -1;
					if(this.currentPanel == "config"){
						this.switchPanel("microphone");
					}else{
						this.changeFocus($($("button[id^='microphone']")[focusMic%microphoneArr.length]));
					}
					$($("button[id^='microphone']")[focusMic%microphoneArr.length]).removeClass("ui-state-disabled");
					
					var s = microphoneSetting[this.getCurrentMic().getUniqueID()];
					$("#Tempo-label").text($("#Tempo-slider").slider("value", s.Tempo).slider("option", "value"));
					$("#Pitch-label").text($("#Pitch-slider").slider("value", s.Pitch).slider("option", "value"));
					$("#Rate-label").text($("#Rate-slider").slider("value", s.Rate).slider("option", "value"));
					if(s.filter == "enable"){
						$("#filter-select").children(".mySelect-img").attr("src", "Resource/images/select-2.png");
					}else if(s.filter == "disable"){
						$("#filter-select").children(".mySelect-img").attr("src", "Resource/images/select-1.png");
					}
					if(s.reverb == "select"){
						$("#reverb-select").children(".mySelect-img").attr("src", "Resource/images/select-2.png");
					}else if(s.reverb == "unselect"){
						$("#reverb-select").children(".mySelect-img").attr("src", "Resource/images/select-1.png");
					}
				}
			}else{
				var ms = $("button[id^='microphone']");
				var cmIndex = null;
				for(var i=0;i<ms.length;i++){
					if($(ms[i]).children(".my-uid").text() == m.getUniqueID()){
						$(ms[i]).remove();
					}
				}
				for(var i = 0; i<microphoneArr.length; i++){
					if(cm.getUniqueID() == microphoneArr[i].getUniqueID()){
						cmIndex = i;
					}
				}
				microphoneArr.splice(index, 1);
				delete microphoneSetting[uid];
				focusMic = 720000 + v;
				if(index < cmIndex){
					focusMic--;
				}
				if(this.currentPanel == "microphone")
				{
					this.changeFocus($($("button[id^='microphone']")[focusMic%microphoneArr.length]));
				}
			}
			return true;
		},
		
		saveMicSetting: function(s){
			var mic = this.getCurrentMic();
			var setting = microphoneSetting[mic.getUniqueID()];
			for(var i in s){
				setting[i] = s[i];
			}
			microphoneSetting[mic.getUniqueID()] = setting;
		},
		
		setTab: function(i){
			switch(i){
				case "a":
					$("#tabs").tabs({ selected: 0 });
					$(".my-icon-a").removeClass("ui-state-disabled");
					$(".my-icon-b").addClass("ui-state-disabled");
					break;
				case "b":
					$("#tabs").tabs({ selected: 1 });
					$(".my-icon-b").removeClass("ui-state-disabled");
					$(".my-icon-a").addClass("ui-state-disabled");
					break;
				default:
					break;
			}
		},
		
		resetUI: function(){
			this.disableUI();
			microphoneSetting = {};
			focusConfig = 100001;
			focusMic = 719999;
			microphoneArr = [];
			$("#microphone-wrapper").empty();
		},
		
		setVolume: (function(){
			var volumePanel = "hide";
			var setTimeId = null;
			var hidePanel = function(){
				setTimeId = window.setTimeout(function(){
					volumePanel = "hide";
					$(".volume-wrapper").animate({bottom: -104}, "normal", function(){
						$(this).hide();
					});
				}, 1500);
			};
			return function(v){
				var m = this.getCurrentMic();
				if(m == null){
					return;
				}
				var setting = microphoneSetting[m.getUniqueID()];
				if(setTimeId){
					window.clearTimeout(setTimeId);
				}
				if(v < 0 || v > 100){
					hidePanel();
					return;
				}
				if(volumePanel == "hide"){
					$(".volume-wrapper").stop().show().css("bottom", 0);
					volumePanel == "show";
				}
				$("#volume-processbar").progressbar("option", "value", v);
				$("#volume-label").text(v);
				//set volume
				m.setVolumeLevel(v);
				//set setting
				setting.volume = v;
				//delay hide
				hidePanel();
			}
		})(),
		
		getVolume: function(){
			var m = this.getCurrentMic();
			var setting = microphoneSetting[m.getUniqueID()];
			return Number(setting.volume);
		},
		
		changeHelper:function(){
			var id = this.focusEl.attr("id");
			var regMic = /microphone\d/, regCheckbox = /.+select/, regConfig = /Tempo|Pitch|Rate/;
			$("#helper").children().hide();
			if(regMic.test(id)){
				$("#helper").children(":lt(4)").show();				
					$(".icon-play,#helper-play,.icon-stop,#helper-stop").show();
			}else if(regCheckbox.test(id)){
				$(".icon-return,#helper-return,.icon-enter,#helper-enter,.icon-rw,.icon-ff,#helper-volume").show();
				var setting = microphoneSetting[this.getCurrentMic().getUniqueID()];
				if(setting.filterAvailable && setting.reverbAvailable){
					if(setting.filter == "enable"){
						$(".icon-ud,#helper-ud").show();
					}
					$(".icon-lr,#helper-lr,.icon-a,#helper-reverb,.icon-b,#helper-funny,.icon-c,#helper-man,.icon-d,#helper-woman").show();
				}
				else if(setting.filterAvailable)
				{
					if(setting.filter == "enable"){
						$(".icon-ud,#helper-ud").show();
					}
					$(".icon-a,#helper-reverb,.icon-b,#helper-funny,.icon-c,#helper-man,.icon-d,#helper-woman").show();
				}
					$(".icon-play,#helper-play,.icon-stop,#helper-stop").show();
			}else if(regConfig.test(id)){
				$(".icon-return,#helper-return,.icon-value,#helper-value,.icon-ud,#helper-ud,.icon-rw,.icon-ff,#helper-volume").show();
				$(".icon-a,#helper-reverb,.icon-b,#helper-funny,.icon-c,#helper-man,.icon-d,#helper-woman").show();
					$(".icon-play,#helper-play,.icon-stop,#helper-stop").show();
			}
		},
		
		getMicrophoneByUid:function(uid){
			if(uid){
				for(var i = 0; i < microphoneArr.length; i++){
					if(uid == microphoneArr[i].getUniqueID()){
						return microphoneArr[i];
					}
				}
				return null;
			}else{
				return null;
			}
		}
	};
})();

$(document).ready(function() {
	Main.onLoad();
	MainUI.init();
	$("#test1").click(function(){
		MainUI.setVolume(MainUI.getVolume() + 1);
	});
	$("body").keydown(function(e) {
		if(MainUI.status == "enable"){
			switch (e.keyCode) {
			case gTVKey.KEY_RED:
				//A key
				var s = MainUI.getCurrentMicSetting();
				if(s.reverbAvailable){
					if(MainUI.currentPanel == "config" && MainUI.getCurrentMicSetting().reverb == "select"){
						MainUI.unselectReverb();
					}else if(MainUI.currentPanel == "config" && MainUI.getCurrentMicSetting().reverb == "unselect"){
						MainUI.selectReverb();
					}
				}
				break;
			case gTVKey.KEY_GREEN:
				//B key
				var s = MainUI.getCurrentMicSetting();
				if(s.filterAvailable){
					MainUI.switchVoice("FunnyVoice");
				}
				break;
			case gTVKey.KEY_YELLOW:
				//C key
				var s = MainUI.getCurrentMicSetting();
				if(s.filterAvailable){
					MainUI.switchVoice("ManVoice");
				}
				break;
			case gTVKey.KEY_BLUE:
				//D key
				var s = MainUI.getCurrentMicSetting();
				if(s.filterAvailable){
					MainUI.switchVoice("WomanVoice");
				}
				break;
			case gTVKey.KEY_DOWN:
				//down
				if(MainUI.currentPanel == "microphone"){
					MainUI.switchMic("down");
				}else if(MainUI.currentPanel == "config"){
					MainUI.switchConfig("down");
				}
				break;
			case gTVKey.KEY_UP:
				//up
				if(MainUI.currentPanel == "microphone"){
					MainUI.switchMic("up");
				}else if(MainUI.currentPanel == "config"){
					MainUI.switchConfig("up");
				}
				break;
			case gTVKey.KEY_ENTER:
				//Enter
				if(MainUI.currentPanel=="microphone"){
					if(MainUI.initMic()){
						var s = MainUI.getCurrentMicSetting();
						if(s.reverbAvailable||s.filterAvailable){
							MainUI.switchPanel("config");
						}
					}
				}else{
					var s = MainUI.getCurrentMicSetting();
					if(MainUI.focusEl.attr("id")=="filter-select"){
						s.filter == "enable" ? MainUI.disableFilter() : MainUI.enableFilter();
					}else if(MainUI.focusEl.attr("id")=="reverb-select"){
						s.reverb == "select" ? MainUI.unselectReverb() : MainUI.selectReverb();
					}
				}
				break;
			case gTVKey.KEY_RETURN:
				//Return
				if(MainUI.currentPanel=="config"){
					var m = MainUI.getCurrentMic();
					alert(" ---------  return m.name: " + m.name);
					Main.onStopDevice(MainUI.getCurrentMic());
					MainUI.switchPanel("microphone");
					gWidgetAPI.blockNavigation(e);
				}
				break;
			case gTVKey.KEY_LEFT:
				if(MainUI.focusEl.attr("id")=="filter-select"){
					var s = MainUI.getCurrentMicSetting();
					if(s.reverbAvailable){
						MainUI.changeFocus($("#reverb-select"));
					}
				}else if(MainUI.focusEl.attr("id")=="reverb-select"){
					var s = MainUI.getCurrentMicSetting();
					if(s.filterAvailable){
						MainUI.changeFocus($("#filter-select"));
					}
				}else{
					MainUI.setCurrentValue(MainUI.getCurrentValue() - MainUI.getCurrentConfigEl().step);
					MainUI.setParam();
				}
				break;
			case gTVKey.KEY_RIGHT:
				if(MainUI.focusEl.attr("id")=="filter-select"){
					var s = MainUI.getCurrentMicSetting();
					if(s.reverbAvailable){
						MainUI.changeFocus($("#reverb-select"));
					}
				}else if(MainUI.focusEl.attr("id")=="reverb-select"){
					var s = MainUI.getCurrentMicSetting();
					if(s.filterAvailable){
						MainUI.changeFocus($("#filter-select"));
					}
				}else{
					MainUI.setCurrentValue(MainUI.getCurrentValue() + MainUI.getCurrentConfigEl().step);
					MainUI.setParam();
				}
				break;
			case gTVKey.KEY_RW:
				// <<
				if(MainUI.currentPanel != "config"){
					return;
				}
				var m = MainUI.getCurrentMic();
				if(m){
					MainUI.setVolume(Number(m.getVolumeLevel()) - 1);
				}
				break;
			case gTVKey.KEY_FF:
				// >>
				if(MainUI.currentPanel != "config"){
					return;
				}
				var m = MainUI.getCurrentMic();
				if(m){
					MainUI.setVolume(Number(m.getVolumeLevel()) + 1);
				}
				break;
			case gTVKey.KEY_PLAY:
				aelement = document.getElementById("music");
				aelement.play();
				break;
			case gTVKey.KEY_STOP:
				aelement.pause();
				aelement = null;
				break;
			default:
				break;
			}
		}
	});
});

var webapis = window.webapis || {};
var microphone = window.webapis.microphone || {};


var Main = {};
var gWidgetAPI;
var gTVKey;
var supportedEffects = 0;
var micVolume = 0;
//var isDeviceUsed = false;
var init = false;
//var time;
var gInitSuccess = false;
var aelement = null;

Main.onUnload = function() {
	alert("[Test]: Tutorial_onUnload()");
};

Main.onStopDevice = function(micDevice)
{
	micDevice.stop();
	micDevice.disableDevice();
	//isDeviceUsed = false;
}

CleanMicName = function(name)
{
	var i = name.length;
	var j = 0;
	var str="";
	for(j=0; j<=i; j++)
	{
		if( (name[j]>= "a" && name[j]<="z") || (name[j]>= "A" && name[j]<="Z") ||  (name[j]>= "0" && name[j]<="9") || name[j]=="-" || name[j]==" ")
		{
			str = str + name[j];
		}
	}
	return str;
}

Main.onPlayDevice = function(micDevice)
{
	//if(isDeviceUsed == false){
	if(micDevice.enableDevice(microphone.MICROPHONE_FORMAT_SIGNED_16BIT_LITTLE_ENDIAN,microphone.MICROPHONE_FRAMERATE_48000) == false){
		alert("&&&&&&&&&&&&&&&This mic can't be enabled. Please, check whether there is another enabled mic or not.");
		//document.getElementById("enable").innerHTML = "Error happened during calling enable().";        
		return false;
	}
	if(micDevice.play() == false){
		//document.getElementById("enable").innerHTML = "Can't be ON, Error happened!";       
		return false;
	}
	return true;
}

Main.onMicrophoneObtained = function(mics)
{
	MainUI.resetUI();
    if(mics && mics.length > 0)
    {
        for(var i = 0; i < mics.length; i++){
			if(mics[i]!=null){
                MainUI.addMicrophone(mics[i]);
            }
        }
		
		if(MainUI.status == "disable"){
				MainUI.enableUI();
		}
		
	}else{
		alert("*********************************************************************************************");
        alert("No microphone found. If you are sure to hook up a microphone, please try again a few seconds.");
        alert("*********************************************************************************************");
    }
	
	gInitSuccess = true;
	
}

Main.onShowEventHandler = function()
{
	var pluginAPI = new Common.API.Plugin();
	var nnaviPlugin = document.getElementById('pluginNNavi');
	
	nnaviPlugin.SetBannerState(2);
	
	pluginAPI.unregistKey(gTVKey.KEY_VOL_UP);  //unregister volume up button
    pluginAPI.unregistKey(gTVKey.KEY_VOL_DOWN); //unregister volume down button
    pluginAPI.unregistKey(gTVKey.KEY_MUTE); //unregister mute button 
}

Main.onLoad = function() {
	gWidgetAPI = new Common.API.Widget();	//	Create Common module 
	gTVKey = new Common.API.TVKeyValue();

	gWidgetAPI.sendReadyEvent();			//	Send ready message to Application Manager
	
	microphone.registerManagerCallback(Main.onDeviceStatusChange);
	microphone.getMicrophones(Main.onMicrophoneObtained);
	
	window.onShow = Main.onShowEventHandler;

};

Main.onDeviceStatusChange = function(sParam)
{
	//alert("[Device status changed recieved]******************************");
	//alert("event type is " + sParam.eventType);
	alert("device name is " + sParam.name);
	var temp = MainUI.checkMicrophone(sParam.UID);
    //alert("device UID is " + sParam.UID);
    //alert("***************************************************************");
    
    switch (sParam.eventType)
    {
    	case microphone.MGR_EVENT_DEV_CONNECT:
    	{
			if( gInitSuccess && !temp ){
				alert("======== mic connnet =========");
				microphone.getMicrophones(function(mics){
					var r = null;
					for(var i=0;i<mics.length;i++){
						if(sParam.UID == mics[i].getUniqueID()){
							r = MainUI.addMicrophone(mics[i]);
						}
					}
					if(r && mics.length == 1){
						MainUI.enableUI();
					}
				});
			}
    	}
    	break;

        case microphone.MGR_EVENT_DEV_DISCONNECT:
        {
		if(temp){
				alert("======== mic disconnnet =========");
				microphone.getMicrophones(function(mics){
				MainUI.removeMicrophone(sParam.UID);
				});
			}
            break;
        }
        
        default:
            break;
    }
    
    return;
}
