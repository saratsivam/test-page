// Code goes here
(function() {


  GUtil = {
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
          drawingUtil.clear.call(this, null);
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
          	return loopUtil.loop(this, renderCallback, time);
        },
	stopLoop:function(loopId){
		loopUtil.stopLoop(loopId);
	},
	startLoop:function(loopId){
		loopUtil.startLoop(loopId);
	},
	toggleLoop:function(loopId){
		loopUtil.toggleLoop(loopId);
	},
	toggleLoops:function(){
		loopUtil.toggleLoops();
	},
	clearLoops:function(){		
		loopUtil.clearLoops();
	}
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
          if(!boxObject.dropShadow){
        	boxObject.removeShadow();
        }
        var options = (typeof boxObject === "string") ? settings : $.extend($.extend({}, boxObject), settings);
        this.ctx.save();
        this.ctx = $.extend(this.ctx, options);
        this.ctx.translate((this.x+options.x)*this.unit,this.height-(this.y+options.y)*this.unit);   
      
        ObjectDispatcher[boxObject.dType || boxObject][1].call(this, options);
        this.ctx.restore();
      }

    ObjectDispatcher = {
		Box2d:[objectUtil.Box2d,''],
		Rectangle:[objectUtil.Rectangle,drawingUtil.drawRectangle],
		Circle:[objectUtil.Circle,drawingUtil.drawCircle],
		Line:[objectUtil.Line,drawingUtil.drawLine],
		Sphere:[objectUtil.Sphere,drawingUtil.drawSphere],
		Text:[objectUtil.Text,drawingUtil.drawText],		
		Path:[objectUtil.Path,drawingUtil.drawPath],
		Tracer:[objectUtil.Tracer,drawingUtil.drawTracer],
		Layer:[objectUtil.Layer,drawingUtil.drawLayer],	
		Img:[objectUtil.Img,drawingUtil.drawImg],
	}    
	
	
	
	var requestId=0;
      var animLoop = function(renderCallback,loopId) {       
        requestId = requestAnimFrame(animLoop.bind(this, renderCallback,loopId));
	loopUtil.pushRequest(loopId,requestId);
        renderCallback(this.counter++);
      }

      var timeOutLoop = function(renderCallback, time, loopId) {
        requestId = window.setTimeout(function() {
				timeOutLoop.call(this, renderCallback, time, loopId);
			}, time);        
	loopUtil.pushRequest(loopId,requestId);
        renderCallback(this.counter++);
      }



      loopUtil = {
		loopCount:0,
		loopRegister:{},
		pushRequest:function(loopId, requestId){
			this.loopRegister[loopId].requestId=requestId;
		},
		pushLoopDetails:function(context,renderCallback, time,requestId){
			var loopId  = this.loopCount++;
			this.loopRegister[loopId]={
				context:context,
				requestId:requestId,
				renderCallback:renderCallback,
				time:time,
				started:false,
			}
			return loopId;
		},
		loop:function(context, renderCallback, time){			
		      	var loopId = this.pushLoopDetails(context,renderCallback,time);		      	
			this.startLoop(loopId);
			return loopId
		},				
		stopLoop:function(loopId){
			var loop = this.loopRegister[loopId];		
			loop.started=false;			
			cancelAnimationFrame(loop.requestId);
		},
		startLoop:function(loopId){
			this.stopLoop(loopId);
			var loop = this.loopRegister[loopId];		
			loop.started=true;	
			if(loop.time){
				  timeOutLoop.call(loop.context, loop.renderCallback, loop.time,loopId);
			}else{				
				animLoop.call(loop.context, loop.renderCallback,loopId);
			}
				
		},
		toggleLoop:function(loopId){
			var loop = this.loopRegister[loopId];		
			if(loop.started){
				this.stopLoop(loopId);
			}else{
				this.startLoop(loopId);
			}
		},
		toggleLoops:function(){
			for(var loopId in this.loopRegister){
				this.toggleLoop(loopId);
			}
		},
		clearLoops:function(){
			for(var loopId in this.loopRegister){
				this.stopLoop(loopId);
			}
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
