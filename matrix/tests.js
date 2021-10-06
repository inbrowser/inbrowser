const {createMatrix} = require("./utils/Matrix");
const {lu_factorization, matrix_product, matrix_inverse} = require("./api");
const assert = require("assert");

describe('lu_factorization', function() {
    describe('checking X value', function() {
        it('given a matrix 3x3', async function() {
            let matrix = createMatrix([4,2,2,2,10,7,2,7,21], 2, 3);
            let b = [12,-9,-20]
            let expected = [4, -1, -1]
            let json = lu_factorization(matrix, b, true)
            assert.notEqual(json, null);
            assert.notEqual(json.result, null);
            assert.deepStrictEqual(json.result.X, expected);
        });
    });
});

describe('Matrix product', function() {
    describe('testing params', function() {
        it('given two matrices with empty parameters', async function() {
            let json = matrix_product(undefined, undefined);
            assert.deepStrictEqual(json.result, null);
            let message_in = json.error.includes("Unexpected type of argument")
            assert.ok(message_in);
        });

        it('given two matrices with incompatible sizes', async function() {
            let A = createMatrix([2,3,5,8,1,6], 2, 3);
            let B = createMatrix([7,1,3,-2,8,0,-9,6,3], 3, 3);
            let json = matrix_product(A, B);
            assert.deepStrictEqual(json.result, null);
            assert.deepStrictEqual(json.error, "Dimension mismatch in multiplication. Matrix A columns (2) must match Matrix B rows (3)");
        });
    });

    describe('testing result', function() {
        it('given two matrices 3x3: In*B', async function() {
            let A = createMatrix([4,2,2,2,10,7,2,7,21], 3, 3);
            let B = createMatrix([1,0,0,0,1,0,0,0,1], 3, 3);
            let expected = createMatrix([4,2,2,2,10,7,2,7,21], 3, 3);
            let json = matrix_product(A, B);
            assert.deepStrictEqual(json.result, expected);
        });

        it('given two matrices 3x3: A*B', async function() {
            let A = createMatrix([2,3,5,8,1,6,4,8,9], 3, 3);
            let B = createMatrix([7,1,3,-2,8,0,-9,6,3], 3, 3);
            let expected = createMatrix([-37,56,21,0,52,42,-69,122,39], 3, 3);
            let json = matrix_product(A, B);
            assert.deepStrictEqual(json.result, expected);
        });
    });
});

describe('Matrix inverse', function() {
    describe('testing params', function() {
        it('given two matrices with empty parameters', async function() {
            let json = matrix_inverse(undefined);
            assert.deepStrictEqual(json.result, null);
            let message_in = json.error.includes("Unexpected type of argument")
            assert.ok(message_in);
        });
        it('given a matrix with determinant 0', async function() {
            let A = createMatrix([],2,2)
            let json = matrix_inverse(A);
            assert.deepStrictEqual(json.result, null);
            assert.deepStrictEqual(json.error, "Cannot calculate inverse, determinant is zero");
        });
        it('given a non square matrix', async function() {
            let A = createMatrix([2,3,5,8,1,6], 2, 3);
            let json = matrix_inverse(A);
            assert.deepStrictEqual(json.result, null);
            assert.deepStrictEqual(json.error, "Matrix must be square (size: [3, 2])");
        });
    });

    describe('testing result', function() {
        it('given a matrix 3x3', async function() {
            let A = createMatrix([-5,6,0,8,9,-6,1,2,8], 3, 3);
            let expected = [ [ -0.09999999999999999,
                0.05714285714285714,
                0.04285714285714286 ],
                [ 0.08333333333333334,
                    0.047619047619047616,
                    0.03571428571428572 ],
                [ -0.008333333333333335,
                    -0.019047619047619053,
                    0.11071428571428572 ] ];
            let json = matrix_inverse(A);
            assert.deepStrictEqual(json.result.toArray(), expected);
        });
    });
});