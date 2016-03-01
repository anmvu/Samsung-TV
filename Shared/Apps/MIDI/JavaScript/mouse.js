main.supportMouse = function(){
	/******************  z-index  ******************/
	var zIndex = 100;
	MidiUI.channelList.listWrapper.css("z-index", zIndex);
	MidiUI.programList.listWrapper.css("z-index", zIndex);
	MidiUI.bankList.dropdownBtn.css("z-index", zIndex);
	MidiUI.volumeSlider.el.css("z-index", zIndex);
	MidiUI.sustainSlider.el.css("z-index", zIndex);
	MidiUI.balanceSlider.el.css("z-index", zIndex);
	MidiUI.panSlider.el.css("z-index", zIndex);
	MidiUI.pitchbendSlider.el.css("z-index", zIndex);
	MidiUI.midiPlay.css("z-index", zIndex);
	MidiUI.midiStop.css("z-index", zIndex);
	return;
};