var button_displacement = document.getElementById('button_displacement');
var button_speed = document.getElementById('button_speed');

var canvas = document.getElementById('screen');
canvas.style.cursor = 'none';
var context = canvas.getContext('2d');
var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;

var c = [];
var u = [];
u[0] = [];
u[1] = [];
u[2] = [];
for (var i = 0; i < canvas.width; ++i) {
  c[i] = [];
  u[0][i] = [];
  u[1][i] = [];
  u[2][i] = [];
  for (var j = 0; j < canvas.height; ++j) {
    c[i][j] = 1/Math.sqrt(2);
    u[0][i][j] = 0;
    u[1][i][j] = 0;
    u[2][i][j] = 0;
  }
}

var t = 0;
function update() {
  for (var i = 0; i < canvas.width; ++i) {
    for (var j = 0; j < canvas.height; ++j) {
      u[2][i][j] = u[1][i][j];
      u[1][i][j] = u[0][i][j];
    }
  }
  for (var i = 1; i < canvas.width - 1; ++i) {
    for (var j = 1; j < canvas.height - 1; ++j) {
      var laplacian = u[1][i-1][j] + u[1][i+1][j] + u[1][i][j-1] + u[1][i][j+1] - 4 * u[1][i][j];
      u[0][i][j] = c[i][j] * c[i][j] * laplacian + 2 * u[1][i][j] - u[2][i][j];
    }
  }
  for (var i = 100; i < 200; ++i) {
    for (var j = 100; j < 200; ++j) {
      u[0][i][j] = Math.sin(t * .1);
    }
  }
  ++t;
}
var interval = setInterval(update, 1000/60);
var paused = false;
addEventListener('keydown', function(e) {
  if (!paused) {
    clearInterval(interval);
  }
  if (paused) {
    interval = setInterval(update, 1000/60);
  }
  paused = !paused;
});

function render() {
  requestAnimationFrame(render);
  for (var x = 0; x < canvas.width; ++x) {
    for (var y = 0; y < canvas.height; ++y) {
      var index = (x + y * canvas.width) * 4;
      var value;
      if (button_displacement.checked) {
        value = (u[0][x][y] + 1) / 2 * 255;
      }
      else if (button_speed.checked) {
        value = c[x][y] * 255 * Math.sqrt(2);
      }
      data[index++] = value;
      data[index++] = value;
      data[index++] = value;
      data[index] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  
  context.fillStyle = 'red';
  context.strokeStyle = 'black';
  context.globalAlpha = .5;
  context.beginPath();
  context.arc(mouse_x, mouse_y, mouse_radius, 0, 2*Math.PI);
  context.fill();
}
render();

var mouse_x = 0;
var mouse_y = 0;
var mouse_down = false;
var mouse_radius = 10;
canvas.addEventListener('mousemove', function(e) {
  mouse_x = e.offsetX;
  mouse_y = e.offsetY;
  if (mouse_down) {
    for (var x = mouse_x - mouse_radius; x < mouse_x + mouse_radius; ++x) {
      for (var y = mouse_y - mouse_radius; y < mouse_y + mouse_radius; ++y) {
        var dx = x - mouse_x;
        var dy = y - mouse_y;
        if (dx * dx + dy * dy < mouse_radius * mouse_radius) {
          c[x][y] = 0;
        }
      }
    }
  }
});
canvas.addEventListener('mousedown', function(e) {
  mouse_down = true;
});
canvas.addEventListener('mouseup', function(e) {
  mouse_down = false;
});
canvas.addEventListener('contextmenu', function(e) { e.preventDefault(); });
canvas.addEventListener('mousewheel', function(e) {
  if (e.wheelDelta < 0) mouse_radius += 1;
  if (e.wheelDelta > 0) mouse_radius -= 1;
  if (mouse_radius < 0) mouse_radius = 0;
});

