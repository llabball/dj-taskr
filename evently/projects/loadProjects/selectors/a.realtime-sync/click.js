function () {
	var that = $(this);
	var syncbtn = $("a.start-sync");

	if(that.hasClass("active")) {
		that.removeClass("active");
		$("#sync_state").trigger("realtimesync", [{"action": "stop"}]);
		syncbtn.fadeIn("slow");
	} else {
		that.addClass("active");
		$("#sync_state").trigger("realtimesync", [{"action": "start"}]);
		syncbtn.fadeOut("slow");
	}
}