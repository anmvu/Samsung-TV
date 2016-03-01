//var gamepad = window.deviceapis.gamepad || {};
var gamepad = window.webapis.gamepad || {};

var MAX_NUM_GAMEPAD = 2;
var STATUS_NORMAL = 1;
var STATUS_MULTI  = 2;
var STATUS_CALLBACK = 3;

var Main = {
	oWidgetAPI: null,
	oTVKey: null,
	
	nInterval: 5, //5ms

	oGamepad: new Array(MAX_NUM_GAMEPAD),
	bForceFeedback: new Array(MAX_NUM_GAMEPAD),
	nGamepadStatus: new Array(MAX_NUM_GAMEPAD),
	
	bRegisterCB: false,
};


Main.onLoad = function () {
	alert("[Gamepad]: onLoad()");

	Main.oWidgetAPI = new Common.API.Widget();	//	Create Common module 
	Main.oTVKey = new Common.API.TVKeyValue();

	Main.oWidgetAPI.sendReadyEvent();			//	Send ready message to Application Manager

	Main.resetInfo();

	return;
};


Main.onUnLoad = function () {
	alert("[Gamepad]: onUnLoad()");
};


Main.keyDown = function () {
	var keyCode = event.keyCode;

	switch (keyCode) {
		case Main.oTVKey.KEY_RED:
			Main.resetInfo();
			gamepad.getGamepads(Main.onGamepadObtained);
			if (Main.bRegisterCB == false) {
				gamepad.registerManagerCallback(Main.onEventGamepadManager);
				Main.bRegisterCB = true;
			}
			break;

		case Main.oTVKey.KEY_GREEN:
			Main.resetInfo();
			break;

		case Main.oTVKey.KEY_YELLOW:
			for (var i = 0; i < MAX_NUM_GAMEPAD; i++) {        	
				Main.getABSValueRange(i);
			}
			break;

		default:
			break;
	}
	
	return;
};


Main.resetInfo = function () {
	document.getElementById("txtName0").innerHTML = "-";
	document.getElementById("txtName1").innerHTML = "-";
	
	document.getElementById("txtEvent0").innerHTML = "-";
	document.getElementById("txtEvent1").innerHTML = "-";
	
	document.getElementById("txtAlert0").innerHTML = "-";
	document.getElementById("txtAlert1").innerHTML = "-";
	
	document.getElementById("txtMode0").innerHTML = "-";
	document.getElementById("txtMode1").innerHTML = "-";
	
	for (var i = 0; i < MAX_NUM_GAMEPAD; i++) {
		Main.oGamepad[i] = null;
		Main.bForceFeedback[i] = false;
		Main.nGamepadStatus[i] = 0;
	}
	
	return;
};


Main.onGamepadObtained = function (gamepads) {
	if (gamepads.length > 0) {
		alert("[Gamepad]: found " + gamepads.length + " gamepads");
		
		for (var i = 0; i < gamepads.length; i++) {
			var txtNameID = "txtName" + i;
			var txtAlertID = "txtAlert" + i;
			var txtModeID = "txtMode" + i;

			if (gamepads[i] != null) {
				Main.oGamepad[i] = gamepads[i];
				Main.oGamepad[i].registerDeviceCallback(Main.onEventGamepad);
				Main.bForceFeedback[i] = Main.oGamepad[i].isForceFeedbackSupported();
				document.getElementById(txtNameID).innerHTML = Main.oGamepad[i].getName();
				if (Main.bForceFeedback[i] == true) {
					document.getElementById(txtAlertID).innerHTML = "Force Feedback Rumble Effect : Supported.";
				} else {
					document.getElementById(txtAlertID).innerHTML = "Force Feedback Rumble Effect : NOT Supported.";
				}
				Main.nGamepadStatus[i] = STATUS_NORMAL;
				document.getElementById(txtModeID).innerHTML = "NORMAL STATE";
				Main.getABSValueRange(i);
				Main.handleInputEvent(i);
			}
		}
	} else {
		alert("[Gamepad]: no gamepads found");
	}
	
	return;
};


Main.onEventGamepadManager = function (devEvInfo) {
	alert("[Gamepad]: onEventGamepadManager()");

	switch (devEvInfo.eventType) {
		case gamepad.MGR_EVENT_DEV_DISCONNECT:
			for (var i = 0; i < MAX_NUM_GAMEPAD; i++) {
				if (Main.oGamepad[i] != null) {
					alert(" >>>>>>>>>> " + i);
					alert(" >>>>>>>>>> " + devEvInfo.name);
					alert(" >>>>>>>>>> " + devEvInfo.UID);

					if (Main.oGamepad[i].getUniqueID() == devEvInfo.UID) {
						var txtNameID  = "txtName" + i;
						var txtEventID = "txtEvent" + i;
						var txtAlertID = "txtAlert" + i;
						var txtModeID = "txtMode" + i;

						document.getElementById(txtNameID).innerHTML  = "-";
						document.getElementById(txtEventID).innerHTML = "-";
						document.getElementById(txtAlertID).innerHTML = "-";
						document.getElementById(txtModeID).innerHTML = "-";

						Main.oGamepad[i] = null;

						Main.bForceFeedback[i] = false;
						Main.nGamepadStatus[i] = 0;
					}
				}
			}
			break;

		default:
			break;
	}
	
	return;
};


Main.onEventGamepad = function (index, inputEvent) {
	var txtEventID = "txtEvent" + index;

	if (inputEvent != null) {
		/*
		alert("");
		alert("[Gamepad]: [" + index + "] Type  = " + inputEvent.type);
		alert("[Gamepad]: [" + index + "] Code  = " + inputEvent.code);
		alert("[Gamepad]: [" + index + "] Value = " + inputEvent.value);
		alert("");
		*/

		Main.showEventString(index, inputEvent.time, inputEvent.type, inputEvent.code, inputEvent.value, false);
		Main.processSpecificEvent(index, inputEvent.time, inputEvent.type, inputEvent.code, inputEvent.value);
	} else {
		document.getElementById(txtEventID).innerHTML = "-";
	}
	
	return;
};


Main.handleInputEvent = function (index) {
	var txtEventID = "txtEvent" + index;
	var funcName = "Main.handleInputEvent(" + index + ")";

	if (Main.oGamepad[index] != null) {
		var inputEvent = Main.oGamepad[index].getInputEvent();

		if (inputEvent != null) {
			/*
			alert("");
			alert("[Gamepad]: [" + index + "] Type  = " + inputEvent.type);
			alert("[Gamepad]: [" + index + "] Code  = " + inputEvent.code);
			alert("[Gamepad]: [" + index + "] Value = " + inputEvent.value);
			alert("");
			*/

			Main.showEventString(index, inputEvent.time, inputEvent.type, inputEvent.code, inputEvent.value, false);

			Main.processSpecificEvent(index, inputEvent.time, inputEvent.type, inputEvent.code, inputEvent.value);
		}

		if (Main.nGamepadStatus[index] != STATUS_NORMAL) {
			alert("[Gamepad]: Stop handleInputEvent(" + index + ")");
		} else {
			setTimeout(funcName, Main.nInterval);
		}
	} else {
		document.getElementById(txtEventID).innerHTML = "-";
	}

	return;
};


Main.handleMultiInputEvents = function (index) {
	var txtEventID = "txtEvent" + index;
	var funcName = "Main.handleMultiInputEvents(" + index + ")";

	if (Main.oGamepad[index] != null) {
		//event count : 5
		var inputEventArray = Main.oGamepad[index].getInputEventEx(5);

		if (inputEventArray != null) {
			//alert("inputEventArray[0] : " + inputEventArray[0]);
			
			var evCnt = inputEventArray[0];
			var bContinue = false;

			for (var i = 0; i < evCnt; i++) {
				if (i == 0) {
					bContinue = false;
				} else {
					bContinue = true;
				}
				Main.showEventString(index, inputEventArray[i+1].time, inputEventArray[i+1].type, inputEventArray[i+1].code, inputEventArray[i+1].value, bContinue);
				Main.processSpecificEvent(index, inputEventArray[i+1].time, inputEventArray[i+1].type, inputEventArray[i+1].code, inputEventArray[i+1].value);
			}
		}

		if (Main.nGamepadStatus[index] != STATUS_MULTI) {
			alert("[Controller] Stop handleMultiInputEvents(" + index + ")");
		} else {
			setTimeout(funcName, Main.nInterval);
		}
	} else {
		document.getElementById(txtEventID).innerHTML = "-";
	}

	return;
};


Main.getABSValueRange = function (index) {
	if (Main.oGamepad[index] != null) {
		alert("");
		alert("-------------------------------------------");        
		alert(" ABS Value Range");
		alert("-------------------------------------------");
		alert(" Gamepad Name : " + Main.oGamepad[index].getName());
		alert("-------------------------------------------");

		for (var i = 0; i < gamepad.ABS_HAT3Y; i++) {
			var range = Main.oGamepad[index].getABSValueRange(i);

			if (range != null) {
				Main.showABSRangeString(index, i, range.maxValue, range.minValue);
			}
		}

		alert("-------------------------------------------");
		alert("");
	}

	return;
};


Main.processSpecificEvent = function (index, evTime, evType, evCode, evValue) {
	if ((evType == gamepad.EV_KEY) && (evValue == gamepad.KEY_PRESSED)) {
		if (evCode == gamepad.BTN_4) {
			if (Main.nGamepadStatus[index] != STATUS_CALLBACK) {
				if (Main.oGamepad[index].setActive() == true) {
					alert("[Gamepad]: Set Active!")

					Main.nGamepadStatus[index] = STATUS_CALLBACK;
					var txtModeID = "txtMode" + index;
					document.getElementById(txtModeID).innerHTML = "CALLBACK STATE";
					
					return;
				}
			}
		} else if (evCode == gamepad.BTN_3) {
			if (Main.nGamepadStatus[index] != STATUS_MULTI) {
				if (Main.nGamepadStatus[index] == STATUS_CALLBACK) {
					alert("[Gamepad]: Gamepad is active, now");

					Main.oGamepad[index].setInactive();

					alert("[Gamepad]: Set Inactive!");
				}
                
                Main.nGamepadStatus[index] = STATUS_MULTI;
                
                var txtModeID = "txtMode" + index;
                
                document.getElementById(txtModeID).innerHTML = "MULTI-EVENT STATE";
                                
                alert("[Gamepad]: Pooling with handleMultiInputEvents()");
                
                var funcName = "Main.handleMultiInputEvents(" + index + ")";
                
                setTimeout(funcName, Main.nInterval);
                
                return;
            }
        }
        else if (evCode == gamepad.BTN_1)
        {
            if (Main.bForceFeedback[index] == true)
            {
            	if (Main.oGamepad[index].playForceFeedback() == false)
                {
                	alert("[Gamepad]: ERROR! playForceFeedback()");
                }
                
                return;
            }
        }
        else if (evCode == gamepad.BTN_2)
        {
            if (Main.bForceFeedback[index] == true)
            {
            	if (Main.oGamepad[index].stopForceFeedback() == false)
                {
                	alert("[Gamepad]: ERROR! stopForceFeedback()");
                }
            }
            
            if (Main.nGamepadStatus[index] != STATUS_NORMAL)
            {
            	if (Main.nGamepadStatus[index] == STATUS_CALLBACK)
            	{
            		alert("[Gamepad]: Controller is active, now");
            		
	                Main.oGamepad[index].setInactive();
	                
	                alert("[Gamepad]: Set Inactive!");
				}
				                
               Main.nGamepadStatus[index] = STATUS_NORMAL;

				var txtModeID = "txtMode" + index;
                
                document.getElementById(txtModeID).innerHTML = "NORMAL STATE";                
                
                alert("[Gamepad]: Pooling with handleInputEvent()");
                
                var funcName = "Main.handleInputEvent(" + index + ")";
                
                setTimeout(funcName, Main.nInterval);
            }
            
            return;
        }
    }
    
    return;
}

Main.showEventString = function(index, evTime, evType, evCode, evValue, bContinue)
{
    var txtEventID = "txtEvent" + index;

    var typeStr;
    var codeStr;
    
	switch (evType)
    {
    	case gamepad.EV_KEY:
        	typeStr = "KEY";
            
            switch (evCode)
            {
            	case gamepad.BTN_1:
                	codeStr = "BTN_1";
                	break;
                    
            	case gamepad.BTN_2:
                	codeStr = "BTN_2";
                	break;
                    
            	case gamepad.BTN_3:
                	codeStr = "BTN_3";
                	break;
                    
            	case gamepad.BTN_4:
                	codeStr = "BTN_4";
                	break;
                    
            	case gamepad.BTN_5:
                	codeStr = "BTN_5";
                	break;
                    
            	case gamepad.BTN_6:
                	codeStr = "BTN_6";
                	break;
                    
            	case gamepad.BTN_7:
                	codeStr = "BTN_7";
                	break;
                    
            	case gamepad.BTN_8:
                	codeStr = "BTN_8";
                	break;
                    
            	case gamepad.BTN_9:
                	codeStr = "BTN_9";
                	break;
                    
            	case gamepad.BTN_10:
                	codeStr = "BTN_10";
                	break;

            	case gamepad.BTN_11:
                	codeStr = "BTN_11";
                	break;

            	case gamepad.BTN_12:
                	codeStr = "BTN_12";
                	break;

            	case gamepad.BTN_13:
                	codeStr = "BTN_13";
                	break;

            	case gamepad.BTN_14:
                	codeStr = "BTN_14";
                	break;
                
            	case gamepad.BTN_15:
                	codeStr = "BTN_15";
                	break;
                
            	case gamepad.BTN_16:
                	codeStr = "BTN_16";
                	break;
                    
            	default:
                    codeStr = evCode;
                	break;
            }
            
        	break;
            
    	case gamepad.EV_ABS:
        	typeStr = "ABS";
            
            switch( evCode )
            {
            	case gamepad.ABS_X:
                	codeStr = "ABS_X";
                	break;
                    
            	case gamepad.ABS_Y:
                	codeStr = "ABS_Y";
                	break;
                
                case gamepad.ABS_Z:
                	codeStr = "ABS_Z";
                	break;
                    
            	case gamepad.ABS_RX:
                	codeStr = "ABS_RX";
                	break;
                    
            	case gamepad.ABS_RY:
                	codeStr = "ABS_RY";
                	break;
                	
            	case gamepad.ABS_RZ:
                	codeStr = "ABS_RZ";
                	break;
                    
            	case gamepad.ABS_THROTTLE:
                	codeStr = "ABS_THROTTLE";
                	break;
                    
            	case gamepad.ABS_RUDDER:
                	codeStr = "ABS_RUDDER";
                	break;
                	
            	case gamepad.ABS_WHEEL:
                	codeStr = "ABS_WHEEL";
                	break;
                	
            	case gamepad.ABS_GAS:
                	codeStr = "ABS_GAS";
                	break;
                	
            	case gamepad.ABS_BRAKE:
                	codeStr = "ABS_BRAKE";
                	break;
                	
            	case gamepad.ABS_HAT0X:
                	codeStr = "ABS_HAT0X";
                	break;
                    
            	case gamepad.ABS_HAT0Y:
                	codeStr = "ABS_HAT0Y";
                	break;
                    
            	case gamepad.ABS_HAT1X:
                	codeStr = "ABS_HAT1X";
                	break;
                    
            	case gamepad.ABS_HAT1Y:
                	codeStr = "ABS_HAT1Y";
                	break;
                    
            	case gamepad.ABS_HAT2X:
                	codeStr = "ABS_HAT2X";
                	break;
                    
            	case gamepad.ABS_HAT2Y:
                	codeStr = "ABS_HAT2Y";
                	break;
                    
            	case gamepad.ABS_HAT3X:
                	codeStr = "ABS_HAT3X";
                	break;
                    
            	case gamepad.ABS_HAT3Y:
                	codeStr = "ABS_HAT3Y";
                	break;
                	
            	default:
                    codeStr = evCode;
                	break;
            }
            
        	break;
            
    	default:
            evTime = "?";
        	typeStr = "Unknown Type";
        	codeStr = "?";
        	evValue = "?";
        	break;
    }

    if (bContinue == false)
    {
    	document.getElementById(txtEventID).innerHTML = "Time=[" + evTime + "]"
                                                                    + " Type=[" + typeStr + "]"
                                                                    + " Code=[" + codeStr + "]"
                                                                    + " Value=[" + evValue + "]";
    }
    else
    {
    	document.getElementById(txtEventID).innerHTML += "<BR>"+"Time=[" + evTime + "]"
                                                                    + " Type=[" + typeStr + "]"
                                                                    + " Code=[" + codeStr + "]"
                                                                    + " Value=[" + evValue + "]";
    }

    return;
}

Main.showABSRangeString = function(index, code, max, min)
{
    var codeStr;
    
    switch (code)
    {
    	case gamepad.ABS_X:
        	codeStr = "ABS_X";
        	break;
            
    	case gamepad.ABS_Y:
        	codeStr = "ABS_Y";
        	break;
        
        case gamepad.ABS_Z:
        	codeStr = "ABS_Z";
        	break;
            
    	case gamepad.ABS_RX:
        	codeStr = "ABS_RX";
        	break;
            
    	case gamepad.ABS_RY:
        	codeStr = "ABS_RY";
        	break;
        	
    	case gamepad.ABS_RZ:
        	codeStr = "ABS_RZ";
        	break;
            
    	case gamepad.ABS_THROTTLE:
        	codeStr = "ABS_THROTTLE";
        	break;
            
    	case gamepad.ABS_RUDDER:
        	codeStr = "ABS_RUDDER";
        	break;
        	
    	case gamepad.ABS_WHEEL:
        	codeStr = "ABS_WHEEL";
        	break;
        	
    	case gamepad.ABS_GAS:
        	codeStr = "ABS_GAS";
        	break;
        	
    	case gamepad.ABS_BRAKE:
        	codeStr = "ABS_BRAKE";
        	break;
        	
    	case gamepad.ABS_HAT0X:
        	codeStr = "ABS_HAT0X";
        	break;
            
    	case gamepad.ABS_HAT0Y:
        	codeStr = "ABS_HAT0Y";
        	break;
            
    	case gamepad.ABS_HAT1X:
        	codeStr = "ABS_HAT1X";
        	break;
            
    	case gamepad.ABS_HAT1Y:
        	codeStr = "ABS_HAT1Y";
        	break;
            
    	case gamepad.ABS_HAT2X:
        	codeStr = "ABS_HAT2X";
        	break;
            
    	case gamepad.ABS_HAT2Y:
        	codeStr = "ABS_HAT2Y";
        	break;
            
    	case gamepad.ABS_HAT3X:
        	codeStr = "ABS_HAT3X";
        	break;
            
    	case gamepad.ABS_HAT3Y:
        	codeStr = "ABS_HAT3Y";
        	break;
        	
    	default:
            codeStr = code;
        	break;
    }
    
    alert(" Code=[" + codeStr + "], " + "Max=[" + max + "], " + "Min=[" + min + "]");
    
    return;
}

