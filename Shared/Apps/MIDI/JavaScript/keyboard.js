main.Keyboard = function(config){
	this.whiteElTemplate = '<img id="' + this.keyIdPrefix + '#{KEYID}" src="' + this.whiteSrc + '" style="left:#{LEFT}px;" />';
	this.blackElTemplate = '<img id="' + this.keyIdPrefix + '#{KEYID}" src="' + this.blackSrc + '" style="left:#{LEFT}px;z-index:99;" />';
	this.addEvent(["mousedown", "mouseup", "increase", "decrease"]);
	this.extraKey = null;
	this.octaveNum = -1;
	main.Keyboard.superclass.constructor.call(this, config);
};

main.extend(main.Keyboard, main.Component, {
	
	baseNum: 12,
	
	baseLeft: 2,
	
	whiteWidth: 30,
	
	blackWidth: 19,
	
	octaveWidth: 210,
	
	whiteSrc: "Resource/images/white.png",
	
	whitePressSrc: "Resource/images/white_press.png",
	
	blackSrc: "Resource/images/black.png",
	
	blackPressSrc: "Resource/images/black_press.png",
	
	keyIdPrefix: "key-",
	
	init: function(){
		this.increaseOctave();
		this.increaseOctave();
		this.increaseOctave();
		this.increaseOctave();
		this.onMouseUp();
	},
	
	getWhiteCoord: function(o){
		var arr = [];
		for(var i = 0; i < 7; i++){
			arr.push(i * this.whiteWidth + this.octaveWidth * o + this.baseLeft);
		}
		return arr;
	},
	
	getBlackCoord: function(o){
		var arr = [], whiteArr = this.getWhiteCoord(o);
		for(var i = 0; i < whiteArr.length -1; i++){
			if(i != 2){
				arr.push(whiteArr[i] + this.blackWidth);
			}
		}
		return arr;
	},
	
	getOctaveElTemplate: function(o){
		var temp = "<div id='octave" + this.octaveNum + "'>";
		var whiteArr = this.getWhiteCoord(o);
		var blackArr = this.getBlackCoord(o);
		var j = k = 0;
		for(var i = 0; i < this.baseNum; i++){
			if(i==1 || i==3 || i==6 || i==8 || i==10){
				temp = temp + this.blackElTemplate.replace("#{KEYID}", i + this.baseNum * this.octaveNum).replace("#{LEFT}", blackArr[k++]);
			}else{
				temp = temp + this.whiteElTemplate.replace("#{KEYID}", i + this.baseNum * this.octaveNum).replace("#{LEFT}", whiteArr[j++]);
			}
		}
		temp = temp + "</div>"
		return temp;
	},
	
	getIdsByOctave: function(o){
		var arr = [];
		for(var i = 0; i < this.baseNum; i++){
			arr.push(this.keyIdPrefix + (i + this.baseNum * o));
		}
		return arr;
	},
	
	initExtraKey: function(o){
		if(this.extraKey){
			this.extraKey.unbind().remove();
		}
		var id = (o + 1) * this.baseNum;
		var coord = this.octaveWidth * (o + 1) + this.baseLeft;
		var temp = this.whiteElTemplate.replace("#{KEYID}", id).replace("#{LEFT}", coord);
		this.el.append("<div>" + temp + "</div>");
		var elId = this.keyIdPrefix + id;
		var that = this;
		this.extraKey = $("#" + elId).bind("mousedown",elId, function(e){
			e.stopPropagation();
			e.preventDefault();
			that.downKeyId = e.data;
			var src = $(this).attr("src");
			if(/white/.test(src)){
				$(this).attr("src", that.whitePressSrc);
			}else{
				$(this).attr("src", that.blackPressSrc);
			}
			var keyCode = Number(e.data.replace(that.keyIdPrefix, ""));
			that.fireEvent("mousedown", keyCode, that);
		});
	},
	

	pressKey: function(id){
		var elId = this.keyIdPrefix + id;
		var src = $("#" + elId).attr("src");
		main.log("presskey [ " + elId + " ] src : " + src);
		if(/white/.test(src)){
			$("#" + elId).attr("src", this.whitePressSrc);
		}else{
			$("#" + elId).attr("src", this.blackPressSrc);
		}
	},
	
	releaseKey: function(id){
		var elId = this.keyIdPrefix + id;
		var src = $("#" + elId).attr("src");
		main.log("releasekey [ " + elId + " ] src : " + src);
		if(/white/.test(src)){
			$("#" + elId).attr("src", this.whiteSrc);
		}else{
			$("#" + elId).attr("src", this.blackSrc);
		}
	},
	
	increaseOctave: function(){
		if(this.octaveNum < 3){
			this.octaveNum = this.octaveNum + 1;
			var temp = this.getOctaveElTemplate(this.octaveNum), that = this;
			this.initExtraKey(this.octaveNum);
			this.el.append(temp);
			var keyIds = this.getIdsByOctave(this.octaveNum);
			for(var i = 0; i < keyIds.length; i++){
				$("#" + keyIds[i]).bind("mousedown",keyIds[i], function(e){
					e.stopPropagation();
					e.preventDefault();
					that.downKeyId = e.data;
					var src = $(this).attr("src");
					if(/white/.test(src)){
						$(this).attr("src", that.whitePressSrc);
					}else{
						$(this).attr("src", that.blackPressSrc);
					}
					var keyCode = Number(e.data.replace(that.keyIdPrefix, ""));
					that.fireEvent("mousedown", keyCode, that);
				});
			}
			this.fireEvent("increase", this);
		}
	},
	
	decreaseOctave: function(){
		if(this.octaveNum > 0){
			var keyIds = this.getIdsByOctave(this.octaveNum);
			for(var i = 0; i < keyIds.length; i++){
				$("#" + keyIds[i]).unbind().remove();
			}
			$("#octave"+this.octaveNum).empty().remove();
			this.octaveNum = this.octaveNum - 1;
			this.initExtraKey(this.octaveNum);
			this.fireEvent("decrease", this);
		}
	},
	
	onMouseUp: function(e){
		var that = this;
		$("body").mouseup(function(e){
			if(that.downKeyId){
				e.stopPropagation();
				e.preventDefault();
				var keyId = that.downKeyId;
				that.downKeyId = null;
				var src = $("#" + keyId).attr("src");
				if(/white/.test(src)){
					$("#"+keyId).attr("src", that.whiteSrc);
				}else{
					$("#"+keyId).attr("src", that.blackSrc);
				}
				var keyCode = Number(keyId.replace(that.keyIdPrefix, ""));
				that.fireEvent("mouseup", keyCode, that);
			}
		});
	},
	
	destroy: function(){
		$("body").unbind();
		$("img[id^='key-']").unbind();
	}
});