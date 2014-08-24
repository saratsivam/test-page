$(document).ready(function() {
  g = GUtil.createGraphis({
    target: '#canvas',color:'#fff',x:0,y:0,unit:50,showGrid:false,
	
  });


var rect = g.create('Rectangle',{vx:5,vy:2.3,strokeStyle:'red'});
var circle = g.create('Circle',{r:0.6,vx:2.5,vy:6,strokeStyle:'#afa'});
var triangle = g.create('Path',{close:true,vx:4,vy:5,strokeStyle:'blue'}).add(-0.5,-0.5).add(-0.2,0.7).add(0.5,-0.2);


	g.loop(function(t){
		//g.clear();
		rect.angle=t/2;
		//triangle.angle = t;
		
		g.draw(rect.move());
	});

//autoAnimator();
//snakeGame();
});






function autoAnimator(){
	g.loop(function(i,counter){  	
		animator[counter%animator.length]();
  	},5000);
}
	
	
function TowersOfHanoi(){
		g.x=6;g.y=1;
		
		var n=7; //number of disks
		var delay=100;
		var poleA = {name:"A",x:-3,y:0,disks:[]};
		var poleB = {name:"B",x:0,y:0,disks:[]};
		var poleC = {name:"C",x:3,y:0,disks:[]};		
		
		poles={A:poleA,B:poleB,C:poleC};
		
		function draw(){
			g.clear();
			$.each(poles,function(k,pole){
				var h=0.3;var y=-h;
				g.draw('Rectangle',{x:pole.x,y:pole.y+1,w:0.1,h:2,showFill:true,fillStyle:'black'});
				$.each(pole.disks,function(i,disk){						
					g.draw('Rectangle',{
						h:h,
						y:y+=h,
						w:disk.w,
						x:pole.x,
						showFill:true,
						strokeStyle:'black',
						fillStyle:disk.fillStyle,					
					});
					
				});		
			});				
		}
			
		for(var i=n;i>0;i--){			  
			var w = mathUtil.getlineMap(i,0,n,0.2,3);					
			var rect = g.create('Rectangle',{w:w,showFill:true,fillStyle:colorUtil.getRandColor()});
			poleA.disks.push(rect);
		}
		
		hanoiRecorder=[];	
		function hanoi(n, from , other, to) {		
				if(n>0){
					hanoi(n-1, from, to, other);				
						hanoiRecorder.push({n:n,from:from,to:to});
					hanoi(n-1, other, from, to);					
				}	
		}
		hanoi(n,'A','B','C');		
	
		function render(){
			var record = hanoiRecorder.shift();
			if(record){
				//console.log(record);
				g.clear();
				
				var from = poles[record.from].disks;
				var to= poles[record.to].disks;
				to.push(from.pop());
				draw();
				
				
				window.setTimeout(render,delay);
			}				
		}
		
		draw();window.setTimeout(render,delay);
}
      

    





function snakeGame(){
	//img = g.create('Img',{x:1,y:1,vx:5,vy:5,src:'img1.png'});
	g.x=0,g.y=0;g.clearLoops();
	var gameOver = g.create('Text',{text:'Game Over',x:3,y:6,font:'Bold 50px Sans-Serif',showFill:true,fillStyle:'red'});
	var scoreText = g.create('Text',{text:'score: 0',x:10.5,y:7,font:'20px Sans-Serif',showFill:true,fillStyle:'blue',dropShadow:false});
	var snake= g.create('Tracer',{x:0,y:3,vx:5,vy:0,lineWidth:10,strokeStyle:'green',length:25,defaultLength:25,nodeLength:0.10});
	var head= g.create('Rectangle',{w:0.3,h:0.3,angle:45,showFill:true,fillStyle:'yellow'});
	//var body= g.create('Rectangle',{w:0.3,h:0.3,angle:45,showFill:true,fillStyle:'green'});
	//var body= g.create('Img',{x:4,y:5,w:0.3,h:0.3,src:'snake1.jpg'});
	
	snake.head=head;
	//snake.body = body;
	//food = g.create('Img',{x:4,y:5,w:0.5,h:0.5,src:'img1.png',});
		food = g.create('Sphere',{r:0.2,x:4,y:5,});
	
	for(var i=0;i<100;i++){
		snake.move().update();
	}
	var loopId = g.loop(function(i){
	
		g.clear();	
		snake.move();
		
		
		isCollided=false;
		$.each(snake.path.points,function(i,point){			
			if(mathUtil.distance(point,snake.position()) <0.10 && i < snake.length-5){
				isCollided=true;
				return false;
			}		
		});	

		if(mathUtil.distance(food.position(),snake.position()) < 0.2){
			snake.length+=4;
			var score = snake.length-snake.defaultLength;
			scoreText.text = 'Score: '+ score;
			food.x = mathUtil.getRand(1,11);
			food.y = mathUtil.getRand(1,7);
			food.color = colorUtil.getRandColor();
			v++;		
		}		
		
		if(isCollided){				
			g.stopLoop(loopId);	
			g.draw(gameOver);
		}			
		g.drawArray([food,snake,scoreText]); 
	
	});
	
	
	
	
	
	
	var v=5;
keyEvents={

	left:function(e){	
		snake.vy=0;if(snake.vx==0)snake.vx=-v;		
	},
	right:function(e){
		snake.vy=0;if(snake.vx==0)snake.vx=v;		
	},
	up:function(e){		
		snake.vx=0;if(snake.vy==0)snake.vy=v;
	},
	down:function(e){	
		snake.vx=0;if(snake.vy==0)snake.vy=-v;
	}
}

keyCodes={enter:13, up:38, down:40, right:39, left:37, esc:27, spacebar:32, ctrl:17, alt:18, shift:16,  };
keyCodesFnMap={13:keyEvents.enter, 38:keyEvents.up, 40:keyEvents.down, 39:keyEvents.right, 37:keyEvents.left, 27:keyEvents.esc, 32:keyEvents.spacebar, 17:keyEvents.ctrl, 18:keyEvents.alt, 16:keyEvents.shift};
$(document).keydown(function(e){
	var fn = keyCodesFnMap[e.keyCode];
	if(fn){
		fn(e);
	}
})


}

var requestId='';
function lissajous(){
	var fx = 1.003;var fy=mathUtil.getRand(1,3)+mathUtil.getRand(0,1)/2;
	g.clearLoops();g.x=6;g.y=4;g.color="#000";
	var n=0;var dt=0.01;var fi=0.01;
	
	var settings = {lineWidth:5,shadowColor:'#ff00ff',shadowOffsetX:0,shadowOffsetY:0,shadowBlur:30,strokeStyle:'white'};		
	var path = g.create('Path',settings);
		
		
	var sphere = g.create('Sphere',{r:0.2,x:0,y:0,color:'orange'});  	
  		g.loop(function(counter,loopId){  		
  			fi=fi+0.01;	
			g.clear();path.clear();			
			for(i=0;i<200;i++){
				n++;
				var x=2*Math.sin(2*Math.PI*fx*n*dt);
				var y=2*Math.sin(2*Math.PI*fy*n*dt+fi);			
				//g.draw(sphere);	
				path.add(x,y);
			}
			
			g.draw(path);
			requestId=loopId;	
			if(counter%50===0){
				//path.strokeStyle=getColorFromArray(hsvToRgb(mathUtil.getRandf(0,1),1,1));
				fy=mathUtil.getRand(1,3)+mathUtil.getRand(0,1)/2;
			}
  		});  		
  			
}


function stationaryWave(){	
	g.clearLoops();g.x=6;g.y=4;	g.color="#efefff";
		var settings = {shadowColor:'blue',shadowOffsetX:50,shadowOffsetY:50,shadowBlur:30};		
		var path1 = g.create('Path',settings);				
		var path2 = g.create('Path',settings);		
		var path3 = g.create('Path',settings);
		path1.strokeStyle='green';
		path2.strokeStyle='blue';
		path3.strokeStyle='red';
	var lambda = 3;	
	var k = 0.05;	
	g.loop(function(t,loopId){
		g.clear();
		path1.clear();
		path2.clear();
		path3.clear();
		for(var x=-6;x<6;x+=0.1){
			var y1 = Math.sin(x*2*Math.PI/lambda-k*t);
			var y2 = Math.sin(x*2*Math.PI/lambda+k*t);
			var y=y1+y2;
			path1.add(x,y1);
			path2.add(x,y2);
			path3.add(x,y);			
		}
		g.drawArray([path1,path2,path3]);	
		requestId=loopId;
	});	
}


function LogintudinalWave(){
	g.clearLoops();g.x=6;g.y=4;	g.showGrid=false;	
	var rect = g.create('Rectangle',{w:0.01,h:10,strokeStyle:'blue'})
	var tracer = g.create('Tracer',{x:0,y:-1,body:rect});		
	var lambda = 3;	
	var k = 0.05;	
	g.loop(function(t,loopId){
		g.clear();
		tracer.path.clear();
		for(var x=-6;x<6;x+=0.1){
			var y = Math.sin(x*2*Math.PI/lambda-k*t);			
			var tx = (x+0.2*y)*2
			tracer.x = tx
			tracer.path.add(tx,-1);
		}
		g.drawArray([tracer]);	
		requestId=loopId;
		if(t%200===0){
			rect.strokeStyle=colorUtil.getRandColor();			
		}
	});	
}



function piston(){
	g.clearLoops();g.x=0;g.y=4;	
	
	var c = g.create('Circle',{y:-1,r:0.5});	 
	var l1 = g.create('Line',{type:'polar',y:-1,r:0.5});	  
	var l2 = g.create('Line',{x2:0,r:2});
	var r = g.create('Rectangle',{x:0,w:2,h:1,showFill:true});	  
	var s1 = g.create('Sphere',{r:0.2});
	var s2 = g.create('Sphere',{r:0.2});
	
	var layer = g.create('Layer',{w:2,h:5,scaleX:1,scaleY:1});
	layer.add(c).add(s1).add(s2).add(l1).add(l2).add(r);
		
		g.loop(function(i,loopId){			
			g.clear();						
			var phase = i*5;	
				
			buildPiston(phase,2.5);				
			buildPiston(phase+90,5);	
			buildPiston(phase+180,7.5);
			buildPiston(phase+270,10);		
			requestId = loopId;
		});	
		
			
		function buildPiston(phase,x){
			l1.angle=phase;	
			s1.position(l1.position2());
			l2.position(l1.position2());			
			l2.y2 = Math.sqrt(l2.r*l2.r-(l2.x2-l2.x)*(l2.x2-l2.x))+l2.y;
			s2.position(l2.position2());			
			r.y = l2.y2;				
			layer.x=x;		
			g.draw(layer);	
		}
}




animator=[stationaryWave,LogintudinalWave,piston,lissajous]







