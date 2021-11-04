const {createMatrix, MatrixErrors, lu_factorization, matrix_product, matrix_inverse} = require("./api");
const assert = require("assert");

describe('Matrix', function () {
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

        describe('Testing steps', function () {
            const first_check_valid = {
                text: "Checking the format of the submitted matrix",
                steps: [
                    { text: "Matrix must be two dimensional", ok: true },
                    { text: "Matrix must be square", ok: true }
                ]
            };
            it('given a valid matrix', function() {
                const json = lu_factorization(matrix_valid, b_valid, true)
                const steps = json.result.steps;

                assert.deepStrictEqual(steps[0], first_check_valid);

                assert.deepStrictEqual(steps[1], {
                    text: "Check preconditions",
                    steps: [
                        { text: `Checking leading minor $\\Delta_1$`, ok: true },
                        { text: `Checking leading minor $\\Delta_2$`, ok: true },
                        { text: `Checking leading minor $\\Delta_3$`, ok: true },
                        { text: "Matrix must be invertible ($D_3 \\neq 0$)", ok: true }
                    ]
                });

                assert.deepStrictEqual(steps[2].text, 'Create U with Gauss reduction');
                assert.deepStrictEqual(steps[2].steps.value.toArray(), expected_valid_U);

                assert.deepStrictEqual(steps[3].text, 'Create L with the coefficients used in Gauss reduction (then k in $L_j <- L_j - k * L_i$)');
                assert.deepStrictEqual(steps[3].steps.value.toArray(), expected_valid_L);

                assert.deepStrictEqual(steps[4].text, 'Find Y given that $LY = b$');
                assert.deepStrictEqual(steps[4].steps.value.toArray(), [[12], [-15], [-16]]);

                assert.deepStrictEqual(steps[5].text, 'Find X given that $UX = Y$');
                assert.deepStrictEqual(steps[5].steps.value.toArray().flat(), expected_valid_X);
            });
            it('given an invalid matrix', function() {
                const matrix_not_invertible = createMatrix([], 2, 2);
                const json = lu_factorization(matrix_not_invertible, [2, 2], true)
                const steps = json.result.steps;
                assert.deepStrictEqual(steps[0], first_check_valid);
                assert.deepStrictEqual(steps[1], {
                    text: "Check preconditions",
                    steps: [
                        { text: `Checking leading minor $\\Delta_1$`, ok: false }
                    ]
                });
            });
        })
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
})