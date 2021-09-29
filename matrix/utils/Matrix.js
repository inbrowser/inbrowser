"use strict";
exports.__esModule = true;
exports.createMatrix = void 0;
var Mathjs = require("mathjs");
function createMatrix(data, cols, rows) {
    var _a;
    if (rows === undefined)
        rows = cols;
    var matrixData = [];
    for (var i = 0; i < rows; i++) {
        matrixData[i] = [];
        for (var j = 0; j < cols; j++) {
            matrixData[i][j] = (_a = data[i * cols + j]) !== null && _a !== void 0 ? _a : 0;
        }
    }
    return Mathjs.matrix(matrixData, "dense", "number");
}
exports.createMatrix = createMatrix;
//# sourceMappingURL=Matrix.js.map