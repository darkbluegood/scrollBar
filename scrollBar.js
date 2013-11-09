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
			initVal : 0,
			wheelElement : null,
			wheel : true,
			mode : "h",  //"h" or "v"
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

		function callback(parameter){
			return o.callback(parameter);
		}

		function checkWheelEl(el){
			if(el && typeof el == "object" && el.length >= 1){
				return el;
			}else{
				return false;
			}
			if(typeof el == "string"){
				return $(el);
			}else{
				return false;
			}
		}

		return $(this).each(function(){
			var $doc = $(document),
				$this = $(this),
				$drag;

			var s1 = o.initVal;

			var mode,val;

			function main(){
				createHTML();
				mode = mode();
				if(!mode){
					alert("模式错误或者默认值超出容器大小!");
					return false;
				}

				initVal();
				eventTrigger();
			}
			main();

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

			function mode(){
				var m;
				m = o.mode == "h" ? { d : "left" , s : o.width , g : $drag.width() } : o.mode == "v" ? { d : "top" , s : o.height , g : $drag.height() } : false;
				if(o.initVal > m.s){
					return false;
				}
				return m;
			}

			function initVal(){

				var sum1,sum2,rate,el;

				sum1 =  mode.s - mode.g;

				if(el = checkWheelEl(o.wheelElement)){
					sum2 = el.height() - el.parent().height();
					rate = sum2 / sum1;
					el.css("top",o.initVal * -rate);
				}

				val = {
					v1 : sum1,
					v2 : sum2,
					v3 : rate
				}
				$drag.css(mode.d,o.initVal);

				callback(o.initVal/val.v1*100);

			}



			function run(parameter){
				$drag.timer && clearTimeout($drag.timer);

				if(parameter <= 0){
					animate($drag,mode.d,s1 = parameter = 0);
					if(checkWheelEl(o.wheelElement)){
						animate(o.wheelElement,"top",0);
					}
				}else if(parameter >= val.v1){
					animate($drag,mode.d,s1 = parameter = val.v1);
					if(checkWheelEl(o.wheelElement)){
						animate(o.wheelElement,"top",parameter * -val.v3);
					}
				}else{
					animate($drag,mode.d,parameter);
					if(checkWheelEl(o.wheelElement)){
						animate(o.wheelElement,"top",parameter * -val.v3);
					}
				}

				callback(parameter/val.v1*100);
				
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
