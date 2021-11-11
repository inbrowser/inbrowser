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
function lu_factorization_with_steps(matrix, b) {
    var steps = [];
    var L = matrix;
    var U = matrix;
    var X = matrix;
    var empty = false;
    var checks = [
        { text: "Matrix must be two dimensional", ok: true },
        { text: "Matrix must be square", ok: true }
    ];
    var mSize = matrix.size();
    if (mSize.length !== 2) {
        checks[0].ok = false;
        empty = true;
    }
    var rows = mSize[0], columns = mSize[1];
    if (rows !== columns) {
        checks[1].ok = false;
        empty = true;
    }
    steps.push({
        text: "Checking the format of the submitted matrix",
        steps: checks
    });
    var determinants = [];
    var range = [];
    var dn = null;
    for (var i = 0; i < rows; i++) {
        range.push(i);
        var v = mathjs.subset(matrix, mathjs.index(range, range));
        dn = mathjs.det(v);
        var res = {
            text: "Checking leading minor $\\Delta_" + (i + 1) + "$",
            ok: dn > 0
        };
        determinants.push(res);
        if (!res.ok) {
            empty = true;
            break;
        }
    }
    if (!empty) {
        determinants.push({ text: "Matrix must be invertible ($\\Delta_" + rows + " \\neq 0$)", ok: dn > 0 });
    }
    steps.push({
        text: "Check preconditions",
        steps: determinants
    });
    if (!empty) {
        var res = mathjs.lup(matrix);
        L = res.L;
        U = res.U;
        steps.push({
            text: 'Create U with Gauss reduction',
            steps: { type: 'matrix', value: U.toArray() }
        });
        steps.push({
            text: 'Create L with the coefficients used in Gauss reduction (then k in $L_j <- L_j - k * L_i$)',
            steps: { type: 'matrix', value: L.toArray() }
        });
        var Y = mathjs.lsolve(L, b);
        steps.push({
            text: 'Find Y given that $LY = b$',
            steps: { type: 'matrix', value: Y.toArray().flat() }
        });
        X = mathjs.usolve(U, Y);
        steps.push({
            text: 'Find X given that $UX = Y$',
            steps: { type: 'matrix', value: X.toArray().flat() }
        });
    }
    if (empty)
        return { result: { L: null, U: null, X: null, steps: steps } };
    return { result: { L: L.toArray(), U: U.toArray(), X: X.toArray().flat(), steps: steps } };
}
function lu_factorization(matrix, b, computeSteps) {
    if (computeSteps === void 0) { computeSteps = false; }
    if (matrix == null || b == null)
        return { result: null, error: MatrixErrors.PARAMETER_EMPTY };
    if (matrix.size().shift() != b.length)
        return { result: null, error: MatrixErrors.VECTOR_B_INVALID_SIZE };
    try {
        if (computeSteps)
            return lu_factorization_with_steps(matrix, b);
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