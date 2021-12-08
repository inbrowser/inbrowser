const {createMatrix, MatrixErrors, lu_factorization, matrix_product, matrix_inverse,
	matrix_determinant, matrix_exponential, matrix_solve_AX_eq_Y} = require("./api");
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
				assert.equal(json.error, "The parameter \"matrix\" should not be null of undefined");
			});
			it('matrix is undefined', function() {
				let json = lu_factorization(undefined, b_valid);
				assert.notEqual(json, null);
				assert.equal(json.result, null);
				assert.equal(json.error, "The parameter \"matrix\" should not be null of undefined");
			});
			it('b is undefined', function() {
				let json = lu_factorization(matrix_valid, undefined);
				assert.notEqual(json, null);
				assert.equal(json.result, null);
				assert.equal(json.error, "The parameter \"b\" should not be null of undefined");
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
				let json = lu_factorization(matrix_valid, b_valid);
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
			it('given a valid matrix with a positive determinant', function() {
				const json = lu_factorization(matrix_valid, b_valid, true)
				const steps = json.result.steps;

				assert.deepStrictEqual(steps[0], first_check_valid);

				assert.deepStrictEqual(steps[1], {
					text: "Check preconditions",
					steps: [
						{ text: `Checking leading minor $\\Delta_1$`, ok: true },
						{ text: `Checking leading minor $\\Delta_2$`, ok: true },
						{ text: `Checking leading minor $\\Delta_3$`, ok: true },
						{ text: "Matrix must be invertible ($\\Delta_3 \\neq 0$)", ok: true }
					]
				});

				assert.deepStrictEqual(steps[2].text, 'Create U with Gauss reduction');
				assert.deepStrictEqual(steps[2].steps.value, expected_valid_U);

				assert.deepStrictEqual(steps[3].text, 'Create L with the coefficients used in Gauss reduction (the k in $L_j <- L_j - k * L_i$)');
				assert.deepStrictEqual(steps[3].steps.value, expected_valid_L);

				assert.deepStrictEqual(steps[4].text, 'Find Y given that $LY = b$');
				assert.deepStrictEqual(steps[4].steps.value, [12, -15, -16]);

				assert.deepStrictEqual(steps[5].text, 'Find X given that $UX = Y$');
				assert.deepStrictEqual(steps[5].steps.value, expected_valid_X);
			});
			// checking the fix > instead of !=
			it('given a valid matrix with a negative determinant', function() {
				let matrix_valid = createMatrix([4,6,2,9,2,2,4,2,9], 3, 3);
				let b_valid = [0,0,0]
				const json = lu_factorization(matrix_valid, b_valid, true)
				const steps = json.result.steps;

				assert.deepStrictEqual(steps[0], first_check_valid);
				assert.deepStrictEqual(steps[1], {
					text: "Check preconditions",
					steps: [
						{ text: `Checking leading minor $\\Delta_1$`, ok: true },
						{ text: `Checking leading minor $\\Delta_2$`, ok: true },
						{ text: `Checking leading minor $\\Delta_3$`, ok: true },
						{ text: "Matrix must be invertible ($\\Delta_3 \\neq 0$)", ok: true }
					]
				});
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
			let A = createMatrix([2,3,5,8,1,6], 2, 3);

			[null, undefined].forEach((p) => {
				it('given two matrices with empty parameters', async function() {
					let json = matrix_product(p, p);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"a\" should not be null of undefined")
				});
				it('given the first matrix empty', async function() {
					let json = matrix_product(p, A);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"a\" should not be null of undefined")
				});
				it('given the second matrix empty', async function() {
					let json = matrix_product(A, p);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"b\" should not be null of undefined")
				});
			})

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
			[null, undefined].forEach((p) => {
				it('given an empty matrix', async function() {
					let json = matrix_inverse(p);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"a\" should not be null of undefined")
				});
			})

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

	describe('Matrix determinant', function() {
		describe('testing params', function() {
			[null, undefined].forEach((p) => {
				it('given an empty matrix', async function() {
					let json = matrix_determinant(p);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"matrix\" should not be null of undefined")
				});
			})

			it('given a non square matrix', async function() {
				let A = createMatrix([2,3,5,8,1,6], 2, 3);
				let json = matrix_determinant(A);
				assert.deepStrictEqual(json.result, null);
				assert.ok(json.error.startsWith("Matrix must be square"));
			});
		});

		describe('testing result', function() {
			it('given I3 (identity matrix 3x3)', async function() {
				let A = createMatrix([1,0,0,0,1,0,0,0,1], 3, 3);
				let expected = 1;
				let json = matrix_determinant(A);
				assert.deepStrictEqual(json.result, expected);
			});

			it('given a random matrix', async function() {
				let A = createMatrix([-9,8,4,8,3,-5,8,1,0,2,3,9,-1,6,3,4], 4, 4);
				let expected = -3291;
				let json = matrix_determinant(A);
				assert.notDeepEqual(json.result, null);
				// noinspection JSCheckFunctionSignatures
				assert.deepStrictEqual(Math.round(json.result), expected);
			});
		});
	});

	describe('Matrix exponential', function() {
		describe('testing params', function() {
			[null, undefined].forEach((p) => {
				it('given an empty matrix', async function() {
					let json = matrix_exponential(p);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"matrix\" should not be null of undefined")
				});
			})

			it('given a non square matrix', async function() {
				let A = createMatrix([2,3,5,8,1,6], 2, 3);
				let json = matrix_exponential(A);
				assert.deepStrictEqual(json.result, null);
				assert.ok(json.error.startsWith("Matrix must be square"));
			});
		});

		describe('testing result', function() {
			it('given I3 (identity matrix 3x3)', async function() {
				let A = createMatrix([1,0,0,0,1,0,0,0,1], 3, 3);
				let e = Number(Math.exp(1).toFixed(4));
				let expected = [[e,0,0],[0,e,0],[0,0,e]];
				let json = matrix_exponential(A);
				let res = json.result.toArray().map((e) => e.map((e) => Number(e.toFixed(4))));
				assert.deepStrictEqual(res, expected);
			});

			it('given a random matrix', async function() {
				let A = createMatrix([5,0,3,-6,-1,-3,-6,0,-4], 3, 3);
				let expected = createMatrix([14.4102,0,7.0212,-14.0424,0.3679,-7.0212,-14.0424,0,-6.6533], 3, 3);
				let json = matrix_exponential(A);
				let res = json.result.toArray().map((e) => e.map((e) => Number(e.toFixed(4))));
				assert.deepStrictEqual(res, expected.toArray());
			});
		});
	});

	describe('Matrix solve AX = Y', function() {
		let A = createMatrix([2,3,5,8,1,6], 2, 3);
		let Y = [7,1,3,-2,8,0,-9,6,3]

		describe('testing params', function() {
			[null, undefined].forEach((p) => {
				it('given two matrices with empty parameters', async function() {
					let json = matrix_solve_AX_eq_Y(p, p);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"A\" should not be null of undefined")
				});
				it('given the first matrix empty', async function() {
					let json = matrix_solve_AX_eq_Y(p, Y);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"A\" should not be null of undefined")
				});
				it('given the second matrix empty', async function() {
					let json = matrix_solve_AX_eq_Y(A, p);
					assert.deepStrictEqual(json.result, null);
					assert.equal(json.error, "The parameter \"Y\" should not be null of undefined")
				});
			})

			it('given A not square', async function() {
				let A = createMatrix([2,3,5,8,1,6], 2, 3);
				let Y = [7,1,3,-2,8,0,-9,6,3]
				let json = matrix_solve_AX_eq_Y(A, Y);
				assert.deepStrictEqual(json.result, null);
				assert.ok(json.error.startsWith("Matrix must be square"));
			});

			it('given A and Y with incompatible sizes', async function() {
				let A = createMatrix([2,3,8,1], 2, 2);
				let Y = [4,8,9,10]
				let json = matrix_solve_AX_eq_Y(A, Y);
				assert.deepStrictEqual(json.result, null);
				assert.ok(json.error.startsWith("Dimension mismatch in multiplication."));
			});

			it('given A with determinant 0', async function() {
				let A = createMatrix([0,0,0,0], 2, 2);
				let Y = [4,8]
				let json = matrix_solve_AX_eq_Y(A, Y);
				assert.deepStrictEqual(json.result, null);
				assert.deepStrictEqual(json.error, "Cannot calculate inverse, determinant is zero");
			});
		});

		describe('testing result', function() {
			it('given A=I3 (identity 3x3 matrix) and random Y', async function() {
				let A = createMatrix([1,0,0,0,1,0,0,0,1], 3, 3);
				let Y = [4,-5,8]
				let expected = [4,-5,8];
				let json = matrix_solve_AX_eq_Y(A, Y);
				assert.deepStrictEqual(json.result.toArray(), expected);
			});

			it('given random A and Y', async function() {
				let A = createMatrix([1,1,1,0,2,5,2,5,-1], 3, 3);
				let Y = [6,-4,27]
				let expected = [5,3,-2];
				let json = matrix_solve_AX_eq_Y(A, Y);
				let res = json.result.toArray();
				// round every value
				let i = 3; while(i--) res[i] = Math.round(res[i]);
				// check
				assert.deepStrictEqual(res, expected);
			});
		});
	});
})