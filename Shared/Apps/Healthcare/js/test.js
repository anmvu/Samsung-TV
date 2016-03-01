var healthcaredevice = window.webapis.healthcaredevice || {};

var gWidgetAPI;
var gTVKey;
var healthcareDeviceArray = new Array;
var samsung_bar = null;

var Main = {
    statusCommand :0,
    statusSearched : 1,
    statusConnected : 2,
    status : 0,
    currentPosition :-1,
};

Main.onLoad = function()
{
	alert("[Test]: Tutorial_onLoad()");

	var nDevNum = 0;

	gWidgetAPI = new Common.API.Widget();	//	Create Common module 
	gTVKey = new Common.API.TVKeyValue();
	gWidgetAPI.sendReadyEvent();			//	Send ready message to Application Manager 
    healthcaredevice.registerManagerCallback(Main.onManagerCallback);

    var table = document.getElementById("TableCommand");
    var row = table.insertRow(1);
    row.bgColor="#FFFFFF";
    var td1 = row.insertCell(0);
    td1.innerHTML = "searchDevices";
    row = table.insertRow(2);
    row.bgColor="#FFFFFF";
    td1 = row.insertCell(0);
    td1.innerHTML = "getHealthcareDevices";

    samsung_bar = document.getElementById("samsung_navigation_bar"); 
    styles = {"visibility":"visible", "width":490 + "px", //change for memory game
                "height": 30 + "px", "position":"absolute",
                "top":502+ "px", //SISC Change
                "left":450 + "px", //SISC Change
                "backgroundColor": "#2768b6",
                "textAlign": "right",
                "verticalAlign":"center",
                "color" : "#FFFFFF",
                "paddingTop":"2px",
                "paddingBottom":"0px",
                "paddingRight":"50px",//20, //change for memory game
                "outline":1,
                "outlineColor":"#FFFFFF",
                "outlineStyle":"solid",
                "outlineWidth":"1px"}
    for (var property in styles)
    {
        samsung_bar.style[property] = styles[property];
    }
    this.addButton("UPDOWN");
//    Main.addButton("UPDOWN");
}

Main.addButton = function(button)
{
    switch(button){
        case "UPDOWN":
          samsung_bar.innerHTML = "<img src='"+"image/help_ud.png' style='vertical-align:-45%;'>" +" "+ "move";
        break;
        case "COMMAND":
        {
            this.clear();    
            this.status = this.statusCommand;
            var table = document.getElementById("TableCommand");
            table.rows[this.currentPosition+1].bgColor="#00FFFF";
            samsung_bar.innerHTML = "<img src='"+"image/help_ud.png' style='vertical-align:-45%;'>" +" "+ "move";
            samsung_bar.innerHTML += " " + "<img src='"+"image/help_enter.png'  style='vertical-align:-45%;'>" +" "+ "execute command";
            samsung_bar.innerHTML += " " + "<img src='"+"image/help_red.png'  style='vertical-align:-45%;'>" +" "+ "clear results";
        }
        break;
        case "SEARCHED":
        {
            this.clear();    
            this.status = this.statusSearched;
            var table = document.getElementById("TableSearched");
            table.rows[this.currentPosition+1].bgColor="#00FFFF";
            samsung_bar.innerHTML = "<img src='"+"image/help_move.png' style='vertical-align:-45%;'>" +" "+ "move";
            samsung_bar.innerHTML += " " + "<img src='"+"image/help_red.png'  style='vertical-align:-45%;'>" +" "+ "clear results";
            samsung_bar.innerHTML += " " + "<img src='"+"image/help_green.png' style='vertical-align:-45%;'>" +" "+ "connect";
        }
        break;
        case "CONNECTED":
        {
            this.clear();    
            this.status = this.statusConnected;
            var table = document.getElementById("TableConnected");
            table.rows[this.currentPosition+1].bgColor="#00FFFF";
            samsung_bar.innerHTML = "<img src='"+"image/help_move.png' style='vertical-align:-45%;'>" +" "+ "move";
            samsung_bar.innerHTML += " " + "<img src='"+"image/help_enter.png' style='vertical-align:-45%;'>"  +" "+ "register";
            samsung_bar.innerHTML += " " + "<img src='"+"image/help_red.png'  style='vertical-align:-45%;'>" +" "+ "clear results";
            samsung_bar.innerHTML += " " + "<img src='"+"image/help_green.png' style='vertical-align:-45%;'>"  +" "+ "disconnect";
        }
        break;
    }
}

Main.onUnLoad = function()
{
    alert("[Test]: Tutorial_onUnload()");
}

Main.keyDown = function()
{
	var keyCode = event.keyCode;
    
	switch(keyCode)
	{
		case gTVKey.KEY_ENTER:
		{
		    switch(this.status)
		    {
		        case this.statusCommand:
		        {
    		        switch(this.currentPosition)
    		        {
        		        case 0:
        		        {
                         	Main.deleteDevicesOnTable("TableSearched");
        		            healthcaredevice.searchDevices();
        		            break;
        		        }
        		        case 1:
        		        {
        		            healthcaredevice.getHealthcareDevices(Main.onHealthcareDevicesObtained);
        		            break;
        		        }
    		        }
                    Main.deleteResultsOnTable();
		            break;
		        }
		        case this.statusConnected:
		        {
                	var table = document.getElementById("TableConnected");
                    if(table.rows[this.currentPosition+1].cells[3].innerHTML!="registered")
                    {
    		            healthcareDeviceArray[this.currentPosition].registerDeviceCallback(Main.onDeviceCallback);
    	                table.rows[this.currentPosition+1].cells[3].innerHTML = "registered"
    	            }
    	            else
    	            {
    		            healthcareDeviceArray[this.currentPosition].registerDeviceCallback(null);
    	                table.rows[this.currentPosition+1].cells[3].innerHTML = ""
    	            }
		            break;
		        }
		    }
            break;
		}
		case gTVKey.KEY_GREEN:
		{
		    switch(this.status)
		    {
		        case this.statusSearched:
		        {
                	var table = document.getElementById("TableSearched");
                    healthcaredevice.connectDevice(table.rows[this.currentPosition+1].cells[2].innerHTML);
		            break;
		        }
		        case this.statusConnected:
		        {
                	var table = document.getElementById("TableConnected");
                    healthcaredevice.disconnectDevice(healthcareDeviceArray[this.currentPosition].getUniqueID());
		            break;
		        }
		    }
		    break;
		}
		case gTVKey.KEY_RED:
		{
            Main.deleteResultsOnTable();
            break;
		}
		case gTVKey.KEY_UP:
		case gTVKey.KEY_DOWN:
		case gTVKey.KEY_LEFT:
		case gTVKey.KEY_RIGHT:
		{
            this.changePosition(keyCode);
            break;
		}
	}
}

Main.changePosition = function(keyCode)
{
    switch(this.status)
    {
        case this.statusCommand:
            switch(keyCode)
            {
                case gTVKey.KEY_UP:
                    if(this.currentPosition>0)
                    {
                        this.currentPosition--;
                        this.addButton("COMMAND");
                    }
                    break;
                case gTVKey.KEY_DOWN:
                    var table = document.getElementById("TableCommand");
                    if(this.currentPosition<table.rows.length-2)
                    {
                        this.currentPosition++;
                        this.addButton("COMMAND");
                    }
                    else
                    {
                        var table = document.getElementById("TableSearched");
                        if(table.rows.length>1)
                        {
                            this.currentPosition=0;
                            this.addButton("SEARCHED");
                        }
                        else
                        {
                            table = document.getElementById("TableConnected");
                            if(table.rows.length>1)
                            {
                                this.currentPosition=0;
                                this.addButton("CONNECTED");
                            }
                        }
                    }
                    break;
            }
            break;
        case this.statusSearched:
            switch(keyCode)
            {
                case gTVKey.KEY_RIGHT:
                {
                    var table = document.getElementById("TableConnected");
                    if(table.rows.length>1)
                    {
                        this.currentPosition=0;
                        this.addButton("CONNECTED");
                    }
                    break;
                }
                case gTVKey.KEY_UP:
                    if(this.currentPosition>0)
                    {
                        this.currentPosition--;
                        this.addButton("SEARCHED");
                    }
                    else
                    {
                        var table = document.getElementById("TableCommand");
                        this.currentPosition=table.rows.length-2;
                        this.addButton("COMMAND");
                    }
                    break;
                case gTVKey.KEY_DOWN:
                    var table = document.getElementById("TableSearched");
                    if(this.currentPosition<table.rows.length-2)
                    {
                        this.currentPosition++;
                        this.addButton("SEARCHED");
                    }
                    break;
            }
            break;
        case this.statusConnected:
            switch(keyCode)
            {
                case gTVKey.KEY_LEFT:
                {
                    var table = document.getElementById("TableSearched");
                    if(table.rows.length>1)
                    {
                        this.currentPosition=0;
                        this.addButton("SEARCHED");
                    }
                    break;
                }
                case gTVKey.KEY_UP:
                {
                    if(this.currentPosition>0)
                    {
                        this.currentPosition--;
                        this.addButton("CONNECTED");
                    }
                    else
                    {
                        var table = document.getElementById("TableCommand");
                        this.currentPosition=table.rows.length-2;
                        this.addButton("COMMAND");
                    }
                    break;
                }
                case gTVKey.KEY_DOWN:
                {
                    var table = document.getElementById("TableConnected");
                    if(this.currentPosition<table.rows.length-2)
                    {
                        this.currentPosition++;
                        this.addButton("CONNECTED");
                    }
                    break;
                }
            }
            break;
    }
}

Main.clear = function()
{
    var table = document.getElementById("TableCommand");
    var iCount=0;
    for(iCount=0;iCount<table.rows.length-1;iCount++)
    {
        table.rows[iCount+1].bgColor="#FFFFFF";
    }

    var table1 = document.getElementById("TableSearched");
    for(iCount=0;iCount<table1.rows.length-1;iCount++)
    {
        table1.rows[iCount+1].bgColor="#FFFFFF";
    }

    var table2 = document.getElementById("TableConnected");
    for(iCount=0;iCount<table2.rows.length-1;iCount++)
    {
        table2.rows[iCount+1].bgColor="#FFFFFF";
    }
}

Main.onHealthcareDevicesObtained = function(healthcaredevices)
{
    var table = document.getElementById("TableConnected");
    // check deleted devices
    for(var iCount=1;iCount<table.rows.length;iCount++)
    {
        var fExist = false;
		for(var iDevices=0;iDevices<healthcaredevices.length;iDevices++)
		{
            if(table.rows[iCount].cells[2].innerHTML==healthcaredevices[iDevices].getUniqueID())
            {
                fExist = true;
            }
		}
		if(!fExist)
		{
		    if(Main.status == Main.statusConnected)
		    {
		        if(table.rows.length==2)
		        {
                    var table2 = document.getElementById("TableCommand");
                    Main.currentPosition=table2.rows.length-2;
                    Main.addButton("COMMAND");
		        }
		        else if(table.rows.length == (iCount+1))
		        {
                    Main.currentPosition-=1;
                    Main.addButton("CONNECTED");
		        }
		        else
		        {
                    Main.currentPosition+=1;
                    Main.addButton("CONNECTED");
                    Main.currentPosition-=1;
		        }
            }
            table.deleteRow(iCount);
            healthcareDeviceArray.splice(iCount-1, 1);
		}
    }
    // check connected devices
	if(healthcaredevices.length > 0)
	{
		alert("found " + healthcaredevices.length + " healthcaredevices");
		
        // add new devices
		for(var iCount=0;iCount<healthcaredevices.length;iCount++)
		{
		    var fExist = false;
    		for(var iDevices=0;iDevices<healthcareDeviceArray.length;iDevices++)
    		{
                if(healthcaredevices[iCount].getUniqueID()==healthcareDeviceArray[iDevices].getUniqueID())
                {
                    fExist = true;
        		    break;
                }
    		}
    		if(!fExist)
    		{
    		    var iNewCount = healthcareDeviceArray.length
    		    healthcareDeviceArray[healthcareDeviceArray.length] = healthcaredevices[iCount];
    		    Main.addDeviceOnTable("TableConnected", healthcareDeviceArray[iNewCount].getName(), healthcareDeviceArray[iNewCount].getType(), healthcareDeviceArray[iNewCount].getUniqueID());
    		}
		}
	}
	else
	{
		alert("no healthcaredevices found");
	}
}

Main.onManagerCallback = function(ManagerEvent)
{
    switch(ManagerEvent.eventType)
    {
        case healthcaredevice.MGR_EVENT_DEV_SEARCHED:
        {
    	    Main.addDeviceOnTable("TableSearched", ManagerEvent.name, ManagerEvent.deviceType, ManagerEvent.UID);
    	    break;
        }
        case healthcaredevice.MGR_EVENT_DEV_CONNECT:
        {
            healthcaredevice.getHealthcareDevices(Main.onHealthcareDevicesObtained);
            break;
        }
        case healthcaredevice.MGR_EVENT_DEV_DISCONNECT:
        {
            healthcaredevice.getHealthcareDevices(Main.onHealthcareDevicesObtained);
            break;
        }
        case healthcaredevice.MGR_EVENT_DEV_SEARCH_FINISHED:
        {
            alert("Search HealthcareDevice Finished");
    	    break;
        }
        case healthcaredevice.MGR_EVENT_DEV_PIN_REQUESTED:
        {
            alert("Search HealthcareDevice PINREQUESTED");
            healthcaredevice.setDevicePIN("0012a1b04373", "1111");
    	    break;
        }
    }
}



Main.onDeviceCallback = function(healthcareInfo)
{
    Main.parseHealthcareDeviceInfo(healthcareInfo);
}

Main.parseHealthcareDeviceInfo = function(healthcareInfo)
{
    if(healthcareInfo!=null)
    {
        var table = document.getElementById("TableResult");
        var length = table.rows.length;
        var row = table.insertRow(length);
        row.bgColor="#FFFFFF";
        var td1 = row.insertCell(0);
        var td2 = row.insertCell(1);
        var td3 = row.insertCell(2);
        switch(healthcareInfo.infoType)
        {
            case webapis.healthcaredevice.DEV_INFO_MEASURE_DATA:
            {
                td1.innerHTML = "Measured Data";
                break;
            }
            case webapis.healthcaredevice.DEV_INFO_SYSTEM_INFO:
            {
                td1.innerHTML = "System Info";
                break;
            }
        }
        td2.innerHTML = "";
        for(var iCount=0;iCount<healthcareInfo.deviceType.length;iCount++)
        {
            td2.innerHTML += Main.toStringDeviceType(healthcareInfo.deviceType[iCount]);
        }
        td3.innerHTML = "";
        switch(healthcareInfo.infoType)
        {
            case webapis.healthcaredevice.DEV_INFO_MEASURE_DATA:
            {
                td3.innerHTML = Main.toStringMeasuredInfo(healthcareInfo.data);
                break;
            }
            case webapis.healthcaredevice.DEV_INFO_SYSTEM_INFO:
            {
                td3.innerHTML += Main.toStringSystemInfo(healthcareInfo.data);
                break;
            }
        }
    }

}

Main.toStringDeviceType = function(deviceType)
{
    switch(deviceType)
    {
        case webapis.healthcaredevice.DEV_BLOOD_PRESSURE_MONITOR:
            return "Blood Pressure\n";
        break;
        case webapis.healthcaredevice.DEV_WEIGHING_SCALE:
            return "Weighing Scale\n";
        break;
        case webapis.healthcaredevice.DEV_GLUCOSE_METER:
            return "Glucosemeter\n";
        break;
    }
}

Main.toStringUnit = function(unit)
{
    switch(unit)
    {
        case webapis.healthcaredevice.DEV_UNIT_MMHG:
            return "mmHg";
        case webapis.healthcaredevice.DEV_UNIT_BPM:
            return "bpm";
        case webapis.healthcaredevice.DEV_UNIT_KG:
            return "kg";
        case webapis.healthcaredevice.DEV_UNIT_KPA:
            return "kPa";
        case webapis.healthcaredevice.DEV_UNIT_CM:
            return "cm";
        case webapis.healthcaredevice.DEV_UNIT_IN:
            return "in";
        case webapis.healthcaredevice.DEV_UNIT_LB:
            return "lb";
        case webapis.healthcaredevice.DEV_UNIT_KGPM_SQ:
            return "kg/m^2";
        case webapis.healthcaredevice.DEV_UNIT_MGPDL:
            return "mg/dL";
    }
    return "";
}

Main.toStringMeasuredInfo = function(measuredInfo)
{
    var stringValue = "";
    for(var iCount=0;iCount<measuredInfo.length;iCount++)
    {
        switch(measuredInfo[iCount].elementType)
        {
            case webapis.healthcaredevice.MEASURE_DATA_ABS_TIMESTAMP:
                stringValue += "TimeInfo:";
                stringValue+=measuredInfo[iCount].element.year+".";
                stringValue+=measuredInfo[iCount].element.month+".";
                stringValue+=measuredInfo[iCount].element.day+"-";
                stringValue+=measuredInfo[iCount].element.time+".";
                stringValue+=measuredInfo[iCount].element.minute+".";
                stringValue+=measuredInfo[iCount].element.second;
                break;
            case webapis.healthcaredevice.MEASURE_DATA_SYSTOLIC:
                stringValue += "Systolic:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            case webapis.healthcaredevice.MEASURE_DATA_DIASTOLIC:
                stringValue += "Diastolic:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            case webapis.healthcaredevice.MEASURE_DATA_MAP:
                stringValue += "MAP:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            case webapis.healthcaredevice.MEASURE_DATA_PULSE_RATE:
                stringValue += "Pulse Rate:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            case webapis.healthcaredevice.MEASURE_DATA_BODY_WEIGHT:
                stringValue += "Body Weight:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            case webapis.healthcaredevice.MEASURE_DATA_BODY_HEIGHT:
                stringValue += "Body Height:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            case webapis.healthcaredevice.MEASURE_DATA_BODY_MASS:
                stringValue += "Body Mass:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            case webapis.healthcaredevice.MEASURE_DATA_BODY_FAT:
                stringValue += "Body Fat:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            case webapis.healthcaredevice.MEASURE_DATA_CAPILLARY_WHOLEBLOOD:
                stringValue += "Capillary Wholeblood:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
            default:
                stringValue += "Vendor-specific type:";
                stringValue += measuredInfo[iCount].element.value;
                stringValue += Main.toStringUnit(measuredInfo[iCount].element.unit);
                break;
        }
        stringValue+=" \n";
    }
    return stringValue;
}

Main.toStringSystemInfo = function(systemInfo)
{
    var stringValue = "";
    for(var iCount=0;iCount<systemInfo.length;iCount++)
    {
        switch(systemInfo[iCount].elementType)
        {
            case webapis.healthcaredevice.DEV_MANUFACTURER:
                stringValue += "Manufacturer:";
                break;
            case webapis.healthcaredevice.DEV_MODEL_NUMBER:
                stringValue += "Model Number:";
                break;
        }
        stringValue+=systemInfo[iCount].element;
        stringValue+=" \n";
    }
    return stringValue;
}

Main.addDeviceOnTable = function(tablename, name, deviceType, UID)
{
    var table = document.getElementById(tablename);
    var length = table.rows.length;
    var row = table.insertRow(length);
    row.bgColor="#FFFFFF";
    var td1 = row.insertCell(0);
    td1.innerHTML = name;
    var td2 = row.insertCell(1);
    td2.innerHTML = Main.toStringDeviceType(deviceType);
    var td3 = row.insertCell(2);
    td3.innerHTML = UID;
    if(tablename=="TableConnected")
    {
        var td4 = row.insertCell(3);
        td4.innerHTML = "";
    }
}

Main.deleteDevicesOnTable = function(tablename)
{
    var table = document.getElementById(tablename);
    var length = table.rows.length;
    for(var iCount=1;iCount<length;iCount++)
    {
        table.deleteRow(1);
    }
}

Main.deleteResultsOnTable = function()
{
    var table = document.getElementById("TableResult");
    var length = table.rows.length;
    for(var iCount=1;iCount<length;iCount++)
    {
        table.deleteRow(1);
    }
}