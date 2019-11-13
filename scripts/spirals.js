var R = [80, 40, 20];
var w = [1, -31, 36];
var canvas, ctx;
var fillColor = "#00d";
var gradientStop = [[4/14,"#307"],[10/14,"#60c"],[1,"#00d"]];
var randomColors = true;

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
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.lenght)),fillColor,gradientStop);
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
			ctx.clearRect(0,0,canvas.width,canvas.height);
			drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.lenght)),fillColor,gradientStop);
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
	drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.lenght)),fillColor,gradientStop);
	//randomSpiral();
}
function randomSpiral(){
	w[0] = Math.floor(Math.random()*50)+1;
	w[1] = Math.floor(Math.random()*200)-100;
	w[2] = Math.floor(Math.random()*200)-100;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawSpiralFigure(ctx,canvas.width/2,canvas.height/2,sum(R.slice(0,R.lenght)),fillColor,gradientStop);
}
function drawSpiralFigure(board,x,y,r,col,gradientStop){
	randomizeColors();
	board.beginPath();
	if(gradientStop[0][0]>0){
		gradient = board.createRadialGradient(x, y, 0, x, y, r);
//		gradient.addColorStop(1, col);
		gradient.addColorStop(gradientStop[0][0], gradientStop[0][1]);
		gradient.addColorStop(gradientStop[1][0], gradientStop[1][1]);
		gradient.addColorStop(gradientStop[2][0], gradientStop[2][1]);
		board.fillStyle = gradient;
	} else {
		board.fillStyle = col;
	}
//	var angle = Math.random()*Math.PI/2-Math.PI/4;
	var angle = 0;
	board.moveTo(sum(R.slice(0,R.length))*Math.cos(angle)+x,y+Math.sin(angle));
	for(var i = 0.000 ; i < 1/gcd(gcd(w[0],w[1]),w[2]) ; i += 0.0001){
		var x1 = R[0]*Math.cos(2*Math.PI*i*w[0]+angle);
		var x2 = R[1]*Math.cos(2*Math.PI*i*w[1]+angle);
		var x3 = R[2]*Math.cos(2*Math.PI*i*w[2]+angle);
		var y1 = R[0]*Math.sin(2*Math.PI*i*w[0]+angle);
		var y2 = R[1]*Math.sin(2*Math.PI*i*w[1]+angle);
		var y3 = R[2]*Math.sin(2*Math.PI*i*w[2]+angle);
		var xF = x1+x2+x3;
		var yF = y1+y2+y3;
		board.lineTo(xF+x,yF+y);
	}
	board.closePath();
	board.lineWidth = 1;
	board.mozFillRule = 'evenodd';
  	board.fill("evenodd");
//	board.fill();
//	ctx.strokeStyle = "white";
	ctx.strokeStyle = "black";
	board.stroke();
	
}

function gcd(a, b) {
	if(a===0 || b===0){return 1}
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

function randomizeColors(){
	if (randomColors){
		var randColRed = Math.floor(Math.random()*256);
		var randColGreen = Math.floor(Math.random()*256);
		var randColBlue = Math.floor(Math.random()*256);
		var fillColor = "rgb("+randColRed+","+randColGreen+","+randColBlue+")";
		var randColRed = Math.floor(Math.random()*256);
		var randColGreen = Math.floor(Math.random()*256);
		var randColBlue = Math.floor(Math.random()*256);
		var randColRed1 = Math.floor(Math.random()*256);
		var randColGreen1 = Math.floor(Math.random()*256);
		var randColBlue1 = Math.floor(Math.random()*256);
		var randColRed2 = Math.floor(Math.random()*256);
		var randColGreen2 = Math.floor(Math.random()*256);
		var randColBlue2 = Math.floor(Math.random()*256);
		gradientStop = [[4/14,"rgb("+randColRed1+","+randColGreen1+","+randColBlue1+")"],
		   [10/14,"rgb("+randColRed+","+randColGreen+","+randColBlue+")"],
		   [1,"rgb("+randColRed2+","+randColGreen2+","+randColBlue2+")"]];
	}
}