"use strict";
exports.__esModule = true;
exports.lu_factorization = exports.MatrixErrors = exports.createMatrix = exports.matrix_inverse = exports.matrix_product = void 0;
var mathjs = require("mathjs");
function matrix_product(a, b) {
    try {
        var x = mathjs.multiply(a, b);
        return {
            result: x
        };
    }
    catch (e) {
        return {
            result: null,
            error: e.message
        };
    }
}
exports.matrix_product = matrix_product;
function matrix_inverse(a) {
    try {
        var x = mathjs.inv(a);
        return {
            result: x
        };
    }
    catch (e) {
        return {
            result: null,
            error: e.message
        };
    }
}
exports.matrix_inverse = matrix_inverse;
function createMatrix(data, cols, rows) {
    if (rows === undefined)
        rows = cols;
    var matrixData = [];
    for (var i = 0; i < rows; i++) {
        matrixData[i] = [];
        for (var j = 0; j < cols; j++) {
            var v = data[i * cols + j];
            if (v == undefined || Number.isNaN((v)))
                v = 0;
            matrixData[i][j] = v;
        }
    }
    return mathjs.matrix(matrixData, "dense", "number");
}
exports.createMatrix = createMatrix;
var MatrixErrors;
(function (MatrixErrors) {
    MatrixErrors["PARAMETER_EMPTY"] = "Value null of undefined";
    MatrixErrors["NOT_INVERTIBLE"] = "Matrix not invertible";
    MatrixErrors["VECTOR_B_INVALID_SIZE"] = "The number of values in b is not equals to the number of rows in A.";
})(MatrixErrors = exports.MatrixErrors || (exports.MatrixErrors = {}));
function lu_factorization(matrix, b) {
    if (matrix == null || b == null)
        return { result: null, error: MatrixErrors.PARAMETER_EMPTY };
    if (matrix.size().shift() != b.length)
        return { result: null, error: MatrixErrors.VECTOR_B_INVALID_SIZE };
    try {
        var f = mathjs.lup(matrix);
        var x = mathjs.lusolve(f, b);
        return { result: { L: f.L.toArray(), U: f.U.toArray(), X: x.toArray().flat() } };
    }
    catch (e) {
        var error = e.message;
        switch (error) {
            case 'Dimension mismatch. Matrix columns must match vector length.':
                error = MatrixErrors.VECTOR_B_INVALID_SIZE;
                break;
            case 'Linear system cannot be solved since matrix is singular':
                error = MatrixErrors.NOT_INVERTIBLE;
                break;
            default: break;
        }
        return { result: null, error: error };
    }
}
exports.lu_factorization = lu_factorization;
//# sourceMappingURL=api.js.map