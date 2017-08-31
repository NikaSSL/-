/**
 * Swipe.js
 * @authors Your Name (you@example.org)
 * @date    2017-08-25 15:39:36
 * @version $Id$
 */
function Swipe (container) {
	var ele = container.find(':first');
	var slides = ele.find('>');
	var swipe = {};
	
	//获取容器尺寸
	var width = container.width();
	var height = container.height();

	//设置li页面总宽度
	ele.css({
		width:(slides.length*width)+'px',
		height:height+'px'
	})

	//设置每一个页面li的宽度
	$.each(slides,function(index){
		var slide = slides.eq(index);
		slide.css({
			width:width+'px',
			height:height+'px'
		});
	});

	//监控完成与移动
	swipe.scrollTo = function(x,speed){
		//执行动画移动
		ele.css({
			"transition-timing-function":'linear',
			"transition-duration":speed+'ms',
			'transform':'translate3d(-'+x+'px,0px,0px)'
		});
		return this;
	}
	return swipe;
}
