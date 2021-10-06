const {lu_factorization, createMatrix, MatrixErrors} = require("./api");
const assert = require("assert");

describe('lu_factorization', function() {
    // matrix 2x2 with only 0
    let matrix_valid = createMatrix([4,2,2,2,10,7,2,7,21], 3, 3);
    let b_valid = [12,-9,-20]
    let expected_valid_X = [4, -1, -1]
    let expected_valid_L = [[1,0,0], [0.5,1,0], [0.5, 0.6666666666666666, 1]]
    let expected_valid_U = [[4,2,2], [0,9,6], [0,0,16]]

    describe('testing parameters', function() {
        it('both undefined', function() {
            let json = lu_factorization(undefined, undefined);
            assert.notEqual(json, null);
            assert.equal(json.result, null);
            assert.equal(json.error, MatrixErrors.PARAMETER_EMPTY);
        });
        it('the first is undefined', function() {
            let json = lu_factorization(undefined, b_valid);
            assert.notEqual(json, null);
            assert.equal(json.result, null);
            assert.equal(json.error, MatrixErrors.PARAMETER_EMPTY);
        });
        it('the second is undefined', function() {
            let json = lu_factorization(matrix_valid, undefined);
            assert.notEqual(json, null);
            assert.equal(json.result, null);
            assert.equal(json.error, MatrixErrors.PARAMETER_EMPTY);
        });
    });

    describe('testing parameters values for LU', function() {
        // Cannot calculate inverse, determinant is zero
        it('matrix not invertible', function() {
            let matrix_not_invertible = createMatrix([], 2, 2);
            let json = lu_factorization(matrix_not_invertible, [2,2]);
            assert.notEqual(json, null);
            assert.equal(json.result, null);
            assert.equal(json.error, MatrixErrors.NOT_INVERTIBLE);
        });
        it('size for b not matching size of A', function() {
            let json = lu_factorization(matrix_valid, [10,20,30,4]);
            assert.notEqual(json, null);
            assert.equal(json.result, null);
            assert.equal(json.error, MatrixErrors.VECTOR_B_INVALID_SIZE);
        });
        // Uncaught Error: Cannot convert "toto" to a number
        it('got invalid numbers', function() {
            let matrix_not_invertible = createMatrix(["toto", 0, 0, 0], 2, 2);
            let json = lu_factorization(matrix_not_invertible, [0, 0]);
            assert.notEqual(json, null);
            assert.equal(json.result, null);
            assert.equal(json.error, "Cannot convert \"toto\" to a number");
        });
    });

    describe('checking result values', function() {
        it('given a matrix 3x3', function() {
            let json = lu_factorization(matrix_valid, b_valid)
            console.log(json)
            assert.notEqual(json, null);
            assert.notEqual(json.result, null);
            assert.deepStrictEqual(json.result.X, expected_valid_X);
            assert.deepStrictEqual(json.result.L, expected_valid_L);
            assert.deepStrictEqual(json.result.U, expected_valid_U);
        });
    });
});