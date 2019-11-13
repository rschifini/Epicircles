var R = [80, 40, 20];
var w = [5, -1, 13];
var canvas, ctx;
var fillColor = "#00d";
var randomColors = true;
var Int;
var initThick = 16;

$(document).ready(function(){
	initialSetup();
	
	$("body").click(function(){
		randomSpiral();
	});
	
	$(document).keydown(function(e){
		//e.keyCode
		randomSpiral();
	});
	
	$("nav").mouseenter(function(){
		$(this).children("ul").stop(true,false).animate({
			"opacity": 1
		},1000);
	});
	
	$("nav").mouseleave(function(){
		$(this).children("ul").stop(true,false).animate({
			"opacity": 0
		},1000);
	});
	
	$("li").click(function(liEvent){
		w = $(this).html().split(/\s/);
		w[0] = w[0].substring(1,w[0].length-1)*1;
		w[1] = w[1].substring(1,w[1].length-1)*1;
		w[2] = w[2].substring(1,w[2].length-1)*1;
		if (Int){
			clearInterval(Int);
		}
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.length)),fillColor,randomColors,initThick);
		liEvent.stopImmediatePropagation();
	});
	
	$("#save").click(function(e){
		var simplify = gcd(gcd(w[0],w[1]),w[2]);
		for(var i=0; i<3; i++){
			w[i] /= simplify;
			if(w[i]<10 && w[i]>=0){
				w[i] = "0"+w[i];
			} else if (w[i]<0 && w[i]>-10){
				w[i] = "-0"+w[i]*(-1);
			}
		}
		$("<li>["+ w[0] +"] ["+ w[1] + "] [" + w[2] +"]</li>").appendTo($("#user")).click(function(liEvent){
			w = $(this).html().split(/\s/);
			w[0] = w[0].substring(1,w[0].length-1)*1;
			w[1] = w[1].substring(1,w[1].length-1)*1;
			w[2] = w[2].substring(1,w[2].length-1)*1;
			if (Int){
				clearInterval(Int);
			}
			ctx.clearRect(0,0,canvas.width,canvas.height);
			drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.length)),fillColor,randomColors,initThick);
			liEvent.stopImmediatePropagation();
		});
		e.stopImmediatePropagation();
	});
	
});

function initialSetup(){
	canvas = document.getElementById("board");
	ctx = canvas.getContext("2d");
	var ww = window.innerWidth-2;
	var wh = window.innerHeight-8;
	canvas.width = ww;
	canvas.height = wh;
	var w = canvas.width;
	var h = canvas.height;
	scaleR();
	drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.length)),fillColor,randomColors,initThick);
	//randomSpiral();
}
function randomSpiral(){
	w[0] = Math.floor(Math.random()*50)+1;
	w[1] = Math.floor(Math.random()*200)-100;
	w[2] = Math.floor(Math.random()*200)-100;
//	ctx.beginPath();
//	ctx.stroke();
	if (Int){
		clearInterval(Int);
	}
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.length)),fillColor,randomColors,initThick);
}
function drawSpiralFigure(board,x,y,r,col,randomColors,thick){
	if(thick==initThick){
		cols = randomizeColors(randomColors);
	}

	var angle = 0;
	var x0 = xini = sum(R.slice(0,R.length))*Math.cos(angle)+x;
	var y0 = yini = sum(R.slice(0,R.length))*Math.sin(angle)+y;
	var i = 0;
	board.lineWidth = thick;
	board.strokeStyle = "white";
	
	Int = setInterval(function(){
		board.beginPath();
		board.moveTo(xini,yini);
		for (var j = 0;j<50;j++){
			var x1 = R[0]*Math.cos(2*Math.PI*(i+j*0.0001)*w[0]+angle);
			var x2 = R[1]*Math.cos(2*Math.PI*(i+j*0.0001)*w[1]+angle);
			var x3 = R[2]*Math.cos(2*Math.PI*(i+j*0.0001)*w[2]+angle);
			var y1 = R[0]*Math.sin(2*Math.PI*(i+j*0.0001)*w[0]+angle);
			var y2 = R[1]*Math.sin(2*Math.PI*(i+j*0.0001)*w[1]+angle);
			var y3 = R[2]*Math.sin(2*Math.PI*(i+j*0.0001)*w[2]+angle);
			var xF = x1+x2+x3;
			var yF = y1+y2+y3;
			board.lineTo(xF+x,yF+y);
		}
		xini = xF+x;
		yini = yF+y;
		colsVar = randomizeColors(false);
		var randColRed = cols[0]+colsVar[0];
		var randColGreen = cols[1]+colsVar[1];
		var randColBlue = cols[2]+colsVar[2];
		var lineColor = "rgba(" + randColRed + "," + randColGreen + "," + randColBlue + "," + 2/board.lineWidth +")";
		//console.log(lineColor);
		board.strokeStyle = lineColor;
		board.stroke();
		i = i+j*0.0001;
		if (i >= 1/gcd(gcd(w[0],w[1]),w[2])){
			board.lineTo(x0,y0);
			board.stroke();
			clearInterval(Int);
			if(board.lineWidth==initThick){
				drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.length)),fillColor,false,8);
			}else if(board.lineWidth==8){
				drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.length)),fillColor,false,2);
			}
		}
	},1);
	
//	board.closePath();
//	board.mozFillRule = 'evenodd';
// 	board.fill("evenodd");
//	board.fill();
//	ctx.strokeStyle = "black";
	
	
}

function gcd(a, b) {
	if(a===0 || b===0){return Math.max(Math.abs(a),Math.abs(b))}
	var a = Math.abs(a);
	var b = Math.abs(b);
	while (b != 0) {
		var z = a % b;
		a = b;
		b = z;
	}
	return a;
}

function sum(v){
	if(v.length === 0){
		return 0;
	} else {
		return v.pop() + sum(v);
	}
}

function scaleR(){
	var S = sum(R.slice(0,R.length));
	for(var i=0; i<R.length ; i++){
		R[i] *= Math.min(canvas.width,canvas.height)/S/2;
	}

}

function randomizeColors(resetear){
if (resetear){
	var randColRed = Math.floor(Math.random()*156);
	var randColGreen = Math.floor(Math.random()*156+Math.random()*50);
	var randColBlue = Math.floor(Math.random()*156+Math.random()*50);
}else{
	var randColRed = Math.floor(Math.random()*50);
	var randColGreen = Math.floor(Math.random()*50);
	var randColBlue = Math.floor(Math.random()*50);
}
return [randColRed,randColGreen,randColBlue]
}