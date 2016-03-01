main.ui = function(config){
	main.ui.superclass.constructor.call(this, config);
	this.addEvent([
		"init",
		"afterinit",
		"destroy"
	]);
};
main.extend(main.ui, main.Observable, {
	
	init: function(){
		try{
		this.fireEvent("init", this);
		this.deviceMaintainance = new main.DeviceMaintainance({id: "midi-list-content"});
		this.channelList = new main.ListSelector({
			id: "channel-list",
			data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
			getDisplayValue: function(d){
				return "Channel " + d;
			}
		});
		this.programList = new main.ListSelector({
			id: "program-list",
			getDisplayValue: function(d){
				return d.programName + ":" + d.bankNum + ":" + d.programNum;
			}
		});
		this.bankList = new main.PopupListSelector({
			id: "bank-list",
			getDisplayValue: function(d){
				if(d == "all"){
					return "All Bank"
				}
				return "Bank " + d;
			}
		});
		this.paraValueChannel = $("#para-value-channel");
		this.channelList.addEventHandler("selecteditem", function(i, o){
			this.paraValueChannel.text(i.displayValue);
		}, this);
		this.paraValueBank = $("#para-value-bank");
		this.bankList.addEventHandler("selecteditem", function(i, o){
		}, this);
		this.paraValueProgram = $("#para-value-program");
		this.programList.addEventHandler("selecteditem", function(i, o){
			this.paraValueProgram.text(i.displayValue);
			this.paraValueBank.text("Bank "+i.value.bankNum);
		}, this);
		this.volumeSlider = new main.Slider({
			id: "volume",
			orientation: "vertical",
			max: 127,
			min: 0,
			step: 1,
			value: 0
		});
		this.volumeSlider.intSlider.slider( "option", "disabled", true ).removeClass("ui-slider-disabled").removeClass("ui-state-disabled").removeClass("ui-disabled");
		this.sustainSlider = new main.Slider({
			id: "sustain",
			orientation: "vertical",
			max: 127,
			min: 0,
			step: 1,
			value: 0
		});
		this.sustainSlider.intSlider.slider( "option", "disabled", true ).removeClass("ui-slider-disabled").removeClass("ui-state-disabled").removeClass("ui-disabled");
		this.panSlider = new main.Slider({
			id: "pan",
			orientation: "vertical",
			max: 127,
			min: 0,
			step: 1,
			value: 120
		});
		this.panSlider.intSlider.slider( "option", "disabled", true ).removeClass("ui-slider-disabled").removeClass("ui-state-disabled").removeClass("ui-disabled");
		this.balanceSlider = new main.Slider({
			id: "balance",
			orientation: "vertical",
			max: 127,
			min: 0,
			step: 1,
			value: 0
		});
		this.balanceSlider.intSlider.slider( "option", "disabled", true ).removeClass("ui-slider-disabled").removeClass("ui-state-disabled").removeClass("ui-disabled");
		this.pitchbendSlider = new main.Slider({
			id: "pitch-bend",
			max: 16383,
			min: 0,
			step: 256,
			value: 8192
		});
		this.pitchbendSlider.intSlider.slider( "option", "disabled", true ).removeClass("ui-slider-disabled").removeClass("ui-state-disabled").removeClass("ui-disabled");
		$("#pitch-bend-btn-sub,#pitch-bend-btn-plus").button();
		this.midiPlay = $("#midi-play").button({
			icons: {
				primary: "ui-icon-play"
			},
			text: false,
			disabled: false
		});

		this.midiStop = $("#midi-stop").button({
			icons: {
				primary: "ui-icon-stop"
			},
			text: false,
			disabled: true
		});
		$("#helper-stop").hide();
		this.keyboard = new main.Keyboard({
			id: "keyBoard",
			handler: [{
				eventName: "mousedown",
				fn: function(k){setSound(k);}
			},{
				eventName: "mouseup",
				fn: function(k){cancelSound(k);}
			},{
				eventName: "increase",
				fn: function(o){$("#octaveNum").text(o.octaveNum + 1);}
			},{
				eventName: "decrease",
				fn: function(o){$("#octaveNum").text(o.octaveNum + 1);}
			}]
		});
		var that = this;
		$("#increaseOctave").button({
			icons: {
				primary: "ui-icon-plusthick"
			},
			text: false
		});
		$("#increaseOctave").click(function(){
			if(that.baseOctave < 8){
				that.baseOctave = that.baseOctave + 1;
				$("#octaveMin").text(""+that.baseOctave);
				$("#octaveMax").text("" + (that.baseOctave + 3));
			}
		});
		$("#decreaseOctave").button({
			icons: {
				primary: "ui-icon-minusthick"
			},
			text: false
		});
		$("#decreaseOctave").click(function(){
			if(that.baseOctave > 1){
				that.baseOctave = that.baseOctave - 1;
				$("#octaveMin").text(""+that.baseOctave);
				$("#octaveMax").text("" + (that.baseOctave + 3));
			}
		});
		this.baseOctave = 1;
		$("#octaveMin").text(""+this.baseOctave);
		$("#octaveMax").text("" + (this.baseOctave + 3));
		this.timer = new main.Timer();
		main.supportMouse();
		this.focus = new main.focus();
		this.rendered = true;
		main.helper.init();

		this.focus.moveTo("channel-list");
		this.fireEvent("afterinit", this);
		}catch(e){
			main.log("error--- " + e.name + " : " + e.message + ", " + e.fileName);
		}
	}
});

