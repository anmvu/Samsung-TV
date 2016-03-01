
main.focus = function(config){
	this.addEvent(["change", "enter", "return", "block"]);
	main.focus.superclass.constructor.call(this, config);
	this.focusArr = {
		"midi-list-content": {id: "midi-list-content", me: MidiUI.deviceMaintainance, rightEl: MidiUI.channelList, activate: true},
		"channel-list": {id: "channel-list", me: MidiUI.channelList, leftEl: MidiUI.deviceMaintainance, rightEl: MidiUI.bankList, activate: true},
		"bank-list": {id: "bank-list", me: MidiUI.bankList, leftEl: MidiUI.channelList, rightEl: MidiUI.volumeSlider, bottomEl: MidiUI.programList },
		"program-list": {id: "program-list", me: MidiUI.programList, leftEl: MidiUI.channelList, rightEl: MidiUI.volumeSlider, topEl: MidiUI.bankList, activate: true},
		"volume": {id: "volume", me: MidiUI.volumeSlider, leftEl: MidiUI.bankList, rightEl: MidiUI.sustainSlider, activate: true},
		"sustain": {id: "sustain", me: MidiUI.sustainSlider, leftEl: MidiUI.volumeSlider, rightEl: MidiUI.panSlider, activate: true},
		"pan": {id: "pan", me: MidiUI.panSlider, leftEl: MidiUI.sustainSlider, rightEl: MidiUI.balanceSlider,  activate: true},
		"balance": {id: "balance", me: MidiUI.balanceSlider, leftEl: MidiUI.panSlider, rightEl: MidiUI.pitchbendSlider,  activate: true},
		"pitch-bend": {id: "pitch-bend", me: MidiUI.pitchbendSlider, leftEl: MidiUI.balanceSlider,activate: true}
	};
	this.el = $(".focus");
	this.block = false;
};

main.extend(main.focus, main.Observable, {
	
	currentFocus: null,
	
	myControlRight: true,
	
	moveTo: function(id){
		if(typeof(id) != "string"){
			if(id.id){
				id = id.id;
			}else{
				id = id.attr("id")
			}
		}
		var com = this.focusArr[id];
		if(com.me.deviceList){
			if(com.me.deviceList.length > 0){
				if(com.me.deviceList[0].status == "activate"){
					this.el.addClass("focus-activate");
				}
				this.setFocus(com.me.deviceList[0]);
				this.focusDevice = com.me.deviceList[0];
				this.currentFocus = com;
			}
		}else{
			if(this.currentFocus && this.currentFocus.me.unactivate){
				if(!this.currentFocus.me.deviceList){
				}
			}
			this.el.removeClass("focus-activate");
			this.setFocus(com.me);
			this.currentFocus = com;
		}
		this.fireEvent("change", this.currentFocus.me, this);
	},
	
	setFocus: function(o){
		if(o.el){
			o = o.focusEl || o.el;
		}
		var offset = o.offset(), zIndex = o.css("z-index");
		if($(".focus").css("display") == "none"){
			$(".focus").width(o.outerWidth() - 2).height(o.outerHeight() - 2);
			$(".focus").hide().show().offset({top: offset.top-2, left: offset.left-2});
		}else{
			$(".focus").animate({width: o.outerWidth() - 2, height: o.outerHeight() - 2, top: offset.top-2, left: offset.left-2}, "normal");
		}
		if(zIndex == "auto"){
			$(".focus").css("z-index", 0);
		}else{
			$(".focus").css("z-index", Number(zIndex) - 1);
		}
	},
	
	enter: function(){
		if(this.block){
			this.fireEvent("block", "enter", this);
			return;
		}
		var status = null;
		if(this.myControlRight){
			if(!this.currentFocus.me.deviceList){
				if(this.currentFocus.me.activate){
					this.currentFocus.me.activate();
				}
				this.myControlRight = false;
				this.el.addClass("focus-activate");
				if(this.currentFocus.id == "midi-record"){
					if(this.currentFocus.me.dataList && this.currentFocus.me.dataList.length > 0){
						this.enter();
					}else{
						this.currentFocus.me.unactivate();
						this.myControlRight = true;
						this.el.removeClass("focus-activate");
					}
					
				}
			}else{
				if(this.focusDevice.status == "activate"){
					this.el.removeClass("focus-activate");
					MidiUI.deviceMaintainance.unactivateItem(this.focusDevice);
				}else{
					this.el.addClass("focus-activate");
					MidiUI.deviceMaintainance.activateItem(this.focusDevice);
				}
			}
			status = "activate";
		}else{
			if(this.currentFocus.me instanceof main.Selector){
				this.myControlRight = true;
				this.currentFocus.me.selectedItem();
				this.el.removeClass("focus-activate");
			}else if(this.currentFocus.me instanceof main.Slider){
				this.myControlRight = true;
				this.el.removeClass("focus-activate");
			}else if(this.currentFocus.me.attr && (this.currentFocus.me.attr("id") == "midi-stop" || this.currentFocus.me.attr("id") == "midi-record-stop")){
				this.currentFocus.me.unactivate();
			}
			status = "unactivate";
		}
		this.fireEvent("enter", this.currentFocus.me, status, this);
	},
	
	left: function(){
		if(this.block){
			this.fireEvent("block", "left", this);
			return;
		}
		if(this.myControlRight){
			if(this.currentFocus.leftEl){
				this.moveTo(this.currentFocus.leftEl);
			}
		}else{
			if(this.currentFocus.me instanceof main.Slider && this.currentFocus.me.orientation == "horizontal"){
				this.currentFocus.me.decrease();
			}
		}
	},
	
	right: function(){
		if(this.block){
			this.fireEvent("block", "right", this);
			return;
		}
		if(this.myControlRight){
			if(this.currentFocus.rightEl){
				this.moveTo(this.currentFocus.rightEl);
			}
		}else{
			if(this.currentFocus.me instanceof main.Slider && this.currentFocus.me.orientation == "horizontal"){
				this.currentFocus.me.increase();
			}
		}
	},
	
	up: function(){
		if(this.block){
			this.fireEvent("block", "up", this);
			return;
		}
		if(this.myControlRight){
			if(this.currentFocus.me.deviceList){
				var index = MidiUI.deviceMaintainance.getIndex(this.focusDevice);
				index = index - 1;
				if(index < 0){
					return;
				}
				var device = MidiUI.deviceMaintainance.deviceList[index];
				device.status == "activate" ? this.el.addClass("focus-activate"):this.el.removeClass("focus-activate");
				this.setFocus(device);
				this.focusDevice = device;
			}else if(this.currentFocus.topEl){
				this.moveTo(this.currentFocus.topEl);
			}
		}else if(this.currentFocus.me instanceof main.Selector){
			this.currentFocus.me.selectPrev();
		}else if(this.currentFocus.me instanceof main.Slider && this.currentFocus.me.orientation == "vertical"){
			this.currentFocus.me.increase();
		}
	},
	
	down: function(){
		if(this.block){
			this.fireEvent("block", "down", this);
			return;
		}
		if(this.myControlRight){
			if(this.currentFocus.me.deviceList){
				var index = MidiUI.deviceMaintainance.getIndex(this.focusDevice);
				index = index + 1;
				if(index >= MidiUI.deviceMaintainance.deviceList.length){
					return;
				}
				var device = MidiUI.deviceMaintainance.deviceList[index];
				device.status == "activate" ? this.el.addClass("focus-activate"):this.el.removeClass("focus-activate");
				this.setFocus(device);
				this.focusDevice = device;
			}else if(this.currentFocus.bottomEl){
				this.moveTo(this.currentFocus.bottomEl);
			}
		}else if(this.currentFocus.me instanceof main.Selector){
			this.currentFocus.me.selectNext();
		}else if(this.currentFocus.me instanceof main.Slider && this.currentFocus.me.orientation == "vertical"){
			this.currentFocus.me.decrease();
		}
	},
	
	_return: function(e){
		if(this.block){
			this.fireEvent("block", "return", this);
			gWidgetAPI.blockNavigation(e);
		}else if(!this.myControlRight){
			if(this.currentFocus.me instanceof main.Selector){
				this.currentFocus.me.unactivate();
				this.myControlRight = true;
				this.el.removeClass("focus-activate");
			}else if(this.currentFocus.me instanceof main.Slider){
				this.myControlRight = true;
				this.el.removeClass("focus-activate");
			}
			this.fireEvent("return", this.currentFocus.me, this);
			gWidgetAPI.blockNavigation(e);
		}
	},
	
	moveToDeviceByIndex: function(index){
		if(MidiUI.deviceMaintainance.deviceList.length == 0){
			this.moveTo("midi-list-content");
		}else if(index >= 0 && index < MidiUI.deviceMaintainance.deviceList.length){
			var device = MidiUI.deviceMaintainance.deviceList[index];
			device.status == "activate" ? this.el.addClass("focus-activate"):this.el.removeClass("focus-activate");
			this.setFocus(device);
			this.focusDevice = device;
		}
	},
});

main.helper = {
	init: function(){
		MidiUI.focus.addEventHandler("change", function(f, o){
			$("#helper-return").children("label").text("Exit");
			if(f.attr && f.attr("id") == "midi-record-stop"){
				$("#helper-ud").hide();
				$("#helper-lr").hide();
			}else{
			}
		});
		
		MidiUI.focus.addEventHandler("enter", function(f, s, o){
			var id = f.id || f.attr("id");
			switch(id){
				case "midi-list-content":
				case "channel-list":
				case "bank-list":
				case "program-list":
				case "volume":
				case "sustain":
				case "pan":
				case "balance":
				case "midi-play":
				case "midi-record":
					if(s == "activate"){
						$("#helper-return").children("label").text("Return");
						$("#helper-ud").show();
						$("#helper-lr").hide();
					}else{
						$("#helper-return").children("label").text("Exit");
						$("#helper-ud").show();
						$("#helper-lr").show();
					}
					break;
				case "pitch-bend":
					if(s == "activate"){
						$("#helper-return").children("label").text("Return");
						$("#helper-ud").hide();
						$("#helper-lr").show();
					}else{
						$("#helper-return").children("label").text("Exit");
						$("#helper-ud").show();
						$("#helper-lr").show();
					}
					break;
			}
		});
		
		MidiUI.focus.addEventHandler("return", function(f, o){
			$("#helper-return").children("label").text("Exit");
			$("#helper-ud").show();
			$("#helper-lr").show();
		});
	}
};