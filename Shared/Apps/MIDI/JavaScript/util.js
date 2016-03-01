main.Util = {
	
	/**
     * Constant: MIDI_PLAY_STATE
     * MIDI_PLAY_STATE_STOP     - Stop playing.
     * MIDI_PLAY_STATE_START    - Start playing.
     */
    MIDI_PLAY_STATE_STOP: 0,
    MIDI_PLAY_STATE_START: 1,
	getSf2Data: (function(){
		var data = {};
		return function(arr, reload){
			if(reload){
				if($.isArray(arr)){
					data = {};
					$.each(arr, function(i, v){
						var paraArr = v.split(":");
						var bankNum = paraArr[0];
						paraArr = paraArr[1].split(" ");
						var programNum = paraArr[0];
						var programName = paraArr[1];
						if(!data[bankNum]){
							data[bankNum] = [];
						}
						data[bankNum].push({bankNum: bankNum, programNum: programNum, programName: programName});
					});
					return data;
				}else{
					return null;
				}
			}else{
				return data;
			}
		}
	})(),
	
};


main.Timer = function(config){
	this.addEvent(["timechange"]);
	main.Timer.superclass.constructor.call(this, config);
	this.baseTime = null;
};

main.extend(main.Timer,main.Observable, {
	
	startTime: function(){
		var date = new Date(), that = this;
		this.baseTime = date.getTime();
		var timer = function(){
			var d = new Date();
			var time = d.getTime() - this.baseTime;
			var secCount = Math.floor(time/1000);
			
			var sec = secCount % 60;
			var min = Math.floor(secCount/60) % 60;
			var hours = Math.floor(secCount/3600) % 60;
			
			var timeStr = main.leftPad(hours, 2, "0") + ":" + main.leftPad(min, 2, "0") + ":" +  main.leftPad(sec, 2, "0");
			this.fireEvent("timechange", timeStr, this);
		};
		this.timeId = window.setInterval(function(){timer.call(that);}, 100);
	},
	
	stopTime: function(){
		if(this.timeId){
			window.clearInterval(this.timeId);
		}
	}
});