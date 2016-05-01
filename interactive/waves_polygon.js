var canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);
var context = canvas.getContext('2d');
var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;
var vertices = [];

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
      data[index++] = (u[0][x][y] + 1) / 2 * 255;
      data[index++] = 0;
      data[index++] = c[x][y] * 255 * Math.sqrt(2) * 2;
      data[index] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  
  if (vertices.length > 0) {
    context.globalAlpha = .5;
    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 0; i < vertices.length; ++i) {
      context.lineTo(vertices[i].x, vertices[i].y);
    }
    context.lineTo(mouse_x, mouse_y);
    context.closePath();
    context.fill();
    context.stroke();
    context.globalAlpha = 1;
  }
}
render();

function compare(a, b) {
  return a - b;
}
// http://alienryderflex.com/polygon_fill/
function fill(vertices) {
  var min_x = vertices[0].x;
  var min_y = vertices[0].y;
  var max_x = vertices[0].x;
  var max_y = vertices[0].y;
  for (var i = 0; i < vertices.length; ++i) {
    if (vertices[i].x < min_x) min_x = vertices[i].x;
    if (vertices[i].y < min_y) min_y = vertices[i].y;
    if (vertices[i].x > max_x) max_x = vertices[i].x;
    if (vertices[i].y > max_y) max_y = vertices[i].y;
  }
  for (var y = min_y; y < max_y; ++y) {
    var j = vertices.length - 1;
    var intersects = [];
    for (var i = 0; i < vertices.length; ++i) {
      if (vertices[i].y < y && vertices[j].y >= y || vertices[j].y < y && vertices[i].y >= y) {
        intersects.push(Math.round(vertices[i].x + (y - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x)));
      }
      j = i;
    }
    intersects.sort(compare);
    for (var i = 0; i < intersects.length; i += 2) {
      if (intersects[i] >= max_x) break;
      if (intersects[i+1] > min_x) {
        if (intersects[i] < min_x) intersects[i] = min_x;
        if (intersects[i+1] > max_x) intersects[i+1] = max_x;
        for (var x = intersects[i]; x < intersects[i+1]; ++x) {
          c[x][y] = 0;
        }
      }
    }
  }
}

var mouse_x = 0;
var mouse_y = 0;
addEventListener('mousemove', function(e) {
  mouse_x = e.offsetX;
  mouse_y = e.offsetY;
});
addEventListener('mousedown', function(e) {
  vertices.push({x: e.offsetX, y: e.offsetY});
  if (e.which == 3) {
    fill(vertices);
    vertices = [];
  }
});
addEventListener('contextmenu', function(e) { e.preventDefault(); });



