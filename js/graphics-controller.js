// Code goes here
(function() {


  CC = {



    createGraphis: function(options) {

      var init = function(options) {
        //overriding this properties with with optionsproperties
        $.extend(this, options);
        this.canvas = $(this.target)[0];
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx.width = this.canvas.width;
        this.ctx.height = this.canvas.height;
        this.x = options.x===0?0:options.x||this.width/2;
        this.y = options.y===0?0:options.y||this.height/2;
      }




      graphics = {
        canvas: null,
        color: 'white',
        gridColor:'rgba(125,125,125,0.1)',
        ctx: null,
        width: 0,
        height: 0,
        counter: 0,
        unit:50,//1 unit = 50 px;
        x:0,y:0,
        showGrid:false,
        clear: function() {
          clear.call(this, null);
        },        
        center:function(c){
        	if(c){
        		this.x=c.x;this.y=c.y;
        	}else{
        		return {x:this.x,y:this.y};
        	}
        },
        create: function(objectName, settings) {
          return create(objectName, settings);
        },
        draw: function(boxObject, settings) {
          return draw.call(this, boxObject, settings), this;
        },
		drawArray:function(boxObjects,settings){
			var that = this;
			$.each(boxObjects,function(i,boxObject){
				that.draw(boxObject,settings);
			});
			return this;
		},
        loop: function(renderCallback, time) {
          loop.call(this, renderCallback, time);
        },
		stopLoop:function(requestId){
			cancelAnimationFrame(requestId);
		},

      }

      //objectUtil.js contents should be loaded here  
      //drawingUtil.js contents shoule be loaded here


      var create = function(objectName, settings) {
        if (ObjectDispatcher[objectName]) {
		  var object = new ObjectDispatcher[objectName][0]();
		  if(object.dType == 'Img'){
		   Object.defineProperty(object, "src", {				
				set: function(src) { 					
					this.img.src = src;
				}
			});
		  };		 
          return $.extend(object, settings);
        } else {
          throw new Error('No such object ' + objectName);
        }
      };

      var draw = function(boxObject, settings) {		
        if (boxObject.update) {
          boxObject.update()
        }
        var options = (typeof boxObject === "string") ? settings : $.extend($.extend({}, boxObject), settings);
        this.ctx.save();
        this.ctx = $.extend(this.ctx, options);
        this.ctx.translate((this.x+options.x)*this.unit,this.height-(this.y+options.y)*this.unit);   
        ObjectDispatcher[boxObject.dType || boxObject][1].call(this, options);
        this.ctx.restore();
      }

    var ObjectDispatcher = {
		Box2d:[Box2d,''],
		Rectangle:[Rectangle,drawRectangle],
		Circle:[Circle,drawCircle],
		Line:[Line,drawLine],
		Sphere:[Sphere,drawSphere],
		Text:[Text,drawText],		
		Path:[Path,drawPath],
		Tracer:[Tracer,drawTracer],
		Layer:[Layer,drawLayer],	
		Img:[Img,drawImg],
	}    
      var animLoop = function(renderCallback) {
        g.animRequest = requestAnimFrame(animLoop.bind(this, renderCallback));       
        renderCallback(this.counter++,g.animRequest);
      }

      var timeOutLoop = function(renderCallback, time) {
        g.timeOutRequest = window.setTimeout(function() {
				timeOutLoop.call(this, renderCallback, time);
			}, time);        
        renderCallback(this.counter++, g.timeOutRequest);
      }

      var loop = function(renderCallback, time) {
        if (time) {
          timeOutLoop.call(this, renderCallback, time);
        } else {
          animLoop.call(this, renderCallback);
        }
      }



      init.call(graphics, options);
      return graphics;

    }

  }


}());


window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();
