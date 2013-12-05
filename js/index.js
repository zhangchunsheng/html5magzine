/**
 * html5 magazine
 * author: peter
 * date:2012-02-27
 */
var touchstart,touchend,touchmove;
var isTouch = ("ontouchstart" in window);
var x = 0;
var y = 0;
touchstart = isTouch ? "touchstart" : "mousedown";
touchmove = isTouch ? "touchmove" : "mousemove";
touchend = isTouch ? "touchend" : "mouseup";
var screenWidth = parseInt(window.screen.width);
var screenHeight = parseInt(window.screen.height - 100);
var currentPage;
var prevPage;
var nextPage;
var pageInfo;
var PM_TOUCH_SENSITIVITY = 15;

document.addEventListener(touchmove, function(e) {
	//console.log(e);
});

function $(id) {
	return document.getElementById(id);
}

window.addEventListener("load", function(e) {
	for(var i = 1 ; i <= 6 ; i++) {
		var page = $("page_" + i);
		//var backgroundColor = "background:rgb(" + (i * 30) + ",60," + (i * 30) + ")";
		var backgroundColor = "";
		var style = backgroundColor + ";width:100%;height:100%;overflow:scroll;position:absolute;margin-left:20px;top:30px;bottom:30px;left:0px;z-index:" + (6 - i);
		page.style.cssText = page.style.cssText + ";" + style;
	}
	pageInfo = new Page();
	pageInfo.setCurrentPage("page_1");
	
	var content = $("content");
	content.addEventListener(touchstart, function(e) {
		x = e.x;
	});
	document.body.addEventListener(touchstart, handleTouchStart, false);
	init();
});

function getPx(value) {
	return value + "px";
}

function init() {
	function orientationChange() {
		var bodyStyle = document.body.style;
		screenWidth = window.screen.availWidth;
		screenHeight = window.screen.availHeight;
		orientation = window.orientation;
		bodyStyle.height = orientation == 0 || orientation == 180 ? screenHeight + "px" : screenHeight + "px";
		switch(window.orientation) {
	　　case 0:
			break;
	　　case -90:
			break;
	　　case 90:
			break;
	　　case 180:
		　	break;
		}
		setTimeout(scrollTo, 100, 0, 1);
	}
	addEventListener("orientationchange", orientationChange, !1),
	addEventListener("scroll", function() {
		!pageYOffset && scrollTo(0,1)
	}, !1),
	orientationChange();
}

function handleTouchStart(event) {
	if(isTouch) {
		if (event.touches.length == 1) {
			touchDX = 0;
			touchDY = 0;

			touchStartX = event.touches[0].pageX;
			touchStartY = event.touches[0].pageY;

			document.body.addEventListener(touchmove, handleTouchMove, true);
			document.body.addEventListener(touchend, handleTouchEnd, true);
		}
	} else {
		touchDX = 0;
		touchDY = 0;

		touchStartX = event.pageX;
		touchStartY = event.pageY;

		document.body.addEventListener(touchmove, handleTouchMove, true);
		document.body.addEventListener(touchend, handleTouchEnd, true);
	}
}

function handleTouchMove(event) {
	if(isTouch) {
		if(!event.elementIsEnabled) {
			event.preventDefault();
		}
		if (event.touches.length > 1) {
			cancelTouch();
		} else {
			touchDX = event.touches[0].pageX - touchStartX;
			touchDY = event.touches[0].pageY - touchStartY;
		}
	} else {
		touchDX = event.pageX - touchStartX;
		touchDY = event.pageY - touchStartY;
	}
};

function handleTouchEnd(event) {
	var currentPage = pageInfo.currentPage;
	var dx = Math.abs(touchDX);
	var dy = Math.abs(touchDY);

	if ((dx > PM_TOUCH_SENSITIVITY) && (dy < (dx * 2 / 3))) {
		if (touchDX > 0) {//向右
			if(pageInfo.prevPage) {
				pageInfo.prevPage.style.left = "0px";
				var num = pageInfo.currentPageNum;
				pageInfo.setCurrentPage("page_" + (num - 1));
			}
		} else {//向左
			if(pageInfo.nextPage) {
				currentPage.style.left = -screenWidth + "px";
				var num = pageInfo.currentPageNum;
				pageInfo.setCurrentPage("page_" + (num + 1));
			}
		}
	}

	cancelTouch();
};

function cancelTouch(event) {
	document.body.removeEventListener(touchmove, handleTouchMove, true);
	document.body.removeEventListener(touchend, handleTouchEnd, true);  
};