var mg = (function(undefined) {
	var mg = {
		options: {
			"directory": "weizhoukan",
			"json": path + "weizhoukan/magazine.json",
			"numberOfPagesToLoad": 3,
			"sliderMove": 800,
			"fullpage": false,
			"animationTime": 300,
			"animationType": "linear",
			"sidebar": true,
			"sidebarFixed": true,
			"scrolling": {
				hScrollbar: false,//set to false to never show the horizontal scrollbar.
				vScrollbar: false,//set to false to never show the vertical bar.
				hScroll: false,
				bounce: false,
				overflow: 'hidden',
				desktopCompatibility:true
			}
		},
		maxPage: 1,
		startPeriod: 26,
		currentPeriod: 26,
		allPeriod: 29,
		startLeft: -80,
		step: 85,
		numberOfPagesLoaded: 0,
		currentPage: 0,
		currentPosition: 0,
		keyCode: 0,
		animation: (window["WebKitCSSMatrix"] ? "3d" : ""),
		touchEnabled: (typeof(document.ontouchmove) !== "undefined" ? true : false),
		mouse: {initiated: false},
		sidebarCategoryActive: 26,
		sidebarHightList: [],
		sidebarScroller: {},
		slideScroller: {},
		loadingSequence: {
			"first": [{slide: 4, page: 2}, {slide: 3, page: 1}, {slide: 2, page: 0}],
			"second": [{slide: 1, page: -1}, {slide: 4, page: 2}, {slide: 3, page: 1}, {slide: 2, page: 0}],
			"third": [{slide: 0, page: -2}, {slide: 1, page: -1}, {slide: 4, page: 2}, {slide: 3, page: 1}, {slide: 2, page: 0}],
			"middle": [{slide: 0, page: -2}, {slide: 1, page: -1}, {slide: 4, page: 2}, {slide: 3, page: 1}, {slide: 2, page: 0}],
			"last": [{slide: 0, page: -2}, {slide: 1, page: -1}, {slide: 2, page: 0}],
			"last-but-one": [{slide: 0, page: -2}, {slide: 1, page: -1}, {slide: 3, page: 1}, {slide: 2, page: 0}],
			"last-but-two": [{slide: 0, page: -2}, {slide: 1, page: -1}, {slide: 4, page: 2}, {slide: 3, page: 1}, {slide: 2, page: 0}]
		},
		// 初始化
		init: function() {
			console.log(window.location.href);
			mg.loadOptions(mg.start);
			mg.sidebar = $("#mg-sidebar");
			mg.slider = $("#mg-slider");
			mg.firstSlide = $("#mg-slide-2");
			mg.buttonOpen = $("#mg-sidebar-button-open");
			mg.buttonClose = $("#mg-sidebar-button-close");
		},
		// 加载完配置后执行
		start:  function() {
			var i;
			mg.maxPage = (mg.get("category")[mg.currentPeriod].length - 1);// 获取最大页
			if(mg.get("fullpage") === true) {
				$("body").attr("id", "fullpage");
				mg.startLeft = -100;
				mg.step = 100;
			}
			if(mg.options.sidebar === true) {
				if(mg.options.sidebarFixed === true) {
					$("body").addClass("fixed");
				} else {
					mg.buttonOpen.show();
					mg.buttonClose.show();
				}
				mg.loadSidebar();//初始化导航栏
			}
		},
		get: function(key) {
			if(typeof(mg.options[key]) !== "undefined") {
				return mg.options[key];
			} else {
				return undefined;
			}
		},
		set: function(key, value) {
			mg.options[key] = value;
		}
	};
	
	return mg;
}());

window.mg = mg || {};

// 初始化
(function (mg, undefined) {
	mg.loadSidebar = function() {
		//mg.sidebar.load("../" + mg.get("directory") + "/sidebar.html", mg.loadSidebarSuccess);
		$.ajax({
			type: "get",
			url: path + "" + mg.get("directory") + "/sidebar.html",
			async: false,
			success: function(data) {
				$(data).appendTo("#mg-sidebar");
				mg.loadSidebarSuccess();
				mg.slides = [];// 定义幻灯片
				for(i = 0 ; i <= 4 ; i++) {
					mg.slides.push({//向数组的末尾添加一个或更多元素，并返回新的长度。
						"slideId": i,
						"left": mg.step * (i - 2),
						"page": i - 2
					});
				}
				mg.loadPage($("#mg-slide-2"), 0);//初始化幻灯片
				mg.loadPage($("#mg-slide-3"), 1);
				mg.loadPage($("#mg-slide-4"), 2);
				mg.bindEvents();// 绑定事件
				$("#currentPeriod").attr("class", mg.currentPeriod);//初始化当前杂志
				mg.setTitle(mg.currentPeriod);
				mg.setHref(mg.currentPeriod);
				if(mg.hasSessionData(mg.getHref())) {
					var currentPage = parseInt(mg.getSessionData(mg.getHref()));
					if(currentPage != null) {
						if(currentPage != mg.currentPage) {
							mg.gotoPage(currentPage, mg.currentPeriod);
						}
						//mg.delSessionData(mg.getHref());
					}
				}
			},
			error: function(xhr, type) {
				alert("some error happens");
			}
		});
	};
	mg.loadSidebarSuccess = function() {
		mg.createSidebar();
		mg.createContents();
		if(mg.touchEnabled === true) {
			mg.buttonOpen.tap(mg.sidebarShow);
			mg.buttonClose.tap(mg.sidebarHide);
		} else {
			mg.buttonOpen.bind("click", mg.sidebarShow);
			mg.buttonClose.bind("click", mg.sidebarHide);
		}
		mg.sidebarEvents();
		mg.sidebarCalculate();
		if(mg.touchEnabled === true) {
			mg.addEvent("sidebar-category-content-" + mg.currentPeriod, "webkitTransitionEnd", mg.sidebarListener);
		} else {
			mg.addEvent("sidebar-category-content-" + mg.currentPeriod, "transitionend", mg.sidebarListener);
		}
		$(".sidebar-category-content").css("height", 0);
		$("#sidebar-category-content-" + mg.currentPeriod).css("height", mg.sidebarHightList[mg.currentPeriod]);
		mg.sidebarScroller = new iScroll("mg-sidebar", mg.options.scrolling);
	};
	mg.createSidebar = function() {
		var html = "";
		for(var i = mg.startPeriod ; i <= mg.allPeriod ; i++) {
			html += '<div id="sidebar-category-' + i + '" class="sidebar-list-category">';
			html += '<p class="item-text">';
			html += i + '期';
			html += '</p>';
			html += '</div>';
			html += '<ul id="sidebar-category-content-' + i + '" class="sidebar-category-content">';
			for(var j = 0 ; j < mg.get("category")[i].length ; j++) {
				html += '<li id="page-' + i + '-' + j + '" class="sidebar-list-item">';
				html += '<p class="item-text">';
				html += mg.get("category")[i][j];
				html += '</p>';
				html += '</li>';
			}
			html += '</ul>';
		}
		$(html).appendTo("#sidebar-list");
	};
	mg.createContents = function() {
		var contents = [];
		for(var i = 0 ; i < mg.get("category")[mg.currentPeriod].length ; i++) {
			contents[i] = (i + 1) + ".html";
		}
		mg.set("contents", contents);
	};
	mg.loadPrev = function() {
		var slide = mg.slides.pop();
		var firstSlide = mg.slides[0];
		var page = $("#mg-slide-" + slide.slideId);
		
		slide.left = (firstSlide.left - mg.step);
		slide.page = firstSlide.page - 1;
		page.css("left", slide.left + "%");
		mg.slides.unshift(slide);
		
		if(slide.page >= 0) {
			mg.loadPage(page, slide.page);
		}
	};
	mg.loadNext = function() {
		var slide = mg.slides.shift();
		var lastSlide = mg.slides[mg.slides.length - 1];
		var page = $("#mg-slide-" + slide.slideId);
		
		slide.left = (lastSlide.left + mg.step);
		slide.page = lastSlide.page + 1;
		page.css("left", slide.left + "%");
		mg.slides.push(slide);
		
		if(slide.page <= mg.maxPage) {
			mg.loadPage(page, slide.page);
		}
	};
	
	mg.loadPage = function(slide, page) {// 加载幻灯片内容
		slide.load(path + "" + mg.get("directory") + "/" + mg.currentPeriod + "/" + mg.get("contents")[page], function() {// load方法见zepto.js
			mg.loadSuccess(slide);// 成功加载幻灯片内容
		});
	};
	mg.loadSuccess = function(slide) {
		var scroller;
		slide.show();
		$("#" + slide[0]["id"] + " article").each(function(idx, el) {
			if($.browser.webkit === true) {
				scroller = new iScroll(el, mg.options.scrolling);
			} else {
				scroller = new iScroll(el, mg.options.scrolling);
			}
		});
		mg.numberOfPagesLoaded++;// 加载的幻灯片数量
		if(mg.get("numberOfPagesToLoad") === mg.numberOfPagesLoaded) {//等于最大加载数
			mg.orientation(false);
			mg.removeLoadingIndicator();
		}
		if($("#indexImg").attr("width") > 0) {
			$("#indexImg").bind("click", function(e) {
				$("#indexImg").hide();
				$("#canvas").show();
				indexMovie.init();
			});
		}
	};
	mg.removeLoadingIndicator = function() {
		mg.hideOverlay();
	}
}(mg));

// 翻页
(function(mg, undefined) {
	mg.prev = function() {
		if(mg.currentPage > 0) {
			mg.currentPage--;
			mg.currentPosition += (mg.getWidth(mg.firstSlide) + mg.getMargin(mg.firstSlide));
			mg.animate(mg.slider, mg.currentPosition);
			mg.loadPrev();
			mg.setTitle(mg.currentPeriod);
			mg.sidebarGoTo(mg.currentPage);
			mg.addSessionData(mg.getHref(), mg.currentPage);
		}
	};
	mg.next = function() {
		if(mg.currentPage < mg.maxPage) {
			mg.currentPage++;
			mg.currentPosition -= (mg.getWidth(mg.firstSlide) + mg.getMargin(mg.firstSlide));
			mg.animate(mg.slider, mg.currentPosition);
			mg.loadNext();
			mg.setTitle(mg.currentPeriod);
			mg.sidebarGoTo(mg.currentPage);
			mg.addSessionData(mg.getHref(), mg.currentPage);
		}
	};
	mg.center = function() {// 调用mg.orientation时会执行
		var width;
		mg.resetWidth();// 重置mg.widthList对象
		mg.resetMargin();// 重置mg.marginList对象
		//mg.sidebarCalculate();// 计算导航栏
		width = (mg.getWidth(mg.firstSlide) + mg.getMargin(mg.firstSlide)) * mg.slides[2].left / 100 * -1;
		console.log("width:" + width);
		mg.currentPosition = width;
		mg.animate(mg.slider, width);
		if(mg.options.sidebarFixed === false) {
			mg.sidebarHide("fast");
		}
		if($.os.ios === true && parseInt($.os.version) >= 5) {
			
		} else {
			
		}
	};
	
	mg.gotoPage = function(page, period) {
		var ls = "middle", i, lsMatrix;
		var currentPeriod = parseInt($("#currentPeriod").attr("class"));//记录杂志信息
		if(currentPeriod !== period) {
			mg.maxPage = (mg.get("category")[mg.currentPeriod].length - 1);
		}
		if((mg.currentPage) === page && currentPeriod === period) {
			return;
		}
		if((mg.currentPage + 1) === page && currentPeriod === period) {
			mg.next();
			return;
		} else if((mg.currentPage - 1) === page && currentPeriod === period) {
			mg.prev();
			return;
		}
		mg.showOverlay();
		mg.currentPage = page;
		mg.setTitle(period);
		mg.set("numberOfPagesToLoad", 3);
		mg.numberOfPagesLoaded = 0;
		if(page > (mg.maxPage - 3)) {
			switch(mg.maxPage - page) {
				case 0:
					ls = "last";
					break;
				case 1:
					ls = "last-but-one";
					break;
				case 2:
					ls = "last-but-two";
					break;
			}
		} else if(page < 3) {
			switch(page) {
				case 0:
					ls = "first";
					break;
				case 1:
					ls = "second";
					break;
				case 2:
					ls = "third";
					break;
			}
		}
		
		lsMatrix = mg.loadingSequence[ls];
		i = lsMatrix.length - 1;
		do {
			mg.loadPage($("#mg-slide-" + mg.slides[lsMatrix[i].slide].slideId), page + lsMatrix[i].page);
			mg.slides[lsMatrix[i].slide].page = page + lsMatrix[i].page;
		}
		while(i--)
		if(currentPeriod !== period) {
			$("#currentPeriod").attr("class", period);
		}
		mg.setHref(mg.currentPeriod);
		mg.addSessionData(mg.getHref(), mg.currentPage);
	};
	
	mg.sidebarShow = function() {
		var width;
		mg.buttonOpen.hide();
		mg.buttonClose.show();
		width = mg.getWidth(mg.sidebar);
		mg.animate(mg.sidebar, width);
		mg.animate(mg.buttonClose, width);
		mg.animate(mg.buttonOpen, width);
	};
	mg.sidebarHide = function(speed) {
		var duration, width = 0;
		speed = speed || "slow";
		duration = mg.get("animationTime");
		if(speed === "fast") {
			duration = "0";
		}
		mg.buttonOpen.show();
		mg.buttonClose.hide();
		
		mg.animate(mg.sidebar, width, 0, 0, duration);
		mg.animate(mg.buttonClose, width, 0, 0, duration);
		mg.animate(mg.buttonOpen, width, 0, 0, duration);
	};
	mg.changePageState = function() {
		var header = $('#header');
		var footer = $('#footer');
		if(header.height() > 0) {
			header.height(0);
			footer.height(0);
		} else {
			header.height(45);
			footer.height(45);
		}
		setHeight();
		mg.center();
	}
	
	mg.animate = function(obj, x, y, z, duration, ease) {
		var x = (x || 0),
			y = (y || 0),
			z = (z | 0),
			duration = (duration || mg.get("animationTime")),
			ease = (ease || mg.get("animationType"));
		if(mg.animation === "3d") {
			if($.os.ios) {
				obj.animate({translate3d: x + "px," + y + "px," + z + "px"}, duration, ease);
			} else {
				obj.animate({translate: x + "px"}, duration, ease);
			}
		} else {
			obj.animate({translate: x + "px"}, duration, ease);
		}
	};
	mg.scrollKinetic = function(el) {
		var list = new FlickList(el),
		positionUpdater;
		list.adjustRange();
		return list;
	};
	mg.scrollKineticPage = function(slideId) {
		var article = document.getElementById(slideId).getElementsByTagName("article");
		var page;
		for(var i = 0 ; i < article.length ; i++) {
			page = article[i].getElementsByClassName("page");
			mg.slideScroller[slideId] = mg.scrollKinetic(page);
		}
	};
}(mg));

// 添加事件监听
(function(mg, undefined) {
	mg.sidebarListener = {
		handleEvent: function(e) {
			switch(e.type) {
			case "click":
				break;
			case "transitionend":
			case "webkitTransitionEnd":
				e.target.removeEventListener(
					e.type,
					mg.sidebarListener,
					false
				);
				//mg.sidebarCalculate();
				setTimeout(function() {
					mg.sidebarScroller.refresh();
				}, 0);
				break;
			}
		}
	};
	mg.addEvent = function(element, event, listener, bubble) {
		var el = document.getElementById(element);
		bubble = bubble || false;
		if("addEventListener" in el) {
			try {
				el.addEventListener(event, listener, bubble);
			} catch(e) {
				if(typeof(listener) == "object" && listener.handleEvent) {
					el.addEventListener(event, function(e) {
						listener.handleEvent.call(listener, e);
					}, bubble);
				} else {
					throw e;
				}
			}
		} else if("attachEvent" in el) {
			if(typeof listener == "object" && listener.handleEvent) {
				el.attachEvent("on" + event, function() {
					listener.handleEvent.call(listener);
				});
			} else {
				el.attachEvent("on" + event, listener);
			}
		}
	}
}(mg));

// 事件处理
(function(mg, undefined) {
	if(mg.touchEnabled === true) {
		$("body").bind("touchmove", function(event) {
			if(!event.elementIsEnabled) {
				event.preventDefault();
			}
		});
	}
	mg.bindEvents = function() {
		if(mg.touchEnabled === true) {
			window.addEventListener("orientationchange", mg.orientation, false);
			mg.slider.swipeRight(function() {
				mg.prev();
			});
			mg.slider.swipeLeft(function() {
				mg.next();
			});
			//$(".mg-slider-page").bind("click", mg.click);
		} else {
			window.addEventListener("resize", mg.center, false);
			$(".mg-slider-page").bind("mousedown", mg.mousedown);
			$(".mg-slider-page").bind("mousemove", mg.mousemove);
			$(".mg-slider-page").bind("mouseup", mg.mouseup);
			//$(".mg-slider-page").bind("click", mg.click);
			$(window).bind("keydown", mg.keydown);
			$(window).bind("keyup", mg.keyup);
		}
	};
	mg.orientation = function(timeout) {
		setHeight();
		var orientation = window.orientation;
		switch(orientation) {
		case 0:
		case 180:
			orientation = "portrait";//横屏
			$(".landscape").hide();
			$(".portrait").show();
			break;
		default:
			orientation = "landscape";//竖屏
			$(".portrait").hide();
			$(".landscape").show();
		}
		mg.center();
	};
	mg.sidebarEvents = function() {
		if(mg.touchEnabled === true) {
			$(".sidebar-list-category").tap(mg.sidebarToggle);
			$(".sidebar-list-item").tap(function() {
				mg.gotoPage(parseInt($(this).attr("id").replace("page-" + mg.currentPeriod + "-", "")), parseInt(mg.currentPeriod));
			});
		} else {
			$(".sidebar-list-category").bind("click", mg.sidebarToggle);
			$(".sidebar-list-item").bind("click", function() {
				mg.gotoPage(parseInt($(this).attr("id").replace("page-" + mg.currentPeriod + "-", "")), parseInt(mg.currentPeriod));
			});
		}
	};
	mg.sidebarToggle = function(event, id) {
		id = id || $(this).attr("id").replace(/sidebar-category-/, "");
		if(mg.sidebarCategoryActive === id) {
			return;
		}
		if(mg.touchEnabled === true) {
			mg.addEvent("sidebar-category-content-" + id, "webkitTransitionEnd", mg.sidebarListener);
		} else {
			mg.addEvent("sidebar-category-content-" + id, "transitionend", mg.sidebarListener);
		}
		$("#sidebar-category-content-" + mg.sidebarCategoryActive).removeClass("sidebar-list-category-active");
		$("#sidebar-category-content-" + mg.sidebarCategoryActive).css("height", 0);
		$("#sidebar-category-content-" + id).addClass("sidebar-list-category-active");
		$("#sidebar-category-content-" + id).css("height", mg.sidebarHightList[id]);
		
		//mg.sidebarCategoryActive = id;
		//mg.currentPeriod = id;
	};
	mg.sidebarGoTo = function(slideId) {
		var category = mg.getCategory(slideId);
		if(mg.sidebarCategoryActive === category) {
		} else {
			mg.sidebarToggle(undefined, category);
		}
	};
	mg.setTitle = function(currentPeriod) {
		var categoryList = mg.get("category");
		var title = categoryList[currentPeriod][mg.currentPage];
		$("#header").html("<div class='left'>《HTML5微周刊》 第" + currentPeriod + "期</div> " + title + "<div class='right'><!--<img src='../images/header_html5.jpg'></img>-->" + mg.get("publishDate")[mg.currentPeriod] + "</div>");
		$("#footer").text("第" + (mg.currentPage + 1) + "页");
	};
	
	mg.getCategory = function(slideId) {
		/*var categoryList = mg.get("category");
		return categoryList[slideId];*/
		return mg.currentPeriod;
	};
	
	mg.sidebarCalculate = function() {
		$(".sidebar-category-content").each(function() {
			//mg.sidebarHightList.push($(this).css("height"));
			var id = $(this).attr("id");
			id = id.replace(/sidebar-category-content-/, "");
			mg.sidebarHightList[id] = $(this).css("height");
			console.log("mg.sidebarHightList" + mg.sidebarHightList);
		});
	};
	
	mg.mousedown = function(e) {
		mg.mouse.startX = e.clientX;
		mg.mouse.startY = e.clientY;
		mg.mouse.initiated = true;
		mg.mouse.moved = false;
	};
	mg.mousemove = function(e) {
		if(mg.mouse.initiated === false) {
			return;
		}
		mg.mouse.moved = true;
		mg.mouse.X = e.clientX;
		mg.mouse.Y = e.clientY;
	};
	mg.mouseup = function(e) {
		if(!mg.mouse.moved)
			return;
		var y = mg.mouse.startY - mg.mouse.Y;
		if(y > 6 || y < -6)
			return;
		var x = mg.mouse.startX - mg.mouse.X;
		if(mg.mouse.startX - mg.mouse.X > 0) {
			mg.next();
		} else {
			mg.prev();
		}
		mg.mouse.initiated = false;
		mg.mouse.moved = false;
	};
	mg.click = function(e) {
		mg.changePageState();
	};
	mg.keydown = function(e) {
		mg.keyCode = e.keyCode;
	};
	mg.keyup = function(e) {
		if(mg.keyCode == 74) {//j
			mg.changePageState();
		} else if(mg.keyCode == 37) {//Left
			mg.prev();
		} else if(mg.keyCode == 39) {//Right
			mg.next();
		}
	}
}(mg));

/*
 * localStorage、sessionStorage
 */
(function(mg, undefined) {
	mg.getLocalData = function(key) {
		if(typeof(localStorage) != "undefined") {
			return localStorage.getItem(key);
		}
		return null;
	};
	
	mg.hasLocalData = function(key) {
		if(typeof(localStorage) != "undefined") {
			return localStorage.getItem(key) != null;
		}
		return false;
	}
	
	mg.addLocalData = function(key, value) {
		if(typeof(localStorage) != "undefined") {
			localStorage.setItem(key, value);
		}
	};
	
	mg.delLocalData = function(key) {
		if(typeof(localStorage) != "undefined") {
			localStorage.removeItem(key);
		}
	};
	
	mg.getSessionData = function(key) {
		if(typeof(sessionStorage) != "undefined") {
			return sessionStorage.getItem(key);
		}
		return null;
	};
	
	mg.hasSessionData = function(key) {
		if(typeof(sessionStorage) != "undefined") {
			return sessionStorage.getItem(key) != null;
		}
		return false;
	}
	
	mg.addSessionData = function(key, value) {
		if(typeof(sessionStorage) != "undefined") {
			sessionStorage.setItem(key, value);
		}
	}
	
	mg.delSessionData = function(key) {
		if(typeof(sessionStorage) != "undefined") {
			sessionStorage.removeItem(key);
		}
	}
}(mg));

// 配置
(function(mg, undefined) {
	var cb;
	// 加载配置文件
	mg.loadOptions = function(callback) {
		cb = callback;
		mg.loadJson(mg.setOptions);
	};
	
	mg.loadJson = function(callback) {
		$.getJSON(
			mg.options.json,//magazine.json
			callback,
			function(error) {
				console.log(error);
			}
		);
	};
	
	mg.setOptions = function(o) {
		var i;
		for(i in o) {
			mg.options[i] = o[i];//合并配置文件
		}
		mg.currentPeriod = parseInt(mg.get("currentPeriod"));
		mg.allPeriod = parseInt(mg.get("allPeriod"));
		var href = window.location.href;
		if(href.indexOf("#") > 0) {
			mg.currentPeriod = parseInt(href.substr(href.indexOf("#") + 1));
		}
		if(mg.currentPeriod < mg.startPeriod) {
			mg.currentPeriod = mg.startPeriod;
		}
		if(mg.currentPeriod > mg.allPeriod) {
			mg.currentPeriod = mg.allPeriod;
		}
		mg.sidebarCategoryActive = mg.currentPeriod;
		cb();//调用mg.start()方法
	};
	
	mg.getHref = function() {
		href = window.location.href;
		if(href.indexOf("#") > 0) {
			//href = href.substr(0, href.indexOf("#"));
		}
		return href;
	}
	
	mg.setHref = function(currentPeriod) {
		href = window.location.href;
		if(href.indexOf("#") > 0) {
			href = href.substr(0, href.indexOf("#"));
			window.location.href = href + "#" + currentPeriod;
		} else {
			window.location.href = href + "#" + currentPeriod;
		}
	};
	
	mg.getWidth = function(obj) {
		var width;
		mg.widthList = (mg.widthList || {});
		console.log("obj:" + obj);
		if(typeof(mg.widthList[obj[0]["id"]]) !== "undefined") {
			return mg.widthList[obj[0]["id"]];
		} else {
			width = obj.css("width");
			width = parseInt(width.replace(/px/, ""));
			return width;
		}
	};
	mg.resetWidth = function() {
		mg.widthList = {};
	};
	mg.getMargin = function(obj) {
		var margin;
		mg.marginList = (mg.marginList || {});
		if(typeof(mg.marginList[obj[0]["id"]]) !== "undefined") {
			return mg.marginList[[obj[0]["id"]]];
		} else {
			margin = obj.css("margin-left");
			margin = parseInt(margin.replace(/px/, ""));
			return margin;
		}
	};
	mg.resetMargin = function() {
		mg.marginList = {};
	};
	
	mg.showOverlay = function() {
		$("#mg-loader").show();
	};
	mg.hideOverlay = function() {// 加载幻灯片完成
		$("#mg-loader").hide();
	}
}(mg));

mg.init();