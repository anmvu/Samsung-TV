main.Slider = function(config){
	main.Slider.superclass.constructor.call(this, config);
	this.addEvent("change");
};

main.extend(main.Slider, main.Component, {
	
	orientation: "horizontal",
	
	max: 100,
	
	min: 0,
	
	step: 1,
	
	value: 0,
	
	init: function(){
		main.Slider.superclass.init.call(this);
		this.getLabel();
		this.getMinLabel();
		this.getMaxLabel();
		this.getValueLabel();
		this.getIntSlider();
		this.intSlider.slider({
			orientation: this.orientation,
			range: "min",
			value: this.value,
			min: this.min,
			max: this.max
		});
		this.valueLabel.text(this.value);
	},
	
	getLabel: function(){
		if(!this.label){
			this.label = this.el.children("span.slider-label");
		}
		return this.label;
	},
	
	getMinLabel: function(){
		if(!this.minLabel){
			this.minLabel = this.el.children("span.slider-mark-min");
		}
		return this.minLabel;
	},
	
	getMaxLabel: function(){
		if(!this.maxLabel){
			this.maxLabel = this.el.children("span.slider-mark-max");
		}
		return this.maxLabel;
	},
	
	getValueLabel: function(){
		if(!this.valueLabel){
			this.valueLabel = this.el.children("span.slider-value");
		}
		return this.valueLabel;
	},
	
	getIntSlider: function(){
		if(!this.intSlider){
			this.intSlider = this.el.children("#"+this.id+"-slider");
		}
		return this.intSlider;
	},
	
	setValue: function(v, noEvent){
		if(v >= this.min && v <= this.max){
			var o = this.value;
			if(o != v){
				this.intSlider.slider("option", "value", v);
				this.valueLabel.text(v);
				this.value = v;
				if(!noEvent){
					this.fireEvent("change", o, v, this);
				}
			}
		}
	},
	
	getValue: function(){
		return this.value;
	},
	
	increase: function(){
		var v = this.value + this.step;
		this.setValue(v);
	},
	
	decrease: function(){
		var v = this.value - this.step;
		this.setValue(v);
	}
	
});