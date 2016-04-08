var electric_x;
var electric_y;
var magnetic_z;
var current_x;
var current_y;

var start_electric_x = function () {
    electric_x = [];
    for (var i = 0; i < width; ++i) {
        electric_x[i] = [];
        for (var j = 0; j <= height; ++j) {
            electric_x[i][j] = 0;
        }
    }
};
var start_electric_y = function () {
    electric_y = [];
    for (var i = 0; i <= width; ++i) {
        electric_y[i] = [];
        for (var j = 0; j < height; ++j) {
            electric_y[i][j] = 0;
        }
    }
};
var start_magnetic_z = function () {
    magnetic_z = [];
    for (var i = 0; i < width; ++i) {
        magnetic_z[i] = [];
        for (var j = 0; j < height; ++j) {
            magnetic_z[i][j] = 0;
        }
    }
};
var start_current_x = function () {
    current_x = [];
    for (var i = 0; i < width; ++i) {
        current_x[i] = [];
        for (var j = 0; j <= height; ++j) {
            current_x[i][j] = 0;
        }
    }
};
var start_current_y = function () {
    current_y = [];
    for (var i = 0; i <= width; ++i) {
        current_y[i] = [];
        for (var j = 0; j < height; ++j) {
            current_y[i][j] = 0;
        }
    }
};
var start = function () {
    start_electric_x();
    start_electric_y();
    start_magnetic_z();
    start_current_x();
    start_current_y();
};

var update_boundaries = function () {
    for (var j = 0; j < height; ++j) {
        electric_y[0][j] += light_speed * (electric_y[1][j] - electric_y[0][j]) * timestep;
        electric_y[width][j] += light_speed * (electric_y[width-1][j] - electric_y[width][j]) * timestep;
    }
    for (var i = 0; i < width; ++i) {
        electric_x[i][0] += light_speed * (electric_x[i][1] - electric_x[i][0]) * timestep;
        electric_x[i][height] += light_speed * (electric_x[i][height-1] - electric_x[i][height]) * timestep;
    }
};
var update_electric_x = function () {
    for (var i = 0; i < width; ++i) {
        for (var j = 1; j < height; ++j) {
            electric_x[i][j] += (light_speed * (magnetic_z[i][j] - magnetic_z[i][j - 1]) - current_x[i][j]) * timestep;
        }
    }
};
var update_electric_y = function () {
    for (var i = 1; i < width; ++i) {
        for (var j = 0; j < height; ++j) {
            electric_y[i][j] += (light_speed * (magnetic_z[i - 1][j] - magnetic_z[i][j]) - current_y[i][j]) * timestep;
        }
    }
};
var update_magnetic_z = function () {
    for (var i = 0; i < width; ++i) {
        for (var j = 0; j < height; ++j) {
            magnetic_z[i][j] += (light_speed * (electric_x[i][j + 1] - electric_x[i][j] + electric_y[i][j] - electric_y[i + 1][j])) * timestep;
        }
    }
}
var update_current_x = function () {
    for (var i = 0; i < width; ++i) {
        for (var j = 0; j <= height; ++j) {
            
        }
    }
};
var update_current_y = function () {
    for (var i = 0; i <= width; ++i) {
        for (var j = 0; j < height; ++j) {
            
        }
    }
};
var update = function () {
    update_electric_x();
    update_electric_y();
    update_magnetic_z();
    update_current_x();
    update_current_y();
    update_boundaries();
};