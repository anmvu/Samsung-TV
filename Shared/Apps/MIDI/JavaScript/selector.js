main.Selector = function(config){
	this.addEvent(["selecteditem", "showlist"]);
	main.Selector.superclass.constructor.call(this, config);
};

main.extend(main.Selector, main.Component, {
	
	listIndex: -1,
	
	data: null,
	
	init:function(){
		main.Selector.superclass.init.call(this);
		this.getListWrapper();
		this.getTopBar();
		this.getBottomBar();
		if(this.data){
			this.loadData(this.data);
		}
	},
	
	getScrollValue: function(){
		var item = this.listWrapper.children().children();
		this.margin = Number(item.css("margin-top").replace("px", ""));
		return this.scrollValue = item.outerHeight() + this.margin;
	},
	
	getListWrapper: function(){
		return this.listWrapper = null;
	},
	
	getTopBar: function(){
		if(!this.topBar){
			this.topBar = this.el.children().children(".list-bar-top");
		}
		return this.topBar;
	},
	
	getBottomBar: function(){
		if(!this.bottomBar){
			this.bottomBar = this.el.children().children(".list-bar-bottom");
		}
		return this.bottomBar;
	},
	
	loadData: function(data){
		var arr = [], that = this;
		$.each(data, function(i, v){
			var displayValue = that.getDisplayValue(v);
			arr.push({value: v, displayValue: displayValue});
		});
		this.dataList = arr;
		this.activeItem = null;
	},
	
	getDisplayValue: function(d){
		return d;
	},
	
	setSelectedClass: function(i){
		this.listWrapper.children().children().removeClass("ui-selected");
		$(this.listWrapper.children().children()[i]).addClass("ui-selected");
	},
	
	removeSelectedClass: function(){
		this.listWrapper.children().children().removeClass("ui-selected");
	},
	
	setSelectingClass: function(i){
		this.listWrapper.children().children().removeClass("ui-selecting");
		$(this.listWrapper.children().children()[i]).addClass("ui-selecting");
	},
	
	removeSelectingClass: function(){
		this.listWrapper.children().children().removeClass("ui-selecting");
	},
	
	selectItem: function(i){
		if(this instanceof main.ListSelector){
			this.setSelectingClass(i);
		}else{
			this.setSelectedClass(i);
		}
		this.listIndex = i;
		this.scroll(i);
	},
	
	scroll: function(i){
		if(typeof(i) != "number"){
			i = $.inArray(i, this.dataList);
		}
		var t = $(this.listWrapper.children().children()[i]).position().top;
		if(t < 0){
			this.listWrapper.scrollTop(this.listWrapper.scrollTop() + t);
		}
		var h = this.listWrapper.innerHeight();
		if((t + this.scrollValue) > h){
			this.listWrapper.scrollTop(this.listWrapper.scrollTop() + t + this.scrollValue - h + this.margin);
		}
		if($(this.listWrapper.children().children()[0]).position().top < 0){
			this.topBar.show();
		}else{
			this.topBar.hide();
		}
		if(($(this.listWrapper.children().children()[this.dataList.length-1]).position().top + this.scrollValue/2) > h){
			this.bottomBar.show();
		}else{
			this.bottomBar.hide();
		}
	},
	
	selectNext: function(){
		if(this.dataList && this.dataList.length > 0){
			if(this.dataList.length == (this.listIndex + 1)){
				return;
			}else{
				this.selectItem(this.listIndex + 1);
			}
		}
	},
	
	selectPrev: function(){
		if(this.dataList && this.dataList.length > 0){
			if(this.listIndex === 0){
				return;
			}else{
				this.selectItem(this.listIndex - 1);
			}
		}
	},
	
	selectedItem: function(noEvent){
		main.log("selectedItem.");
		if(this.dataList && this.dataList.length > 0){
			var f = this.dataList[this.listIndex];
			if(this instanceof main.ListSelector){
				$(this.listWrapper.children().children()[this.listIndex]).removeClass("ui-selecting");
				this.setSelectedClass(this.listIndex);
			}
			this.activeItem = f;
			this.unactivate();
			if(!noEvent){
				this.fireEvent("selecteditem", this.activeItem, this);
			}
		}
	},
	
	selectedItemByFn: function(fn){
		if(typeof(fn) == "function" && this.dataList && this.dataList.length > 0){
			var f = true;
			for(var i = 0; i < this.dataList.length; i++){
				if(fn.call(this, this.dataList[i], this)){
					this.selectItem(i);
					this.selectedItem(true);
					f = false;
					main.log("selectedItemByFn list index: " + i);
					break;
				}
			}
			if(f){
				this.removeSelectedClass();
				this.selectItem(0);
			}
		}
	}
});


main.ListSelector = function(config){
	main.ListSelector.superclass.constructor.call(this, config);
};

main.extend(main.ListSelector, main.Selector, {
	
	init: function(){
		main.ListSelector.superclass.init.call(this);
		this.focusEl = this.listWrapper;
	},
	
	getListWrapper: function(){
		if(!this.listWrapper){
			this.listWrapper = this.el.children().children(".list-wrapper");
		}
		return this.listWrapper;
	},
	
	loadData: function(data){
		main.ListSelector.superclass.loadData.call(this, data);
		this.listWrapper.children().empty();
		var that = this;
		$.each(this.dataList, function(i, v){
			that.listWrapper.children().append("<li index='" + i + "'>" + v.displayValue + "</li>");
		});
		this.getScrollValue();
		this.selectItem(0);
		this.fireEvent("showlist", this);
	},
	
	unactivate: function(){
		if(this.dataList && this.dataList.length > 0){
			if(this.activeItem){
				this.removeSelectingClass();
				this.listIndex = $.inArray(this.activeItem, this.dataList);
				this.scroll(this.activeItem);
			}else{
				this.selectItem(0);
			}
		}
		main.ListSelector.superclass.unactivate.call(this);
	}
});

main.PopupListSelector = function(config){
	
	main.PopupListSelector.superclass.constructor.call(this, config);
};

main.extend(main.PopupListSelector, main.Selector, {
	
	init: function(){
		main.PopupListSelector.superclass.init.call(this);
		this.getPopupList();
		this.getInput();
		this.getDropdownBtn();
		this.focusEl = this.el;
	},
	
	getListWrapper: function(){
		if(!this.listWrapper){
			this.listWrapper = this.el.children().children(".list-wrapper");
		}
		return this.listWrapper;
	},
	
	getInput: function(){
		if(!this.input){
			this.input = this.el.children().children("input");
		}
		return this.input;
	},
	
	getDropdownBtn: function(){
		if(!this.dropdownBtn){
			this.dropdownBtn = this.el.children().children("button");
			this.dropdownBtn.button({
				icons: {
					primary: "ui-icon-triangle-1-s"
				},
				text: false
			});
		}
		return this.dropdownBtn;
	},
	
	getPopupList: function(){
		if(!this.popupList){
			this.popupList = this.el.children(".popup-list");
		}
		return this.popupList;
	},
	
	loadData: function(data){
		try{
			if($.isArray(data) && data.length > 1){
				main.PopupListSelector.superclass.loadData.call(this, data);
				this.listIndex = 0;
				this.selectedItem();
				
			}
		}catch(e){
			main.log("PopupListSelector error--- " + e.name + " : " + e.message);
		}
	},
	
	showPopupList: function(){
		if(!this.popupListShow){
			this.popupList.show("fast");
			this.popupListShow = true;
			this.listWrapper.children().empty();
			if(this.dataList && this.dataList.length > 0){
				var that = this;
				$.each(this.dataList, function(i, v){
					that.listWrapper.children().append("<li index='" + i + "'>" + v.displayValue + "</li>");
				});
				this.getScrollValue();
				if(this.listIndex != -1){
					this.selectItem(this.listIndex);
				}else{
					this.selectItem(0);
				}
			}
			this.fireEvent("showlist", this);
		}
	},
	
	hidePopupList: function(){
		if(this.popupListShow){
			this.listWrapper.children().empty();
			this.popupList.hide("fast");
			this.popupListShow = false;
		}
	},
	
	selectedItem: function(noEvent){
		this.hidePopupList();
		if(this.dataList && this.dataList.length > 0){
			if(this.input){
				this.input.val(this.dataList[this.listIndex].displayValue);
			}
			main.PopupListSelector.superclass.selectedItem.call(this, noEvent);
		}
	},
	
	activate: function(){
		this.dropdownBtn.addClass("my-ui-state-focus");
		this.showPopupList();
		main.PopupListSelector.superclass.activate.call(this);
	},
	
	unactivate: function(){
		this.hidePopupList();
		this.dropdownBtn.removeClass("my-ui-state-focus");
		if(this.activeItem){
			this.listIndex = $.inArray(this.activeItem, this.dataList);
		}else{
			this.listIndex = 0;
		}
		main.PopupListSelector.superclass.unactivate.call(this);
	}
});