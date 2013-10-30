;(function($){

	function log(val){
		return console.log(val)
	}

	$.fn.scrollBar = function(options){

		var options = $.extend({},{
			mode : "v",  //"h" or "v"
			width : 20,
			height : 250,
			defaultStart : false,
			defaultVal : 0,
			wheel : false,
			wheelElement : null,
			callback : function(){}
		},options);

		$(this).each(function(){
			var $this = $(this),
				doc = $(document),
				drag = $("<div class='scrollBar-drag-sl'></div>");

			var on_off = false,
				wheelPos = options.defaultStart ? 0 : options.defaultVal;

			var mode = options.mode == "h" ? 
			{ d : options.mode , s : "width" , m : "left" , val : options.width } : 
			options.mode == "v" ? 
			{ d : options.mode , s : "height" , m : "top" , val : options.height } : 
			false ;

			if(!mode){
				alert("输入错误!");
				return false;
			}

			var rate = Math.round((options.defaultVal/mode.val)*100);

			function init(){
				if(!$this.hasClass("scrollBar-bar-sl")){
					$this.addClass("scrollBar-bar-sl");
				}
				$this.css({
					"width" : options.width,
					"height" : options.height
				});
				$this.append(drag);
				options.callback(rate);
				if(options.defaultStart){
					drag.css(mode.m,0);
				}else{
					drag.css(mode.m,options.defaultVal);
				}
				eventHandler();
			}
			init();

			mode = $.extend(mode,{
				dragVal : drag.width()
			});

			var g1 = mode.val - mode.dragVal,
				g2 = mode.dragVal / 2,
				g3 = 100-rate;
				g4 = g3/g1;

			if(options.defaultVal > g1){
				alert("默认值应该小于等于总宽度");
				return false;
			}
			
			function eventHandler(){
				drag.bind("mousedown",function(event){
					event.preventDefault();
					event.stopPropagation();
					doc.bind("mousemove",sliderMove);
				});	

				doc.bind("mouseup",function(){
					doc.unbind("mousemove",sliderMove);
				});

				$this.bind("mousedown",sliderClick);

				if(options.wheel && doc.mousewheel){
					if(options.wheelElement){
						options.wheelElement.addClass("scrollBar-box-1223-sl");
					}
					$this.add(options.wheelElement).bind("mousewheel",function(event,deilt){

						event.preventDefault();
						wheelPos -= deilt*10;
						run(wheelPos);
						
					})
				}
			}
			
			function posFunc(event){
				if(typeof event != "object"){
					return 0;
				}
				mode = $.extend(mode,{
					pos : mode.d == "h" ? event.pageX - $this.offset().left - g2 : event.pageY - $this.offset().top - g2
				});
				return mode.pos;
			}

			function run(event){
				posDeilt = wheelPos + posFunc(event);
				wheelPos = posDeilt;
				if(posDeilt <= 0){
					wheelPos=0;
					drag.css(mode.m,"0");
					if(options.defaultStart){
						options.callback(rate);
					}else{
						options.callback(0);
					}
				}else if(mode.val - posDeilt < g2*2){
					wheelPos = g1;
					drag.css(mode.m,g1);
					options.callback(100);
				}else{
					drag.css(mode.m,posDeilt);
					if(options.defaultStart){
						var rate1 = posDeilt*g4;
						options.callback(Math.round((rate + rate1)));
					}else{
						options.callback(Math.round((posDeilt/g1)*100));
					}
				}
			}

			function sliderMove(event){
				wheelPos =0;
				run(event)
			}

			function sliderClick(event){
				wheelPos =0;
				run(event)
			}
		});
	}

})(jQuery);