/*
	author:CaoZhenHui
	function:rem计算
	Last Update:2018-11-20
*/
document.documentElement.style.fontSize = document.documentElement.clientWidth/14.4+"px";
window.onload = function(){
	window.onresize=function(){
		document.documentElement.style.fontSize = document.documentElement.clientWidth/14.4+"px";
	};
	document.onkeydown = function (e) {
		if (e.keyCode === 13) {
			if(document.getElementById('btn')){
				var evt = document.createEvent("MouseEvents");
				evt.initEvent("click", true, true);
				document.getElementById('btn').dispatchEvent(evt);
			}
		}
	};
}