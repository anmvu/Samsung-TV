window.main={};

main.extend = function(sb, sp, overrides){
	var F = function(){}, sbp = null, spp = sp.prototype;
	F.prototype = spp;
	sbp = sb.prototype = new F();
	sbp.constructor = sb;
	sb.superclass = spp;
	if(spp.constructor == Object.prototype.constructor){
		spp.constructor = sp;
	}
	for(var i in overrides){
		sbp[i] = overrides[i];
	}
};

main.Observable = function(config){
	//alert("----------- new Observable ------------");
	//this.eventHandler = {};
	if(config && config.handler){
		this.addEventHandler(config.handler);
	}
	this.suspendEvent = false;
};

main.Observable.prototype = {
	
	addEvent: function(eventNames){
		//alert("----------- Observable addEvent: " + eventNames.join(",") + " ------------");
		if(typeof(eventNames) == "string"){
			eventNames = [eventNames];
		}
		var that = this;
		$.each(eventNames, function(i, v){
			if(!that.eventHandler){
				that.eventHandler = {};
			}
			that.eventHandler[v] = [];
		});
	},
	
	addEventHandler: function(handler){
		//alert("----------- Observable addEventHandler: " + handler.eventName + " ------------");
		if(typeof(arguments[0]) == "string"){
			this.addEventHandler({
				eventName: arguments[0],
				fn: arguments[1],
				scope: arguments[2] || window
			});
		}else if($.isArray(handler)){
			for(var i = 0; i < handler.length; i++){
				this.addEventHandler(handler[i]);
			}
		}else{
			this.eventHandler[handler.eventName].push(handler);
		}
	},
	
	removeEventHandler: function(handler){
		var index = -1;
		if(typeof(arguments[0]) == "string"){
			this.removeEventHandler({
				eventName: arguments[0],
				fn: arguments[1],
				scope: arguments[2] || window
			});
			return;
		}
		$.each(this.eventHandler[handler.eventName], function(i, v){
			if(handler.fn == v.fn && handler.scope == v.scope){
				index = i;
			}
		});
		if(index != -1){
			this.eventHandler[handler.eventName].splice(index, 1);
		}
	},
	
	fireEvent: function(){
		//alert("----------- Observable fireEvent: " + arguments[0] + " ------------");
		if(!this.suspendEvent){
			var args = Array.prototype.slice.call(arguments, 1);
			$.each(this.eventHandler[arguments[0]], function(i, v){
				v.fn.apply(v.scope || window, args);
			});
		}
	}
};

main.Component = function(config){
	//alert("----------- new Component ------------");
	this.addEvent([
	    "init",
		"activate",
		"unactivate",
	    "destroy"
	]);
	main.Component.superclass.constructor.call(this, config);
	if(config.id){
		var that = this;
		$.each(config, function(i, v){
			that[i] = v;
		})
		this.el = $("#"+this.id);
	}else{
		this.id = (config.idPrefix || this.idPrefix) + (++main.Component.ID_COUNTER);
		this.parentId = config.parentId;
		this.templateEl = config.templateEl || this.templateEl;
	}
	this.init();
	this.rendered = true;
};

main.Component.ID_COUNTER = 10000;

main.extend(main.Component, main.Observable, {
	
	init: function(){
		//alert("----------- Component init ------------");
		this.fireEvent("init", this);
	},
	
	destroy: function(){
		//alert("----------- Component destroy ------------");
		this.fireEvent("destroy", this);
	},
	
	activate: function(){
		//alert("----------- Component activate ------------");
		this.fireEvent("activate", this);
	},
	
	unactivate: function(){
		//alert("----------- Component unactivate ------------");
		this.fireEvent("unactivate", this);
	}
});

main.leftPad = function(str, l, s){
	str = "" + str;
	if(l <= str.length){
		return str;
	}
	for(var i=0; i<(l - str.length); i++){
		str = s + str;
	}
	return str;
};

main.filterFilename = function(path){
	var reg = /[^/]+$/;
	var filename = reg.exec(path)[0];
	return filename;
};

main.log = function(v){
	if($("#log").children().length > 32){
		$("#log").children(":lt(10)").remove();
	}
	//$("#log").append("<div>"+v+"</div>");
};
