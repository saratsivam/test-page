var Box2d = function() {
  this.x = 0;
  this.y = 0;
  this.vx = 1.5;
  this.vy = 1;  
  this.w = 1;
  this.h = 1;
  this.dt = 1/60;
  //drawing properties    
  this.showFill = false;
  this.hideStroke = false;
  this.lineWidth = 2;
  this.fillStyle = 'rgba(0,0,0,0.2)';
  this.strokeStyle = 'rgba(0,0,0,0.5)';
//dropShadow
  this.dropShadow = true;
  this.shadowColor = "black";
  this.shadowOffsetX = 5;
  this.shadowOffsetY = 5;
  this.shadowBlur = 5;
  //scalling
   this.scaleX = 1;
   this.scaleY = 1;  
   //transform
   this.m11=1;
   this.m12=0;
   this.m21=0;
   this.m22=1;
   this.dx=0
   this.dy=0;
  
  this.position = function(p){
	if(p){
		this.x=p.x;
		this.y=p.y;
	}else{
		return {x:this.x,y:this.y};
	}
  }
  
  this.move = function() {
    this.x += this.vx * this.dt;
    this.y += this.vy * this.dt;
    if (this.x > 12 || this.x < 0) {
      this.vx = -this.vx;
    }
    if (this.y > 8 || this.y < 0) {
      this.vy = -this.vy;
    }
    return this;
  };
}

//--------------------------------------------------------------------------------------------------------------------
//Rectangle
var Rectangle = function() {
  this.dType = 'Rectangle';
}
Rectangle.prototype = new Box2d();

//--------------------------------------------------------------------------------------------------------------------
//Circle
var Circle = function() {
  this.dType = 'Circle';
  this.r = 1;
}
Circle.prototype = new Box2d();
//--------------------------------------------------------------------------------------------------------------------
//Line
var Line = function() {
  this.dType = 'Line';
  this.type = 'defalut'; //polar          
  this.r = 1;
  this.angle = -45; 
  this.x2 = 1;
  this.y2 = 1;
  
   this.position2 = function(p){
	if(p){
		this.x2=p.x;
		this.y2=p.y;
	}else{
		return {x:this.x2,y:this.y2};
	}
  }  
  
  //update convers polar to cartisian
  this.update = function() {
    if (this.type == 'polar') {     
      this.x2 = this.x + this.r * Math.cos(getRad(this.angle));
      this.y2 = this.y + this.r * Math.sin(getRad(this.angle));
    }
  }
}
Line.prototype = new Box2d();
//--------------------------------------------------------------------------------------------------------------------
//Sphere
var Sphere = function() {
  this.dType = 'Sphere';
  this.r = 30;
  this.angle = 225;
  this.color = 'red';
}
Sphere.prototype = new Box2d();
//--------------------------------------------------------------------------------------------------------------------
var Text = function(){
	this.dType = 'Text';
	this.text = 'Hellow';
	this.font = 'Bold 30px Sans-Serif';	
}
Text.prototype = new Box2d();
//--------------------------------------------------------------------------------------------------------------------
var Img = function(){
	this.dType = 'Img';
	this.img = new Image();	
	this.src=null;
	this.isReady = false;
	var that = this;
	this.onReady = function(){
		//should be overriden
	}
	
	this.img.onload = function(){		
		that.isReady = true;
		that.onReady();
	}
	
	
}
Img.prototype = new Box2d();


var Path = function() {
  this.dType = 'Path';
  this.points = [];

  this.add = function(x, y) {
    return this.points.push({
      x: x,
      y: y
    }), this;
  }
  this.getHead = function() {
    return this.points[this.points.length - 1];
  }

  this.getTail = function() {
    return this.points[0];
  }
  
  this.clear = function(){	
	return this.points=[],this;	 
  }
  
  
}

Path.prototype = new Box2d();



//--------------------------------------------------------------------------------------------------------------------
var Tracer = function() {
  this.dType = 'Tracer';
  this.length = 20;//number of points
  this.path = new Path();
  //new node is accepted only if distance(newnode,oldnode)>distance
  this.nodeLength = 0.1;//distance between nodes
  this.head = null; //referense to xobject to be drawn at head. Optional
  this.body = null; //refernces to xobject to be drawn at each node
  this.foot = null; //reference to footer to be drawn at the end of tracce.


  this.update = function() {

    var np = {
      x: this.x,
      y: this.y
    }; //newpoint		
    if (isAccepted.call(this, np)) this.path.points.push(np);

    if (this.path.points.length > this.length) {
      this.path.points.shift();
    }
    return this;
  }

  function isAccepted(np) {
    if (this.path.points.length === 0) {
      return true;
    } else {
      var op = this.path.points[this.path.points.length - 1];
      return this.accept(op, np);
    }

  }

  //attached to object so that to override externally
  this.accept = function(p1, p2) {
    return distance(p1, p2) > this.nodeLength;
  }
}
Tracer.prototype = new Box2d();

//--------------------------------------------------------------------------------------------------------------------
//to container group of objects
var Layer = function() {
 this.dType = 'Layer';
 this.items=[];
 this.x = 0;
 this.y = 0;
 this.w=6;
 this.h=4;
	this.add=function(xobject){
		this.items.push(xobject);
		return this;
	}

}
Layer.prototype = new Box2d();


//--------------------------------------------------------------------------------------------------------------------
var distance = function(p1, p2) {
  return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}
var getRand = function(a, b) {
  return Math.round(a + (b - a) * Math.random());
}
var getRandf = function(a, b) {
  return a + (b - a) * Math.random();
}
var getRad = function(deg) {
  return deg * Math.PI / 180;
}
//y in c d for x in a b   
//y-c/(d-c) = x-a/(b-a) 
function getlineMap(x,a,b,c,d){
	return (x-a)*(d-c)/(b-a) +c;
}
var getRandColor = function() {
  return getColorFromArray([getRand(0, 255),getRand(0, 255),getRand(0, 255)]);
}

var getColorFromArray = function(a){
	return 'rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')';
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
var hsvToRgb = function (h, s, v){	
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255),Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 255].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
var rgbToHsv = function (r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s,v];
}
