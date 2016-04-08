var width = 500;
var height = 500;

var light_speed = 100;
var timestep = .005;

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
var context = canvas.getContext('2d');
var image_data = context.createImageData(width, height);
var data = image_data.data;
var render = function () {
    for (var i = 0; i < width; ++i) {
        for (var j = 0; j < height; ++j) {
            var index = (i + j * width) * 4;
            var value = Math.floor(1/(1+Math.exp(-magnetic_z[i][j])) * 255);
            data[index] = value;
            data[++index] = value;
            data[++index] = value;
            data[++index] = 255;
        }
    }
    context.putImageData(image_data, 0, 0);
};

var time = 0;
var loop = function () {
    update();
    render();

    // Oscillator example
    
    var amplitude = 100000 * (1-Math.exp(-time));
    var frequency = 20;
    current_y[width/2][height/2-1] = amplitude * Math.sin(time * frequency);
    current_y[width/2][height/2] = amplitude * Math.sin(time * frequency);
    
    // Magnetic field induced by current loop
    /*
    var current = 100 * (1-Math.exp(-time));
    var left = 100;
    var top = 100;
    var right = 400;
    var bottom = 200;
    for (var i = left; i < right; ++i) {
        current_x[i][top] = current;
        current_x[i][bottom] = -current;
    }
    for (var j = top; j < bottom; ++j) {
        current_y[left][j] = -current;
        current_y[right][j] = current;
    }
    */
    time += timestep;
    console.log(electric_x[100][100]);
};

start();
setInterval(loop, 1000 * timestep);