/*
 * scrollBar version 1.0
 *
 * author by 深蓝
 * http://www.5code.net/plugin/scrollBar/scrollBar.html
 * Email:raowen520@gmail.com
 *
 * Date:2013-11-05
 *
 */

function log(val){
	return console.log(val);
}

;(function($){
	$.fn.scrollBar = function(o){

		var o = $.extend({},{
			width : 300,
			height : 20,
			initValSrart : false,
			initVal : 0,
			wheelElement : null,
			wheel : true,
			mode : "h",  //"h" or "v"
			animate : function(el,dir,target){
				animate(el,dir,target);
			},
			callback : function(){}
		},o);

		function animate(el,dir,target){
			var cur = parseInt(el.position()[dir]);
			;(function(){
				target = Math.round(target);
				var duration = (target - cur) / 4.2;
				duration = duration > 0 ? Math.ceil(duration) : Math.floor(duration);
				cur = cur + duration;
				el.css(dir,cur);
				el.timer = setTimeout(arguments.callee,40);
				if(cur == target){
					el.timer && clearTimeout(el.timer);
				}
			})();
		}

		return $(this).each(function(){
			var $doc = $(document),
				$this = $(this),
				$drag;

			var s1 = o.initVal;

			var mode,current=0,result=0,rate=0;

			function main(){
				createHTML();
				mode = mode();
				if(!mode){
					alert("模式错误或者默认值超出容器大小!");
					return false;
				}

				initValSrart();
				eventTrigger();
			}
			main();

			function initValSrart(){
				current = o.initVal/mode.s*100;
				if(o.initValSrart){
					result = 100 - current;
					rate = result / (mode.s-mode.g);
					$drag.css(mode.d,s1 = 0);
				}else{
					$drag.css(mode.d,o.initVal);
				}
				callback(current);
			}

			function callback(parameter){
				return o.callback(parameter);
			}

			function mode(){
				var m;
				m = o.mode == "h" ? { d : "left" , s : o.width , g : $drag.width() } : o.mode == "v" ? { d : "top" , s : o.height , g : $drag.height() } : false;
				if(o.initVal > m.s){
					return false;
				}
				return m;
			}

			function createHTML(){
				$this.addClass("scrollBar-wrap-sl").css({
					position : "relative",
					width : o.width,
					height : o.height
				});

				$drag = $this.html("<div class='scrollBar-drag-sl' />")
				.children().css({
					position : "absolute",
					top : 0,
					left : 0
				});
			}

			function run(parameter){
				$drag.timer && clearTimeout($drag.timer);
				var sum = mode.s-mode.g;
				if(parameter <= 0){
					animate($drag,mode.d,s1 = parameter = 0);
				}else if(parameter >= sum){
					animate($drag,mode.d,s1 = parameter = sum);
				}else{
					animate($drag,mode.d,parameter);
				}
				if(o.initValSrart){
					callback(current+parameter*rate);
				}else{
					callback(parameter/sum*100);
				}
			}

			function mousePos(event){
				var m;
				m = o.mode == "h" ? $.extend({},{
					p : $drag.position().left,
					t : event.pageX - $this.offset().left
				},mode) : $.extend({},{
					p : $drag.position().top,
					t : event.pageY - $this.offset().top
				},mode);
				return m;
			}
			
			function eventTrigger(){
				$drag.bind("mousedown",function(event){
					event.stopPropagation();
					event.preventDefault();
					var start = mousePos(event).t - mousePos(event).p;
					$(document).bind("mousemove",function(event){
						run( s1 = mousePos(event).t - start  );
					});
				});

				$(document).bind("mouseup",function(){
					$(document).unbind("mousemove");
				})

				$this.bind("mousedown",function(event){
					event.preventDefault();
					run( s1 = mousePos(event).t - mode.g/2 );
					$(document).bind("mousemove",function(event){
						run( s1 = mousePos(event).t - mode.g/2  );
					});
				})

				if(o.wheel && $doc.mousewheel){
					$this.add(o.wheelElement).bind("mousewheel",function(event,deilt){
						event.preventDefault();
						run(s1-=deilt*8);
					});
				}
			}
			
		})

	}
})(jQuery);
