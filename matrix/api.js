"use strict";
exports.__esModule = true;
exports.lu_factorization = exports.matrix_inverse = exports.matrix_product = void 0;
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
function lu_factorization(matrix, b, computeSteps) {
    if (computeSteps === void 0) { computeSteps = true; }
    return {
        result: {
            L: [[1, 0, 0], [0.5, 1, 0], [0.5, 0.6666667, 1]],
            U: [[4, 2, 2], [0, 9, 6], [0, 0, 16]],
            X: [4, -1, -1]
        },
        steps: [
            {
                text: "Checking submitted data",
                steps: [
                    { text: "Square matrix: ok" },
                    { text: "Length of b matching A: ok" },
                    {
                        text: "Checking that every leading minor is not null",
                        steps: [
                            { math: "det(\\Delta_1) = 4 \\gt 0" },
                            { math: "det(\\Delta_2) = 36 \\gt 0" },
                            { math: "det(\\Delta_3) = 576 \\gt 0" },
                        ]
                    },
                    {
                        text: "Checking that the matrix is invertible",
                        steps: [{ math: "det(A) = det(\\Delta_3) \\neq 0" }]
                    }
                ]
            },
            {
                text: "Gauss reduction",
                steps: [
                    { math: "L_2 \\leftarrow L_2 - {\\color{blue}1/2} L_1" },
                    { math: "L_3 \\leftarrow L_3 - {\\color{blue}1/2} L_1" },
                    { math: "\\begin{pmatrix}\n" +
                            "4 & 2 & 2 \\\\\n" +
                            "0 & 9 & 6 \\\\\n" +
                            "0 & 6 & 20 \\\\\n" +
                            "\\end{pmatrix}" },
                    { math: "L_3 \\leftarrow L_3 - {\\color{blue}2/3} L_1" },
                    { math: "U = \\begin{pmatrix}\n" +
                            "4 & 2 & 2 \\\\\n" +
                            "0 & 9 & 6 \\\\\n" +
                            "0 & 0 & 16 \\\\\n" +
                            "\\end{pmatrix}" },
                ]
            },
            {
                text: "Using the k we removed, we got",
                steps: [
                    { math: "L = \\begin{pmatrix}\n" +
                            "1 & 0 & 0 \\\\\n" +
                            "1/2 & 1 & 0 \\\\\n" +
                            "1/2 & 2/3 & 1 \\\\\n" +
                            "\\end{pmatrix}" },
                ]
            },
            {
                text: "We are solving LY=b",
                steps: [
                    { math: "x = 12" },
                    { math: "y = -9 - \\frac{12}{2} = -15" },
                    { math: "z = -20 - \\frac{12}{2} + \\frac{2*15}{3} = -16" },
                    { math: "Y = (12,-15,-16)" },
                ]
            },
            {
                text: "We are solving UX=Y",
                steps: [
                    { math: "z = \\frac{16}{-16} = -1" },
                    { math: "y = \\frac{-15 +6}{9} = -1" },
                    { math: "x = \\frac{12 + 2 + 2}{4} = 4" },
                    { math: "X = (4,-1,-1)" },
                ]
            }
        ]
    };
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
        var f = Mathjs.lup(matrix);
        var x = Mathjs.lusolve(f, b);
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