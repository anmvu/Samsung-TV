try{
var MidiWidget = {};
var MidiUI = new main.ui();
var gInitSuccess = false;
var midi = window.webapis.mididevice || {};
var midisynthInstance = null;
var allProgramArr = null;
var sfData = null;
var gWidgetAPI = null;
var gTVKey = null;
var playFileStatus = null;
var sfId = null;
var gAlertMsg = null;
var gStatusTimeId = null;
MidiUI.pitchBend_default = 8192;

var regDeviceUID = -1;
var smartHubFull = window.location.search.split('modelid=');
var smartHubModel = smartHubFull[1].split('&');

MidiWidget.onLoad = function(){
	gWidgetAPI = new Common.API.Widget();
	gTVKey = new Common.API.TVKeyValue();
	gWidgetAPI.sendReadyEvent();
	midi.registerManagerCallback(MidiWidget.onDeviceStatusChange);
	midi.getMIDIDevices(MidiWidget.onCustomObtained);
	var pluginAPI = new Common.API.Plugin();
	var nnaviPlugin = document.getElementById('pluginNNavi');
	nnaviPlugin.SetBannerState(2);
	var pluginAPI = new Common.API.Plugin();
	var nnaviPlugin = document.getElementById('pluginNNavi');
	
	
	if(smartHubModel[0] == 'SDK') {
		pluginAPI.registKey(gTVKey.KEY_CH_UP);
		pluginAPI.registKey(gTVKey.KEY_CH_DOWN);
	} else {
		window.onShow = function() {
			nnaviPlugin.SetBannerState(2);
			pluginAPI.unregistKey(gTVKey.KEY_VOL_UP);  
			pluginAPI.unregistKey(gTVKey.KEY_VOL_DOWN);
			pluginAPI.unregistKey(gTVKey.KEY_MUTE);
			main.log("unregist Volume Keys.");
		};
	}


};


MidiWidget.onCustomObtained = function(midis){
	main.log("found " + midis.length + " midi device(s)");
	gInitSuccess = true;
};

MidiWidget.onDeviceStatusChange = function(sParam)
{
	if(sParam.deviceType== midi.MIDI_DEVICE_SYNTHESIZER){
		if(midisynthInstance == null){
			midi.getMIDIDevices(function(midis){
				for(var i = 0; i < midis.length; i++){
					if((sParam.deviceType== midi.MIDI_DEVICE_SYNTHESIZER) && midisynthInstance == null){
						midisynthInstance = midis[i];
						if(MidiUI.rendered){
							MidiUI.channelList.listIndex = 0;
							MidiUI.channelList.selectedItem();
							var arr = readSFFile("1");
							sfId = "1";
							if($.isArray(arr) && arr.length > 0){
								sfData = main.Util.getSf2Data(arr, true);
								var programArr = [];
								var bankArr = ["all"];
								$.each(sfData, function(h, v){
									$.each(v, function(j, k){
										programArr.push(k);
									})
									bankArr.push(h);
								});
								allProgramArr = programArr;
								MidiUI.bankList.loadData(bankArr);
							}
						}else{
						}
					}
				}
			});
		}
	}else {
		switch(Number(sParam.eventType)){
			case midi.MGR_EVENT_DEV_CONNECT:
			{
				if(gInitSuccess){
					midi.getMIDIDevices(function(midis){
						for(var i = 0; i < midis.length; i++){						
							if(sParam.deviceType== midi.MIDI_DEVICE_SYNTHESIZER){
								continue;
                                                        }else if(sParam.uniqueID == midis[i].getUniqueID()){
								if (regDeviceUID == -1) {
									midis[i].registerDeviceCallback(callBackFunction);
                                    					regDeviceUID = sParam.uniqueID;
								}
								if(MidiUI.rendered){								
									var device = MidiUI.deviceMaintainance.addDevice({
										uid: midis[i].getUniqueID(),
										name: midis[i].getName(),
										parentId: "midi-list-content",
										device: midis[i]
									});
									device.addEventHandler("activate", function(o){
										var sourceDeviceInfo = new midi.MIDIDeviceInfo();
										sourceDeviceInfo.deviceName = o.device.getName();
										sourceDeviceInfo.deviceID = o.device.getDeviceID();
										sourceDeviceInfo.deviceType = o.device.getType();
										
										var destDeviceInfo = new midi.MIDIDeviceInfo();
										destDeviceInfo.deviceName = midisynthInstance.getName();
										destDeviceInfo.deviceID = midisynthInstance.getDeviceID();
										destDeviceInfo.deviceType = midi.MIDI_DEVICE_SYNTHESIZER;
										midi.startStream(sourceDeviceInfo, destDeviceInfo);
									});
									device.addEventHandler("unactivate", function(o){
										
										var sourceDeviceInfo = new midi.MIDIDeviceInfo();
										sourceDeviceInfo.deviceName = o.device.getName();
										sourceDeviceInfo.deviceID = o.device.getDeviceID();
										sourceDeviceInfo.deviceType = o.device.getType();
										
										var destDeviceInfo = new midi.MIDIDeviceInfo();
										destDeviceInfo.deviceName = midisynthInstance.getName();
										destDeviceInfo.deviceID = midisynthInstance.getDeviceID();
										destDeviceInfo.deviceType = midi.MIDI_DEVICE_SYNTHESIZER;
										midi.stopStream(sourceDeviceInfo, destDeviceInfo);
									});
								}else{
									main.log("MidiUI.addEventHandler 2");
									MidiUI.addEventHandler("afterinit", function(o){
										var deviceInstance = midisynthInstance || this;
										var device = MidiUI.deviceMaintainance.addDevice({
											uid: deviceInstance.getUniqueID(),
											name: deviceInstance.getName(),
											parentId: "midi-list-content",
											device: deviceInstance
										});
										device.addEventHandler("activate", function(o){
																		
											var sourceDeviceInfo = new midi.MIDIDeviceInfo();
											sourceDeviceInfo.deviceName = o.device.getName();
											sourceDeviceInfo.deviceID = o.device.getDeviceID();
											sourceDeviceInfo.deviceType = o.device.getType();
											
											var destDeviceInfo = new midi.MIDIDeviceInfo();
											destDeviceInfo.deviceName = midisynthInstance.getName();
											destDeviceInfo.deviceID = midisynthInstance.getDeviceID();
											destDeviceInfo.deviceType = midi.MIDI_DEVICE_SYNTHESIZER;
											midi.startStream(sourceDeviceInfo, destDeviceInfo);
										});
										device.addEventHandler("unactivate", function(o){
											var sourceDeviceInfo = new midi.MIDIDeviceInfo();
											sourceDeviceInfo.deviceName = o.device.getName();
											sourceDeviceInfo.deviceID = o.device.getDeviceID();
											sourceDeviceInfo.deviceType = o.device.getType();
											
											var destDeviceInfo = new midi.MIDIDeviceInfo();
											destDeviceInfo.deviceName = midisynthInstance.getName();
											destDeviceInfo.deviceID = midisynthInstance.getDeviceID();
											destDeviceInfo.deviceType = midi.MIDI_DEVICE_SYNTHESIZER;
											midi.stopStream(sourceDeviceInfo, destDeviceInfo);
										});
									}, midis[i]);
								}
							}
						}
					});
				}
				break;
			}
			case midi.MGR_EVENT_DEV_DISCONNECT:
			{
                		var device = MidiUI.deviceMaintainance.getDeviceByUid(sParam.uniqueID);
				var index = MidiUI.deviceMaintainance.getIndex(device);
				var ol = MidiUI.deviceMaintainance.deviceList.length;
                		if (regDeviceUID == sParam.uniqueID) {   
					regDeviceUID = -1;
				}
                		MidiUI.deviceMaintainance.removeDevice(sParam.uniqueID);
				if(MidiUI.focus.currentFocus.me.id == "midi-list-content"){
					if(MidiUI.deviceMaintainance.deviceList.length == 0){
						MidiUI.focus.right();
					}else if(index == (ol - 1)){
						index = MidiUI.deviceMaintainance.deviceList.length -1;
						MidiUI.focus.moveToDeviceByIndex(index);
					}else{
						MidiUI.focus.moveToDeviceByIndex(index);
					}
				}
				break;
			}
			default:
			{
				break;
			}
		}
	}
}

$(document).ready(function(){
	MidiWidget.onLoad();
	MidiUI.addEventHandler("afterinit", function(){
		MidiUI.bankList.addEventHandler("selecteditem", function(i, o){
			if(i.value == "all"){
				MidiUI.programList.loadData(allProgramArr);
			}else{
				MidiUI.programList.loadData(sfData[i.value]);
			}
			var w = MidiUI.channelList.activeItem.value;
			selectProgramByChannel(MidiUI.channelList.activeItem.value);
		}, MidiUI);
		MidiUI.programList.addEventHandler("selecteditem", function(i, o){
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = MidiUI.channelList.activeItem.value;
	                evMsg.parameter = midi.MIDI_CC_BANK_SELECT_LSB;
			evMsg.value = Number(i.value.bankNum);
			var ret = midisynthInstance.sendMessage(evType, evMsg);
			var evType = midi.MIDI_EVENT_PROGRAM_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = MidiUI.channelList.activeItem.value;
			evMsg.parameter = 44;
			evMsg.value = Number(i.value.programNum);
			var ret = midisynthInstance.sendMessage(evType, evMsg);
		});
				
		this.midiPlay.activate = function(){
			var devInfo = new midi.MIDIDeviceInfo();
			devInfo.deviceName = "Midi/test.mid"; 
			devInfo.deviceID = 0;
			devInfo.deviceType = midi.MIDI_DEVICE_FILE;
			
			var destDeviceInfo = new midi.MIDIDeviceInfo();
			destDeviceInfo.deviceName = midisynthInstance.getName();
			destDeviceInfo.deviceID = midisynthInstance.getDeviceID();
			destDeviceInfo.deviceType = midi.MIDI_DEVICE_SYNTHESIZER;
			
			var delayPlay = function(){
				var ret =  midi.startStream(devInfo, destDeviceInfo);
				if (midi.MIDI_STREAM_STATUS_SUCCESS == ret){
					playFileStatus = main.Util.MIDI_PLAY_STATE_START;
					$("#play-status-text").text("Playing");
					$("#play-status-filename").text(main.filterFilename(devInfo.deviceName));
					MidiUI.midiPlay.button("option", "disabled", true);
					$("#helper-play").hide();
					MidiUI.midiStop.button("option", "disabled", false);
					$("#helper-stop").show();
					gStatusTimeId = window.setInterval(function() {
						ret =  midi.getFilePlayStatus();
						if (midi.MIDI_STREAM_STATUS_BUSY != ret) {
							window.clearInterval(gStatusTimeId);
							MidiUI.focus.right();
							MidiUI.midiStop.activate();
						}
						}, 500);
				} else {
					showAlertMsg("Error", "Failed to play the midi file [" + devInfo.deviceName + "]");
					$("#play-status-text").text("Stop");
					$("#play-status-filename").text("");
					MidiUI.midiPlay.button("option", "disabled", false);
					MidiUI.midiStop.button("option", "disabled", true);
				}
			};
			window.setTimeout(delayPlay, 100);
		};
		this.midiStop.activate = function(){
			MidiUI.midiStop.addClass("my-ui-state-focus");
			window.clearInterval(gStatusTimeId);
			if(playFileStatus == main.Util.MIDI_PLAY_STATE_START){
				var devInfo = new midi.MIDIDeviceInfo();
				devInfo.deviceName = "Midi/test.mid";
				devInfo.deviceID = 0;
				devInfo.deviceType = midi.MIDI_DEVICE_FILE;			
				var destDeviceInfo = new midi.MIDIDeviceInfo();
				destDeviceInfo.deviceName = midisynthInstance.getName();
				destDeviceInfo.deviceID = midisynthInstance.getDeviceID();
				destDeviceInfo.deviceType = midi.MIDI_DEVICE_SYNTHESIZER;		
				var ret =  midi.stopStream(devInfo, destDeviceInfo);
				playFileStatus = main.Util.MIDI_PLAY_STATE_STOP;
			}	
			window.setTimeout("MidiUI.midiStop.unactivate()", 100);
		};
		this.midiStop.unactivate = function(){
			MidiUI.focus.myControlRight = true;
			MidiUI.midiPlay.button("option", "disabled", false);
			$("#helper-play").show();
			MidiUI.midiStop.button("option", "disabled", true);
			$("#helper-stop").hide();
			$("#play-status-text").text("Stop");
			$("#play-status-filename").text("No file");
			MidiUI.focus.el.removeClass("focus-activate");
			MidiUI.midiStop.removeClass("my-ui-state-focus");
			
		};
		MidiUI.deviceMaintainance.addEventHandler("removedevice", function(o, v){
			if (MidiUI.focus.currentFocus.me.id == "midi-record-stop"){
				MidiUI.midiRecordStop.activate();
			}
		});
		MidiUI.volumeSlider.addEventHandler("change", function(o, v){
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = MidiUI.channelList.activeItem.value;
		        evMsg.parameter = midi.MIDI_CC_CHANNEL_VOLUME_MSB;
			evMsg.value = v;
			midisynthInstance.sendMessage(evType, evMsg);
		}, MidiUI);
		MidiUI.sustainSlider.addEventHandler("change", function(o, v){
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = MidiUI.channelList.activeItem.value;
			evMsg.parameter = midi.MIDI_CC_SUSTAIN;
			evMsg.value = v;
			midisynthInstance.sendMessage(evType, evMsg);
		}, MidiUI);
		
		MidiUI.panSlider.addEventHandler("change", function(o, v){
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = MidiUI.channelList.activeItem.value;
            		evMsg.parameter = midi.MIDI_CC_PAN_MSB;
			evMsg.value = v;
			midisynthInstance.sendMessage(evType, evMsg);
		}, MidiUI);
		
		MidiUI.balanceSlider.addEventHandler("change", function(o, v){
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = MidiUI.channelList.activeItem.value;
            		evMsg.parameter = midi.MIDI_CC_BALANCE_MSB; 
			evMsg.value = v;
			midisynthInstance.sendMessage(evType, evMsg);
		}, MidiUI);
		
		MidiUI.pitchbendSlider.addEventHandler("change", function(o, v){
			var evType = midi.MIDI_EVENT_PITCH_BEND;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = MidiUI.channelList.activeItem.value;
			evMsg.parameter = 44;
			evMsg.value = Number(v - MidiUI.pitchBend_default);
			var ret = midisynthInstance.sendMessage(evType, evMsg);
		});
		MidiUI.channelList.addEventHandler("selecteditem", function(i){
			var channel = Number(i.value);
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = channel;
            		evMsg.parameter = midi.MIDI_CC_CHANNEL_VOLUME_MSB;
			evMsg.value = 00; 
			var ret = midisynthInstance.getInformation(evType, evMsg);
			if(ret || ret == 0){
				MidiUI.volumeSlider.setValue(Number(ret), true);
			}
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = channel;
			evMsg.parameter = midi.MIDI_CC_SUSTAIN;
			evMsg.value = 00;
			var ret = midisynthInstance.getInformation(evType, evMsg);
			if(ret || ret == 0){
				MidiUI.sustainSlider.setValue(Number(ret), true);
			}
						
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = channel;
            		evMsg.parameter = midi.MIDI_CC_PAN_MSB; 
			evMsg.value = 00;
			var ret = midisynthInstance.getInformation(evType, evMsg);
			if(ret || ret == 0){
				MidiUI.panSlider.setValue(Number(ret), true);
			}
			
			var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = channel;
            		evMsg.parameter = midi.MIDI_CC_BALANCE_MSB; 
			evMsg.value = 00;
			var ret = midisynthInstance.getInformation(evType, evMsg);
			if(ret || ret == 0){
				MidiUI.balanceSlider.setValue(Number(ret), true);
			}
			selectBankByChannel(channel);
			selectProgramByChannel(channel);
			var evType = midi.MIDI_EVENT_PITCH_BEND;
			var evMsg = new midi.MIDIControlMessage();
			evMsg.channel = channel;
			evMsg.parameter = 00;
			evMsg.value = 00;
			var ret = midisynthInstance.getInformation(evType, evMsg);
			if(ret || ret == 0){
				MidiUI.pitchbendSlider.setValue(Number(ret), true);
			}
		}, MidiUI);
	}, MidiUI);
	MidiUI.init();
	$("body").keydown(function(e) {
		if(MidiUI.rendered){
			switch (e.keyCode) {
			case gTVKey.KEY_RED:
				allNoteOff();
				break;
			case gTVKey.KEY_GREEN:
				break;
			case gTVKey.KEY_YELLOW:
				resetAll();
				break;
			case gTVKey.KEY_BLUE:
				break;
			case gTVKey.KEY_DOWN:
				MidiUI.focus.down();
				break;
			case gTVKey.KEY_UP:
				MidiUI.focus.up();
				break;
			case gTVKey.KEY_ENTER:
				MidiUI.focus.enter();
				break;
			case gTVKey.KEY_RETURN:
				MidiUI.focus._return(e);
				break;
			case gTVKey.KEY_LEFT:
				MidiUI.focus.left();
				break;
			case gTVKey.KEY_RIGHT:
				MidiUI.focus.right();
				break;
			case gTVKey.KEY_CH_UP:
				MidiUI.pitchbendSlider.increase();
				break;
			case gTVKey.KEY_CH_DOWN:
				MidiUI.pitchbendSlider.decrease();
				break;
			case gTVKey.KEY_PLAY:
				playMid();
				break;
			case gTVKey.KEY_STOP:
				stopMid();
				break;
			default:
				break;
			}
		}
	});
	$("body").unload(function(){
		MidiUI.deviceMaintainance.destroy();
		MidiUI.keyboard.destroy();
		MidiUI.midiStop.activate();
	});
});

var getChannelVolume = function(i){
	var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
	var evMsg = new midi.MIDIControlMessage();
	evMsg.channel = i;
    	evMsg.parameter = midi.MIDI_CC_CHANNEL_VOLUME_MSB;
	evMsg.value = 00; 
	var ret = midisynthInstance.getInformation(evType, evMsg);
};

var setChannelVolume = function(i){
	var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
	var evMsg = new midi.MIDIControlMessage();
	evMsg.channel = i;
    	evMsg.parameter = midi.MIDI_CC_CHANNEL_VOLUME_MSB;
	evMsg.value = 14;
	var ret = midisynthInstance.sendMessage(evType, evMsg);
};

var setSound = function(i){
	i = i + (MidiUI.baseOctave - 1) * 12;
	if(i < 0 || i > 127){
		return;
	}
	var value = 120; //velocity
	var evType = midi.MIDI_EVENT_NOTE_ON;
	var evMsg = new midi.MIDIVoiceMessage();
	evMsg.channel = MidiUI.channelList.activeItem.value;
	evMsg.note = i;
	evMsg.velocity = value;
	evMsg.duration = 200;
	midisynthInstance.sendMessage(evType, evMsg);
};

var cancelSound = function(i){
	i = i + (MidiUI.baseOctave - 1) * 12;
	if(i < 0 || i > 127){
		return;
	}
	var evType = midi.MIDI_EVENT_NOTE_OFF;
	var evMsg = new midi.MIDIVoiceMessage();
	evMsg.channel = MidiUI.channelList.activeItem.value;
	evMsg.note = i;
	evMsg.velocity = 120;
	evMsg.duration = 200;
	midisynthInstance.sendMessage(evType, evMsg);
};

var selectBankByChannel = function(c){
	var channel = Number(c);
	var evType = midi.MIDI_EVENT_PROGRAM_CHANGE;
	var evMsg = new midi.MIDIControlMessage();
	evMsg.channel = channel;
	evMsg.parameter = 00;
	evMsg.value = 00;
	var ret = midisynthInstance.getInformation(evType, evMsg);
	var arr = ret.split(":");
	if(ret && MidiUI.bankList.dataList){
		var flag = false;
		for(var i = 0; i < MidiUI.bankList.dataList.length; i++){
			if(MidiUI.bankList.dataList[i].value == arr[1]){
				MidiUI.bankList.listIndex = i;
				MidiUI.bankList.selectedItem();
				flag = true;
				MidiUI.paraValueBank.text("Bank "+arr[1]);
				break;
			}
		}
		if(!flag){
			MidiUI.bankList.listIndex = 0;
			MidiUI.bankList.selectedItem();
		}
	}
};

var selectProgramByChannel = function(c){
	var channel = Number(c);
	var evType = midi.MIDI_EVENT_PROGRAM_CHANGE;
	var evMsg = new midi.MIDIControlMessage();
	evMsg.channel = channel;
	evMsg.parameter = 00;
	evMsg.value = 00; 
	var ret = midisynthInstance.getInformation(evType, evMsg);
	var arr = ret.split(":");
	if(ret){
		MidiUI.programList.selectedItemByFn(function(v, o){
			if(v.value.programNum == arr[2] && v.value.bankNum == arr[1]){
				MidiUI.paraValueProgram.text(v.value.programName+":"+v.value.bankNum+":"+v.value.programNum);
				return true;
			}
			return false;
		});
		
	}
};

var readSFFile = function(id){
	var f = true, arr = [], v = 0, b = 45;
	while(f){
		var tempArr = midisynthInstance.getSoundFontInstruments(id, v*b, 45);
		arr = arr.concat(tempArr);
		if(tempArr.length == 45){
			v++;
		}else{
			f = false;
		}
	}
	
	for (var i = 0; i < arr.length; i++){
		var temp = arr[i].split(" ");
		if (temp[1].length >18){
			arr[i] = temp[0] + " " + temp[1].substring(0,15) + "...";
		}
	}
	return arr;
};

var showAlertMsg = function(tl, tx) {
	if (!MidiUI.alertMsg){
		MidiUI.alertMsg = new main.MessageBox({
			title: "Error",
			text: "Undefined error.",
			buttons: {
				"OK(Enter)": function(){},
				"Return": function(){}
			}
		});
		MidiUI.alertMsg.addEventHandler("open", function(){
			MidiUI.focus.block = true;
			gAlertMsg = MidiUI.alertMsg;
		});
		MidiUI.alertMsg.addEventHandler("close", function(){
			MidiUI.focus.block = false;
			gAlertMsg = null;
		});
	}
	if (tl){
		MidiUI.alertMsg.setTitle(tl);
	}
	if (tx){
		MidiUI.alertMsg.setText(tx);
	}
	
	var handler = function(key){
		switch(key){
			case "enter":
			case "return":
				MidiUI.alertMsg.close();
				MidiUI.focus.removeEventHandler("block", handler);
				break;
			default:
				break;
		}
	};
	MidiUI.focus.addEventHandler("block", handler);
	MidiUI.alertMsg.open();
};

var resetAll = function(){
	if (gAlertMsg != null){
		return;
	}
	if(!MidiUI.resetMsg){
		MidiUI.resetMsg = new main.MessageBox({
			title: "Reset all ?",
			text: "Are you sure to reset all changed parameters to the default value?",
			buttons: {
				"OK(Enter)": function(){},
				"Return": function(){}
			}
		});
		MidiUI.resetMsg.addEventHandler("open", function(){
			MidiUI.focus.block = true;
		});
		MidiUI.resetMsg.addEventHandler("close", function(){
			MidiUI.focus.block = false;
		});
	}
	var reset = function(){
		var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
		var evMsg = new midi.MIDIControlMessage();
		evMsg.channel = MidiUI.channelList.activeItem.value;
		evMsg.parameter = midi.MIDI_CC_RESET_CONTROLLER;
		evMsg.value = 0;
		evMsg.extra = "1";
		var ret = midisynthInstance.sendMessage(evType, evMsg);
		MidiUI.channelList.listIndex = 0;
		MidiUI.channelList.selectedItem();
	};
	
	var handler = function(key){
		switch(key){
			case "enter":
				reset();
				MidiUI.resetMsg.close();
				MidiUI.focus.removeEventHandler("block", handler);
				break;
			case "return":
				MidiUI.resetMsg.close();
				MidiUI.focus.removeEventHandler("block", handler);
				break;
			default:
				break;
		}
	};
	MidiUI.focus.addEventHandler("block", handler);
	MidiUI.resetMsg.open();
};

var playMid = function(){
	var s = MidiUI.midiPlay.button("option", "disabled");
	if (!s) {
		MidiUI.midiPlay.activate();
	} 
};

var stopMid = function(){
	var s = MidiUI.midiStop.button("option", "disabled");
	if (!s){
		MidiUI.midiStop.activate();
	}
};

var callBackFunction = function(e) {
    	var msg = e.eventData;
	var currChannel = MidiUI.channelList.activeItem.value;

	if (currChannel != msg.channel) {
		return;
	}
	
	
	switch(e.eventType) {
		case midi.MIDI_EVENT_NOTE_ON:
		{
			while (msg.note < ((MidiUI.baseOctave - 1) * 12)) {
				MidiUI.baseOctave--;
			}
			while (msg.note >= ((MidiUI.baseOctave + 3) * 12)) {
				MidiUI.baseOctave++;
			}
			$("#octaveMin").text(""+MidiUI.baseOctave);
			$("#octaveMax").text("" + (MidiUI.baseOctave + 3));
			
			MidiUI.keyboard.pressKey(msg.note - (MidiUI.baseOctave - 1) * 12);
			break;
		}
			
		case midi.MIDI_EVENT_NOTE_OFF:
		{

			MidiUI.keyboard.releaseKey(msg.note - (MidiUI.baseOctave - 1) * 12);

			break;
		}
		case midi.MIDI_EVENT_CONTROL_CHANGE:
		{
            		if (msg.parameter == midi.MIDI_CC_CHANNEL_VOLUME_MSB){
				MidiUI.volumeSlider.setValue(Number(msg.value), true);
            		} else if (msg.parameter == midi.MIDI_CC_BALANCE_MSB) {
				MidiUI.balanceSlider.setValue(Number(msg.value), true);
			} else if (msg.parameter == midi.MIDI_CC_SUSTAIN) {
				MidiUI.sustainSlider.setValue(Number(msg.value), true);
            		} else if (msg.parameter == midi.MIDI_CC_PAN_MSB) {
				MidiUI.panSlider.setValue(Number(msg.value), true);
			} 
			break;
		}
		case midi.MIDI_EVENT_PROGRAM_CHANGE:
		{
			break;
		}
		case midi.MIDI_EVENT_CHANNEL_PRESSURE:
		{
			break;
		}
		case midi.MIDI_EVENT_PITCH_BEND:
		{
			MidiUI.pitchbendSlider.setValue(Number(msg.value) + MidiUI.pitchBend_default, true);
	
			break;
		}
		
		default:
			break;
	}
};

var allNoteOff = function(){
	var evType = midi.MIDI_EVENT_CONTROL_CHANGE;
	var evMsg = new midi.MIDIControlMessage();
	evMsg.parameter = midi.MIDI_CC_ALL_NOTE_OFF;
	var ret = midisynthInstance.sendMessage(evType, evMsg);
	$("body").mouseup();
};

}catch(e){
	main.log("main error--- " + e.name + " : " + e.message);
}
