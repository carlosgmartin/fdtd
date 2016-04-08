var count_x = 200;
var count_y = 200;
var dx = 5;
var dy = 5;
var dt = 1;

var ex;
var ey;
var ez;
var bx;
var by;
var bz;
var jx;
var jy;
var jz;

var start = function () {
    ex = [];
    ey = [];
    ez = [];
    bx = [];
    by = [];
    bz = [];
    jx = [];
    jy = [];
    jz = [];
    for (var i = 0; i < count_x; ++i) {
        ex[i] = [];
        ey[i] = [];
        ez[i] = [];
        bx[i] = [];
        by[i] = [];
        bz[i] = [];
        jx[i] = [];
        jy[i] = [];
        jz[i] = [];
        for (var j = 0; j < count_y; ++j) {
            ex[i][j] = 0;
            ey[i][j] = 0;
            ez[i][j] = 0;
            bx[i][j] = 0;
            by[i][j] = 0;
            bz[i][j] = 0;
            jx[i][j] = 0;
            jy[i][j] = 0;
            jz[i][j] = 0;
        }
    }
};

var clear = function () {
    for (var i = 0; i < count_x; ++i) {
        for (var j = 0; j < count_y; ++j) {
            ex[i][j] = 0;
            ey[i][j] = 0;
            ez[i][j] = 0;
            bx[i][j] = 0;
            by[i][j] = 0;
            bz[i][j] = 0;
            jx[i][j] = 0;
            jy[i][j] = 0;
            jz[i][j] = 0;
        }
    }
};

var update_e = function () {
    for (var i = 1; i < count_x; ++i) {
        for (var j = 1; j < count_y; ++j) {
            ex[i][j] += ((bz[i][j] - bz[i][j - 1]) / dy - jx[i][j]) * dt;
            ey[i][j] += (-(bz[i][j] - bz[i - 1][j]) / dx - jy[i][j]) * dt;
            ez[i][j] += ((by[i][j] - by[i - 1][j]) / dx - (bx[i][j] - bx[i][j - 1]) / dy - jz[i][j]) * dt;
        }
    }
};

var update_b = function () {
    for (var i = 0; i < count_x - 1; ++i) {
        for (var j = 0; j < count_y - 1; ++j) {
            bx[i][j] += -(ez[i][j + 1] - ez[i][j]) / dy * dt;
            by[i][j] += (ez[i + 1][j] - ez[i][j]) / dx * dt;
            bz[i][j] += ((ex[i][j + 1] - ex[i][j]) / dy - (ey[i + 1][j] - ey[i][j]) / dx) * dt;
        }
    }
};




var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = (count_x - 1) * dx;
canvas.height = (count_y - 1) * dy;
var graphics = canvas.getContext('2d');

var render = function () {
    graphics.strokeStyle = 'red';
    graphics.beginPath();
    for (var i = 0; i < count_x; ++i) {
        for (var j = 0; j < count_y; ++j) {
            graphics.moveTo(i * dx, j * dy);
            graphics.lineTo(i * dx + ex[i][j], j * dy + ey[i][j]);
        }
    }
    graphics.stroke();
};

var render_back = function () {
    graphics.fillStyle = 'black';
    for (var i = 0; i < count_x; ++i) {
        for (var j = 0; j < count_y; ++j) {
            graphics.globalAlpha = 1/(1+Math.exp(-bz[i][j]));
            graphics.fillRect(i * dx, j * dy, dx, dy);
        }
    }
    graphics.globalAlpha = 1;
};

var render_front = function () {
    graphics.strokeStyle = 'blue';
    graphics.beginPath();
    for (var i = 0; i < count_x; ++i) {
        for (var j = 0; j < count_y; ++j) {
            graphics.moveTo(i * dx, j * dy);
            graphics.lineTo(i * dx + jx[i][j], j * dy + jy[i][j]);
        }
    }
    graphics.stroke();
};

var loop = function () {
    update_e();
    update_b();
    update_j();
    graphics.clearRect(0, 0, canvas.width, canvas.height);
    render_back();
    render();
    //render_front();
};

var update_j = function () {
    var current = 0.1;
    var size = 10;
    for (var i = count_x/2 - size; i < count_y/2 + size; ++i) {
        jx[i][count_y/2 - size] += current;
        jx[i][count_y/2 + size] += -current;
    }
    for (var j = count_y/2 - size; j < count_y/2 + size; ++j) {
        jy[count_x/2 - size][j] += -current;
        jy[count_y/2 + size][j] += current;
    }
};

start();
setInterval(loop, 1000/30);