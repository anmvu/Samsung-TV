main.Device = function(config){
	this.name = config.name;
	this.uid = config.uid;
	this.device = config.device;
	this.setting = config.setting || {};
	this.status = "unactivate";
	main.Device.superclass.constructor.call(this, config);
};

main.extend(main.Device, main.Component, {
	
	idPrefix: "midi-",
	
	templateEl: '<li><button id="#{ID}" uid="#{UID}">#{NAME}</button></li>',
		
	init: function(){
		main.Device.superclass.init.call(this);
		$("#"+this.parentId).children("ul").append(this.templateEl.replace("#{ID}", this.id).replace("#{UID}", this.uid).replace("#{NAME}", this.name));
		this.el = $("#"+this.id);
		this.el.button();
	},
	
	activate: function(){
		if(this.status != "activate"){
			this.el.addClass("my-ui-state-focus");
			this.status = "activate";
			main.Device.superclass.activate.call(this);
		}
	},
	
	unactivate: function(){
		if(this.status != "unactivate"){
			this.el.removeClass("my-ui-state-focus");
			this.status = "unactivate";
			main.Device.superclass.unactivate.call(this);
		}
	},
	
	destroy: function(){
		main.Device.superclass.destroy.call(this);
		this.el.remove();
	},
	
	updateSettingByChannel: function(setting, channel){
		var s = null;
		$.each(this.setting, function(i, v){
			if(v.channel === channel){
				s = v;
			}
		})
		var that = this;
		$.each(setting, function(i, v){
			s[i] = setting[i];
		});
	}
});

main.DeviceMaintainance = function(config){
	if(config.id){
		this.id = config.id;
	}
	main.DeviceMaintainance.superclass.constructor.call(this, config);
	this.deviceList = [];
	this.activateDevice = null;
	this.addEvent(["adddevice", "removedevice"]);
};

main.extend(main.DeviceMaintainance, main.Observable, {
	
	init: function(devices){
		var that = this;
		$.each(devices, function(i, v){
			that.addDevice(v);
		});
	},	
		
	addDevice: function(device){
		if(device instanceof main.Device){
			this.deviceList.push(device);
		}else{
			device = new main.Device(device);
			this.deviceList.push(device);
		}
		this.fireEvent("adddevice", device, this);
		return device;
	},
	
	removeDevice: function(device){
		if(typeof(device) === "string"){
			device = this.getDeviceByUid(device);
		}
		var index = this.getIndex(device);
		device.destroy();
		this.deviceList.splice(index, 1);
		this.fireEvent("removedevice", device, this);
	},
	
	getDeviceByUid: function(uid){
		var device = null;
		$.each(this.deviceList, function(i, v){
			if(uid == v.uid){
				device = v;
			}
		});
		return device;
	},
	
	getDeviceById: function(id){
		var device = null;
		$.each(this.deviceList, function(i, v){
			if(id == v.id){
				device = v;
			}
		});
		return device;
	},
	
	getIndex: function(d){
		if(d){
			return $.inArray(d, this.deviceList);
		}else{
			var arr = [];
			for(var i = 0; i < this.deviceList.length; i++){
				if(this.deviceList[i].status == "activate"){
					arr.push(i);
				}
			}
			return arr;
		}
	},
	
	activateItem: function(i){
		if(i instanceof main.Device){
			i = this.getIndex(i);
		}
		if(i >= 0 && i < this.deviceList.length){
			this.deviceList[i].activate();
		}
	},
	
	unactivateItem: function(i){
		if(i instanceof main.Device){
			i = this.getIndex(i);
		}
		if(i >= 0 && i < this.deviceList.length){
			this.deviceList[i].unactivate();
		}
	},
	
	getActivateItems: function(){
		var arr = [];
		$.each(this.deviceList, function(i, v){
			if(v.status == "activate"){
				arr.push(v);
			}
		});
		return arr;
	},
	
	destroy: function(){
		for(var i = 0; i < this.deviceList.length; i++){
			this.deviceList[i].destroy();
		}
	}
});






















