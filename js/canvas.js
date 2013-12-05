/**
 * 首页动画
 * author:peter
 * date:2012-03-13
 */
var indexMovie = (function() {
	var indexMovie = {
		canvasWidth: 0,
		canvasHeight: 0,
		backgroundImg: new Image(),
		images: [
			"../images/movie_1.jpg",
			"../images/movie_2.jpg",
			"../images/movie_3.jpg",
			"../images/movie_4.jpg",
			"../images/movie_5.jpg"
		],
		ctx: {},
		backgroundIndex: 0,
		fontSize: 10,
		text: "",
		texts: [
			"在每一个清晨",
			"有一群人怀着梦想准备奋斗着",
			"他们相信科技可以改变世界",
			"人们称他们是程序猿",
			"《HTML5微周刊》感谢有你"
		],
		intervalId: ""
	};
	return indexMovie;
}());

window.indexMovie = indexMovie || {};

(function(indexMovie) {
	indexMovie.init = function() {
		indexMovie.loadImage();
		indexMovie.loadText();
		indexMovie.ctx = document.getElementById("canvas").getContext("2d");
		var width = parseInt($("#canvas").css("width").replace(/px/, ""));
		var height = parseInt($("#canvas").css("height").replace(/px/, ""));
		$("#canvas").attr("width", width);
		$("#canvas").attr("height", height);
		indexMovie.canvasWidth = parseInt($("#canvas").attr("width"));
		indexMovie.canvasHeight = parseInt($("#canvas").attr("height"));
		indexMovie.gameLoop();
		indexMovie.intervalId = setInterval(indexMovie.gameLoop, 2000);
	};
	indexMovie.loadImage = function() {
		indexMovie.backgroundImg.src = indexMovie.images[indexMovie.backgroundIndex];
	}
	indexMovie.loadText = function() {
		indexMovie.text = indexMovie.texts[indexMovie.backgroundIndex];
	}
	indexMovie.gameLoop = function() {
		indexMovie.ctx.clearRect(0, 0, indexMovie.canvasWidth, indexMovie.canvasHeight);
		indexMovie.ctx.save();
		if(indexMovie.fontSize > 30) {
			indexMovie.backgroundIndex++;
			indexMovie.fontSize = 10;
		}
		if(indexMovie.backgroundIndex > 4) {
			indexMovie.backgroundIndex = 0;
			clearInterval(parseInt(indexMovie.intervalId));
			$("#indexImg").show();
			$("#canvas").hide();
		}
		indexMovie.loadImage();
		indexMovie.loadText();
		indexMovie.ctx.drawImage(indexMovie.backgroundImg, 0, 0, indexMovie.canvasWidth, indexMovie.canvasHeight);
		indexMovie.ctx.fillStyle = "#ffffff";
		indexMovie.ctx.font = "italic 20px sans-serif";
		indexMovie.ctx.textBaseline = "top";
		indexMovie.ctx.fillText(indexMovie.text, indexMovie.canvasWidth / 3, indexMovie.canvasHeight - 100);
		//indexMovie.ctx.font = "bold 30px sans-serif";
		//indexMovie.ctx.strokeText("在每一个清晨", 100, 100);
		indexMovie.ctx.restore();
		indexMovie.fontSize += 5;
	}
}(indexMovie));