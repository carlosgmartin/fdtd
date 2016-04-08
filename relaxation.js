var width = 100;
var height = 100;

var charge = [];
var potential = [];
var new_potential = [];
for (var i = 0; i < width; ++i) {
	charge[i] = [];
	potential[i] = [];
	new_potential[i] = [];
	for (var j = 0; j < height; ++j) {
		charge[i][j] = 0;
		potential[i][j] = 0;
		new_potential[i][j] = 0;
	}
}
for (var i = 25; i < 75; ++i) {
	charge[i][25] = 1;
	charge[i][75] = -1;
}

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var graphics = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;

var update = function () {
	for (var i = 1; i < width - 1; ++i) {
		for (var j = 1; j < height - 1; ++j) {
			new_potential[i][j] = 0.25 * (potential[i+1][j] + potential[i][j+1] + potential[i-1][j] + potential[i][j-1] + 4*Math.PI*charge[i][j]);
		}
	}
	potential = new_potential.slice(0);
};

var render_scale = 5;
var render = function () {
	graphics.fillStyle = 'black';
	graphics.fillRect(0, 0, canvas.width, canvas.height);
	graphics.fillStyle = 'white';
	for (var i = 0; i < width; ++i) {
		for (var j = 0; j < height; ++j) {
			graphics.globalAlpha = (Math.atan(potential[i][j])/Math.PI+0.5);
			graphics.fillRect(i * render_scale, j * render_scale, render_scale, render_scale);
		}
	}
};

var loop = function () {
    update();
    render();
};
setInterval(loop, 1000/30);