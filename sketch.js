var radius = 200;
var distance = 500;
var rodLength = 450;
var theta = 180;
var dot = new Circle(0,0,3);
var rodCircle = new Circle(0,0,rodLength);
var c1 = new Circle(distance/2,0,radius+50);
var c2 = new Circle(-distance/2,0,radius);
var wattCurve = [];
var wattCurveLen = 1000;
var omega = 1.001388889;

function setup(){
	createCanvas(windowWidth, windowHeight);
	ellipseMode(CENTER);
	angleMode(DEGREES);
	noFill();
}

function draw(){
	background("WHITE");
	translate(width/2,height/2);

	// Circles
	stroke("BLACK");
	c1.draw();
	c2.draw();

	// Point on the right circle
	stroke("RED");
	dot.x = c1.x+(c1.r*cos(theta));
	dot.y = c1.y+c1.r*sin(theta);
	dot.draw();

	// Circle showing the rod's length
	stroke("CYAN");
	rodCircle.x = dot.x;
	rodCircle.y = dot.y;
	rodCircle.draw();

	intersections = rodCircle.intersect(c2);
	stroke("GREEN");
	for(p of intersections){
		ellipse(p.x,p.y,3,3);
		line(p.x,p.y,dot.x,dot.y);
		wattCurve.push({x:(p.x + dot.x)/2,y:(p.y+dot.y)/2});
	}

	stroke("BLUE");
	for(p of wattCurve)
		point(p.x,p.y);

	while(wattCurve.length > wattCurveLen)
		wattCurve.splice(0,1);

	theta += omega;
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

function Circle (x,y,r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

Circle.prototype.draw = function(){
	ellipse(this.x,this.y,2*this.r,2*this.r)
}

Circle.prototype.intersect = function(circle){
	x1 = this.x;
	y1 = this.y;
	r1 = this.r;

	x2 = circle.x;
	y2 = circle.y;
	r2 = circle.r;

	deltaX = x2-x1;
	deltaY = y2-y1;
	R = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
	if(dist > r1+r2)
		return [];
	avgX = (x1+x2)/2;
	avgY = (y1+y2)/2;
	if(dist == r1+r2)
		return [{x: avgX, y: avgy}];

	var R2 = R*R;
	var R4 = R2*R2;
	var a = (r1*r1 - r2*r2) / (2 * R2);
	var r2r2 = (r1*r1 - r2*r2);
	var c = Math.sqrt(2 * (r1*r1 + r2*r2) / R2 - (r2r2 * r2r2) / R4 - 1);

	var fx = (x1+x2) / 2 + a * (x2 - x1);
	var gx = c * (y2 - y1) / 2;
	var ix1 = fx + gx;
	var ix2 = fx - gx;

	var fy = (y1+y2) / 2 + a * (y2 - y1);
	var gy = c * (x1 - x2) / 2;
	var iy1 = fy + gy;
	var iy2 = fy - gy;

	//console.log([{x: ix1, y: iy1}, {x: ix2, y: iy2}]);

	return [{x: ix1, y: iy1}, {x: ix2, y: iy2}];
}
