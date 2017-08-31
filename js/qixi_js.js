/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-08-25 15:20:10
 * @version $Id$
 */

	// 动画结束事件
	var animationEnd = (function() {
	   var explorer = navigator.userAgent;
	   if (~explorer.indexOf('WebKit')) {
	       return 'webkitAnimationEnd';
	   }
	   return 'animationend';
	})();


    /////////
    //背景音乐 //
    /////////

    // 音乐配置
    var audioConfig = {
        enable: true, // 是否开启音乐
        playURL: 'music/happy.wav', // 正常播放地址
        cycleURL: 'music/circulation.wav' // 正常循环播放地址
    };

    function Html5Audio(url, isloop) {
        var audio = new Audio(url);
        audio.autoPlay = true;
        audio.loop = isloop || false;
        audio.play();
        return {
            end: function(callback) {
                audio.addEventListener('ended', function() {
                    callback();
                }, false);
            }
        };
    }

	///////////
	//B页面-灯动画 //
	///////////
	
	var lamp = {
	   elem: $('.b_background'),
	   bright: function() {
	       this.elem.addClass('lamp-bright');
	   },
	   dark: function() {
	       this.elem.removeClass('lamp-bright');
	   }
	};

	///////////
	//B页面-门动画 //
	///////////	
	function Door(){

		function doorAction(left, right, time) {
		   var doorLeft = $('.door-left');
		   var doorRight = $('.door-right');
		   var defer = $.Deferred();
		   var count = 2;
		   // 等待开门完成
		   var complete = function() {
		       if (count == 1) {
		           defer.resolve();
		           return;
		       }
		       count--;
		   }

		   doorLeft.transition({
		       'left': left
		   }, time, complete);
		   doorRight.transition({
		       'left': right
		   }, time, complete);
		   return defer;
		}

		// 开门
		function openDoor() {
		   return doorAction('-50%', '100%', 1000);
		}

		// 关门
		function shutDoor() {
		   return doorAction('0%', '50%', 200);
		}

		return{
			openDoor: function(){
				openDoor();
			},
			shutDoor: function(){
				shutDoor();
			}
		}	
	}


    /////////
    //B-页面飞鸟 //
    /////////
    var bird = {
        elem: $(".bird"),
        fly: function() {
            this.elem.addClass('birdFly')
            this.elem.transition({
                right: container.width()
            }, 15000, 'linear');
        }
    };

    ///////////
    //C页面-logo动画 //
    ///////////
    var logo = {
        elem: $('.logo'),
        run: function() {
            this.elem.addClass('logolightSpeedIn')
                .on(animationEnd, function() {
                    $(this).addClass('logoshake').off();
                });
        }
    };

	////////
	//C页面-雪花飘落 //
	////////
	var snowflakeURL = [
		'images/snowflake/snowflake1.png',
		'images/snowflake/snowflake2.png',
		'images/snowflake/snowflake3.png',
		'images/snowflake/snowflake4.png',
		'images/snowflake/snowflake5.png',
		'images/snowflake/snowflake6.png'
	];

    function snowflake() {
        // 雪花容器
        var $flakeContainer = $('#snowflake');

        // 随机六张图
        function getImagesName() {
            return snowflakeURL[[Math.floor(Math.random() * 6)]];
        }
        // 创建一个雪花元素
        function createSnowBox() {
            var url = getImagesName();
            return $('<div class="snowbox" />').css({
                'width': 41,
                'height': 41,
                'position': 'absolute',
                'backgroundSize': 'cover',
                'zIndex': 100000,
                'top': '-41px',
                'backgroundImage': 'url(' + url + ')'
            }).addClass('snowRoll');
        }
        // 开始飘花
        setInterval(function() {
            // 运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity    = 1,
                endPositionTop  = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $flake = createSnowBox();

            // 设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity : randomStart
            });

            // 加入到容器
            $flakeContainer.append($flake);

            // 开始执行动画
            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove() //结束后删除
            });            
        }, 200);
    }	

	var container = $("#content");
	var swipe = Swipe(container);
	var visualWidth = container.width();
	var visualHeight = container.height();

	// 页面滚动到指定的位置
	function scrollTo(time, proportionX) {
	   var distX = visualWidth * proportionX;
	   swipe.scrollTo(distX, time);
	}

	// 获取数据
	var getValue = function(className) {
	   var $elem = $('' + className + '');
	       //走路的路线坐标
	   return {
	       height: $elem.height(),
	       top: $elem.position().top
	   };
	};

	// 桥的Y轴
	var bridgeY = function() {
	   var data = getValue('.c_background_middle');
	   return data.top;
	}();




	////////
	//小女孩 //
	////////
	var girl = {
		elem: $('.girl'),
		getHeight: function() {
		    return this.elem.height();
		},
		// 转身动作
		rotate: function() {
		    this.elem.addClass('girl-rotate');
		},
		setOffset: function() {
		    this.elem.css({
		        left: visualWidth / 2,
		        top: bridgeY - this.getHeight()
		    });
		},
		getOffset: function() {
		    return this.elem.offset();
		},
		getWidth: function() {
		    return this.elem.width();
		}
	};

	// 修正小女孩位置
	girl.setOffset();


	////////
	//小男孩 //
	////////
	function BoyWalk() {

	   var container = $("#content");
	   // 页面可视区域
	   var visualWidth = container.width();
	   var visualHeight = container.height();

	   // 获取数据
	   var getValue = function(className) {
	       var $elem = $('' + className + '');
	       // 走路的路线坐标
	       return {
	           height: $elem.height(),
	           top: $elem.position().top
	       };
	   };
	   // 路的Y轴
	   var pathY = function() {
	       var data = getValue('.a_background_middle');
	       return data.top + data.height / 2;
	   }();
	   
	   var $boy = $("#boy");
	   var boyWidth = $boy.width();
	   var boyHeight = $boy.height();

	   // 修正男孩位置  
	   $boy.css({
	       top: pathY - boyHeight + 25
	   });

	   // 暂停走路
	   function pauseWalk() {
	       $boy.addClass('pauseWalk');
	   }

	   // 恢复走路
	   function restoreWalk() {
	       $boy.removeClass('pauseWalk');
	   }

	   // css3的动作变化
	   function slowWalk() {
	       $boy.addClass('slowWalk');
	   }

	   // 用transition做运动
	   function stratRun(options, runTime) {
	       var dfdPlay = $.Deferred();
	       // 恢复走路
	       restoreWalk();
	       // 运动的属性
	       $boy.transition(
	           options,
	           runTime,
	           'linear',
	           function() {
	               dfdPlay.resolve(); // 动画完成
	           });
	       return dfdPlay;
	   }

	   // 开始走路
	   function walkRun(time, dist, disY) {
	       time = time || 3000;
	       // 脚动作
	       slowWalk();
	       // 开始走路
	       var d1 = stratRun({
	           'left': dist + 'px',
	           'top': disY ? disY : undefined
	       }, time);
	       return d1;
	   }

	   // 走进商店
	   function walkToShop(runTime) {
	       var defer = $.Deferred();
	       var doorObj = $('.door');

	       // 门的坐标
	       var offsetDoor = doorObj.offset();
	       var doorOffsetLeft = offsetDoor.left;
	       
	       // 小孩当前的坐标
	       var offsetBoy = $boy.offset();
	       var boyOffsetLeft = offsetBoy.left;

	       // 中间位置
	       var boyMiddle = $boy.width() / 2;
	       var doorMiddle = doorObj.width() / 2;

	       // 当前需要移动的坐标
	       instanceX = (doorOffsetLeft + doorMiddle) - (boyOffsetLeft + boyMiddle);

	       // 开始走路
	       var walkPlay = stratRun({
	           transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
	           opacity: 0.1
	       }, runTime);

	       // 走路完毕
	       walkPlay.done(function() {
	           $boy.css({
	               opacity: 0
	           });
	           defer.resolve();
	       });
	       return defer;
	   }

	   // 走出店
	   function walkOutShop(runTime) {
	       var defer = $.Deferred();
	       restoreWalk();
	       // 开始走路
	       var walkPlay = stratRun({
	           transform: 'translateX(' + instanceX + 'px),translateY(0),scale(1,1)',
	           opacity: 1
	       }, runTime);
	       // 走路完毕
	       walkPlay.done(function() {
	           defer.resolve();
	       });
	       return defer;
	   }


	   // 计算移动距离
	   function calculateDist(direction, proportion) {
	       return (direction == "x" ?
	           visualWidth : visualHeight) * proportion;
	   }

	   return {
	       // 开始走路
	       walkTo: function(time, proportionX, proportionY) {
	           var distX = calculateDist('x', proportionX);
	           var distY = calculateDist('y', proportionY);
	           return walkRun(time, distX, distY);
	       },
	       // 走进商店
	       toShop: function() {
	           return walkToShop.apply(null, arguments);
	       },
	       // 走出商店
	       outShop: function() {
	           return walkOutShop.apply(null, arguments);
	       }, 
	       // 停止走路
	       stopWalk: function() {
	           pauseWalk();
	       },
	       setColoer: function(value) {
	           $boy.css('background-color', value)
	       },
	       // 获取男孩的宽度
	       getWidth: function() {
	           return $boy.width();
	       },
	       // 复位初始状态
	       resetOriginal: function() {
	           this.stopWalk();
	           // 恢复图片
	           $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
	       },
	       // 转身动作
	       rotate: function(callback) {
	           restoreWalk();
	           $boy.addClass('boy-rotate');
	           // 监听转身完毕
	           if (callback) {
	               $boy.on(animationEnd, function() {
	                   callback();
	                   $(this).off();
	               });
	           }
	       },
	       // 取花
	       takeflower: function() {
	           $boy.addClass('slowFlowerWalk');
	       }
	   }
	}

