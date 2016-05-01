var size_x = 640;
var size_y = 480;
var timestep = .5;





var electric_x = [];
var magnetic_x = [];
var current_x = [];
for (var i = 0; i < size_x; ++i)
{
	electric_x[i] = [];
	magnetic_x[i] = [];
	current_x[i] = [];
	for (var j = 0; j <= size_y; ++j)
	{
		electric_x[i][j] = 0;
		magnetic_x[i][j] = 0;
		current_x[i][j] = 0;
	}
}

var electric_y = [];
var magnetic_y = [];
var current_y = [];
for (var i = 0; i <= size_x; ++i)
{
	electric_y[i] = [];
	magnetic_y[i] = [];
	current_y[i] = [];
	for (var j = 0; j < size_y; ++j)
	{
		electric_y[i][j] = 0;
		magnetic_y[i][j] = 0;
		current_y[i][j] = 0;
	}
}

var electric_z = [];
var magnetic_z = [];
var current_z = [];
for (var i = 0; i <= size_x; ++i)
{
	electric_z[i] = [];
	magnetic_z[i] = [];
	current_z[i] = [];
	for (var j = 0; j <= size_y; ++j)
	{
		electric_z[i][j] = 0;
		magnetic_z[i][j] = 0;
		current_z[i][j] = 0;
	}
}





function update()
{
	for (var i = 1; i < size_x; ++i)
	{
		for (var j = 1; j < size_y; ++j)
		{
			electric_x[i][j] += (magnetic_z[i][j] - magnetic_z[i][j-1] - current_x[i][j]) * timestep;
			//magnetic_x[i][j] += (electric_z[i][j] - electric_z[i][j+1]) * timestep;
		}
	}
	for (var i = 1; i < size_x; ++i)
	{
		for (var j = 1; j < size_y; ++j)
		{
			electric_y[i][j] += (magnetic_z[i-1][j] - magnetic_z[i][j] - current_y[i][j]) * timestep;
			//magnetic_y[i][j] += (electric_z[i+1][j] - electric_z[i][j]) * timestep;
		}
	}
	for (var i = 0; i < size_x; ++i)
	{
		for (var j = 0; j < size_y; ++j)
		{
			//electric_z[i][j] += (magnetic_x[i][j-1] - magnetic_x[i][j] + magnetic_y[i][j] - magnetic_y[i-1][j] - current_z[i][j]) * timestep;
			magnetic_z[i][j] += (electric_x[i][j+1] - electric_x[i][j] + electric_y[i][j] - electric_y[i+1][j]) * timestep;
		}
	}

	for (var i = 0; i < size_x; ++i)
	{
		electric_x[i][0] += (electric_x[i][1] - electric_x[i][0]) * timestep;
		electric_x[i][size_y] += (electric_x[i][size_y-1] - electric_x[i][size_y]) * timestep;
	}
	for (var j = 0; j < size_y; ++j)
	{
		electric_y[0][j] += (electric_y[1][j] - electric_y[0][j]) * timestep;
		electric_y[size_x][j] += (electric_y[size_x-1][j] - electric_y[size_x][j]) * timestep;
	}
}





var canvas = document.getElementById('canvas');
canvas.width = size_x;
canvas.height = size_y;
var context = canvas.getContext('2d');
var image_data = context.createImageData(size_x, size_y);
var data = image_data.data;
function render()
{
	var index = 0;
	for (var j = 0; j < size_y; ++j)
	{
		for (var i = 0; i < size_x; ++i)
		{
			var value = 128 + magnetic_z[i][j];
			data[index++] = value;
			data[index++] = value;
			data[index++] = value;
			data[index++] = 255;
		}
	}
	context.putImageData(image_data, 0, 0);
}

var time = 0;
function loop()
{
	update();
	render();

	var amplitude = 10000 * (1 - Math.exp(-time / 10));
	var frequency = .2;
	current_y[size_x/2][size_y/2] = amplitude * Math.sin(time * frequency);

	time += timestep;
}
setInterval(loop, 0);










