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

function table(val){
	return console.table(val);
}

;(function($){
	$.fn.scrollBar = function(o){

		var o = $.extend({},{
			x : 0,
			y : 0,
			animateScroll : false,
			callback : function(){}
		},o);

		$.extend( $.easing,
		{
			easeOutExpo: function (x, t, b, c, d) {
				return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
			}
		});

		function callback(parameter){
			return o.callback(parameter);
		}

		return $(this).each(function(){
			var $doc = $(document),
				$this = $(this),
				$inner,

				$bar_y,
				$drag_y,

				$bar_x,
				$drag_x;

			var s_x = parseInt(o.x),
				s_y = parseInt(o.y),
				speed = o.animateScroll ? speed = 60 : speed = 10;

			var val_x,
				val_y,
				isX = false,
				isY = false;

			function main(){
				createHTML();
				initVal();
				eventTrigger();
			}
			main();

			function createHTML(){
					
					$this.css({
						"position" : "relative",
						"width" : $this.width()
					});

					var _wrap,
						_inner,

						_bar_y,
						_drag_y,
						_drag_t_y,
						_drag_m_y,

						_bar_x,
						_drag_x,
						_drag_t_x,
						_drag_m_x;


					_wrap = $("<div class='scrollBar-wrap-sl' />").css({
						"position" : "relative",
						"overflow" : "hidden",
						"width" : $this.width(),
						"height" : $this.height()
					});

					_inner = $("<div class='scrollBar-inner-sl' />").css({
						"position" : "absolute",
						"top" : "0px",
						"left" : "0px"
					});

					if($this.children(".scrollBar-wrap-sl").length == 0){
						_wrap.wrapInner(_inner);

						$this.wrapInner(_wrap);
					}

					$inner = $this.find(".scrollBar-inner-sl");
					_wrap = $this.find(".scrollBar-wrap-sl");

					if($inner.height() > $this.height()){
						_bar_y = $("<div class='scrollBar-bar-y-sl' />");
						_drag_y = $("<div class='scrollBar-drag-y-sl' />");
						_drag_t_y = $("<span class='scrollBar-drag-y-top-sl' />").css({
							"position" : "absolute",
							"top" : "0px",
							"left" : "0px"
						});
						_drag_m_y = $("<span class='scrollBar-drag-y-bottom-sl' />").css({
							"position" : "absolute",
							"bottom" : "0px",
							"left" : "0px"
						});

						_drag_y.append(_drag_t_y.add(_drag_m_y));
						_bar_y.append(_drag_y);
						if($this.children(".scrollBar-bar-y-sl").length == 0){
							$this.append(_bar_y);
						}
						$bar_y = $this.find(".scrollBar-bar-y-sl");
						$drag_y = $this.find(".scrollBar-drag-y-sl");

						if($bar_y.height() <= $drag_y.height()){
							$bar_y.css("height",$drag_y.height()+$drag_y.height()*0.2);
						}

						isY = true;
					}

					if($inner.width() > $this.width()){
						_bar_x = $("<div class='scrollBar-bar-x-sl' />");
						_drag_x = $("<div class='scrollBar-drag-x-sl' />");
						_drag_t_x = $("<span class='scrollBar-drag-x-left-sl' />").css({
							"position" : "absolute",
							"top" : "0px",
							"left" : "0px"
						});
						_drag_m_x = $("<span class='scrollBar-drag-x-right-sl' />").css({
							"position" : "absolute",
							"top" : "0px",
							"right" : "0px"
						});

						_drag_x.append(_drag_t_x.add(_drag_m_x));
						_bar_x.append(_drag_x);
						if($this.children(".scrollBar-bar-x-sl").length == 0){
							$this.append(_bar_x);
						}
						$bar_x = $this.find(".scrollBar-bar-x-sl");
						$drag_x = $this.find(".scrollBar-drag-x-sl");

						if($bar_x.width() <= $drag_x.width()){
							$bar_x.css("width",$drag_x.width()+$drag_x.width()*0.2);
						}

						isX = true;
					}

			}

			function initVal(){

				var sum_x,sum_x_x,sum_y,sum_y_y,rate_x,rate_y;

				if(isX){
					sum_x = $bar_x.width() - $drag_x.width();
					sum_x_x = $inner.width() - $inner.parent().width();
					rate_x = sum_x_x / sum_x;

					val_x = {
						v1 : sum_x,
						v2 : sum_x_x,
						v3 : rate_x
					}

					if(s_x >=  sum_x){
						$drag_x.css("left",sum_x);
					}else{
						$drag_x.css("left",s_x);
					}
					$inner.css("left",s_x * -val_x.v3);
				}

				if(isY){
					sum_y = $bar_y.height() - $drag_y.height();
					sum_y_y = $inner.height() - $inner.parent().height();
					rate_y = sum_y_y / sum_y;

					val_y = {
						v1 : sum_y,
						v2 : sum_y_y,
						v3 : rate_y
					}

					if(s_y >=  sum_y){
						$drag_y.css("top",sum_y);
					}else{
						$drag_y.css("top",s_y);
					}
					$inner.css("top",s_y * -val_y.v3);
				}

				//callback(o.initVal/val.v1*100);

			}


			function run(attr,parameter){

				function r(_){
					var animation = function(v1,v2){
						_.drag.stop().animate(v1,{
							duration : 600,
							easing : "easeOutExpo"
						});

						$inner.stop().animate(v2,{
							duration : 600,
							easing : "easeOutExpo"
						});
					}
					
					if(_.curVal <= 0){
						_.obj1[_.attr]  = _.curVal = 0;
						_.obj2[_.attr] = _.curVal * -_.s_val.v3;
						if(o.animateScroll){
							animation(_.obj1,_.obj2);
						}else{
							_.drag.css(_.obj1);
							$inner.css(_.obj2);
						}
					}else if(_.curVal >=_.s_val.v1){
						_.obj1[_.attr] = _.curVal = _.s_val.v1;
						_.obj2[_.attr] = _.curVal * -_.s_val.v3;
						if(o.animateScroll){
							animation(_.obj1,_.obj2);
						}else{
							_.drag.css(_.obj1);
							$inner.css(_.obj2);
						}
					}else{
						_.obj1[_.attr] = _.curVal;
						_.obj2[_.attr] = _.curVal * -_.s_val.v3;
						if(o.animateScroll){
							animation(_.obj1,_.obj2);
						}else{
							_.drag.css(_.obj1);
							$inner.css(_.obj2);
						}
					}
				}

				if(attr == "x"){
					r({
						drag : $drag_x,
						curVal : parameter,
						s_val : val_x,
						attr : "left",
						obj1 : {},
						obj2 : {}
					});
				}
				
				if(attr == "y"){
					r({
						drag : $drag_y,
						curVal : parameter,
						s_val : val_y,
						attr : "top",
						obj1 : {},
						obj2 : {}
					});
				}

				//callback(parameter/val.v1*100);
				
			}

			function mousePos(attr,event){
				var m;
				m = (attr == "x") ? {
					p : $drag_x.position().left,
					t : event.pageX - $this.offset().left
				} : {
					p : $drag_y.position().top,
					t : event.pageY - $this.offset().top
				};
				return m;
			}
			
			function eventTrigger(){

				function e(_){
					var attr = _.attr == "y" ? "height" : "width";
					_.drag.bind("mousedown",function(event){
						event.stopPropagation();
						event.preventDefault();
						var start = mousePos(_.attr,event).t - mousePos(_.attr,event).p;
						$(document).bind("mousemove",function(event){
							if(o.animateScroll){
								$.fx.off = !$.fx.off;
							}
							run( _.attr , mousePos(_.attr,event).t - start  );
						});
					});

					_.bar.bind("mousedown",function(event){
						event.preventDefault();
						run( _.attr , mousePos(_.attr,event).t - _.drag[ attr ]()/2 );
						$(document).bind("mousemove",function(event){
							if(o.animateScroll){
								$.fx.off = !$.fx.off;
							}
							run( _.attr , mousePos(_.attr,event).t - _.drag[ attr ]()/2 );
						});
					});
				}
				
				if(isY){
					e({
						drag : $drag_y,
						bar : $bar_y,
						attr : "y"
					});
				}

				if(isX){
					e({
						drag : $drag_x,
						bar : $bar_x,
						attr : "x"
					});
				}

				$(document).bind("mouseup",function(){
					$(document).unbind("mousemove");
				})

				if($doc.mousewheel && isY){
					$bar_y.add($this).bind("mousewheel",function(event,deilt){
						event.preventDefault();
						run( "y" , $drag_y.position().top -= deilt*speed );
					});
				}

				if($doc.mousewheel && !isY && isX){
					$bar_x.add($this).bind("mousewheel",function(event,deilt){
						event.preventDefault();
						run( "x" , $drag_x.position().left -= deilt*speed );
					});
				}

			}
			
		})

	}
})(jQuery);
