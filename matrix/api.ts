import * as mathjs from "mathjs";
import {Matrix} from "mathjs";
import {APIResult} from "../index";

/**
 * Take two matrices and return the result of their mathematical product
 * @param a if undefined then error (Unexpected type of argument)
 * @param b if undefined then error (Unexpected type of argument)
 *
 * @return json
 * => error if sizes does not match (Dimension mismatch in multiplication)
 */
export function matrix_product(a: Matrix, b: Matrix) : APIResult {
    try{
        let x: Matrix = mathjs.multiply(a,b)
        return{
            result: x,
        }
    }
    catch (e) {
        return {
            result: null,
            error: e.message,
        }
    }
}

/**
 * Take a matrix and return his inverse
 * @param a if undefined then error (Unexpected type of argument)
 *
 * @return json
 * => error if determinant is 0 (Cannot calculate inverse, determinant is zero)
 * => error if matrix is not square (Matrix must be square)
 */
export function matrix_inverse(a: Matrix) : APIResult {
    try{
        let x: Matrix = mathjs.inv(a)
        return {
            result: x,
        }
    }
    catch (e) {
        return {
            result: null,
            error: e.message,
        }
    }
}

/**
 * Take an array of data, create a matrix.
 * Ex: createMatrix([1,2,3,4], 2, 2) => [[1,2],[3,4]]
 * Ex: createMatrix([1,2,3,4], 2) => [[1,2],[3,4]]
 */
export function createMatrix(data: number[], cols: number, rows?: number) : Matrix {
    if (rows === undefined) rows = cols;
    let matrixData: number[][] = [];

    for (let i = 0; i < rows; i++) {
        matrixData[i] = [];
        for (let j = 0; j < cols; j++) {
            let v = data[i * cols + j];
            if (v == undefined || Number.isNaN((v))) v = 0;
            matrixData[i][j] = v;
        }
    }
    return mathjs.matrix(matrixData, "dense", "number");
}

export enum MatrixErrors {
    PARAMETER_EMPTY = "Value null of undefined",
    NOT_INVERTIBLE = "Matrix not invertible",
    VECTOR_B_INVALID_SIZE = "The number of values in b is not equals to the number of rows in A.",
}

function lu_factorization_with_steps(matrix: Matrix, b: Array<Number>) : APIResult {
    const steps : Array<Object> = [];
    let L : Matrix = matrix;
    let U : Matrix = matrix;
    let X : Matrix = matrix;
    let empty = false;

    // FIRST STEP
    const checks = [
        { text: "Matrix must be two dimensional", ok: true },
        { text: "Matrix must be square", ok: true }
    ];
    const mSize = matrix.size(); if (mSize.length !== 2) { checks[0].ok = false; empty = true; }
    const rows = mSize[0], columns = mSize[1]; if (rows !== columns) { checks[1].ok = false; empty = true; }
    steps.push({
        text: "Checking the format of the submitted matrix",
        steps: checks
    });

    // SECOND STEP
    const determinants = [];
    const range = []
    let dn = null; // last dn
    for (let i = 0; i < rows; i++) {
        range.push(i);
        let v = mathjs.subset(matrix, mathjs.index(range, range))
        dn = mathjs.det(v)
        let res = {
            text: `Checking leading minor $\\Delta_${i+1}$`,
            ok: dn > 0
        }
        determinants.push(res);
        if (!res.ok) { empty = true; break; } // stop if invalid
    }
    if (!empty) { // not processing the last step of this category
        determinants.push({text: `Matrix must be invertible ($\\Delta_${rows} \\neq 0$)`, ok: dn > 0})
    }
    steps.push({
        text: "Check preconditions",
        steps: determinants
    })

    // THIRD STEP
    if (!empty) {
        const res = mathjs.lup(matrix);
        // @ts-ignore
        L = res.L; U = res.U;

        steps.push({
            text: 'Create U with Gauss reduction',
            steps: { type: 'matrix', value: U.toArray() }
        })

        steps.push({
            text: 'Create L with the coefficients used in Gauss reduction (then k in $L_j <- L_j - k * L_i$)',
            steps: { type: 'matrix', value: L.toArray() }
        })

        // @ts-ignore
        const Y = mathjs.lsolve(L, b);
        steps.push({
            text: 'Find Y given that $LY = b$',
            // @ts-ignore
            steps: { type: 'matrix', value: Y.toArray().flat() }
        })

        // @ts-ignore
        X = mathjs.usolve(U, Y);
        steps.push({
            text: 'Find X given that $UX = Y$',
            steps: { type: 'matrix', value: X.toArray().flat() }
        })
    }

    if (empty) return { result: { L: null, U: null, X: null, steps: steps } };

    return { result: { L: L.toArray(), U: U.toArray(), X: X.toArray().flat(), steps: steps } }
}

/**
 * Take a matrix, and returns the LU factorization, with the steps
 *
 * @param matrix return PARAMETER_EMPTY in error if undefined/null
 *               return NOT_INVERTIBLE in error in not invertible
 * @param b return PARAMETER_EMPTY if undefined/null
 *          return VECTOR_B_INVALID_SIZE if the number rows of b isn't equals to the numbers of rows in matrix

 * @param computeSteps [since 2.0] if true, compute steps
 *
 * @return json The result is an array made of one to two entries
 *              - result, null if failed, error_message will be added with some information
 *                  - L: [[1,0,0], [0.5,1,0], [0.5,0.6666666666666666, 1]]
 *                  - U: [[4,2,2], [0,9,6], [0,0,16]]
 *                  - X: [4, -1, -1]
 *              - [error]: if result is null, information about "why"
 *                  - NOT_INVERTIBLE if not invertible
 *                  - VECTOR_B_INVALID_SIZE if the size of b do
 *                  - "Cannot convert \"a value here\" to a number"
 *
 * @example lu_factorization([[4,2,2], [2,10,7], [2,7,21]], [12,-9,-20])
 */
export function lu_factorization(matrix: Matrix, b: Array<Number>, computeSteps = false) : APIResult {
    // include undefined
    if ( matrix == null || b == null ) return { result: null, error: MatrixErrors.PARAMETER_EMPTY }
    if ( matrix.size().shift() != b.length ) return { result: null, error: MatrixErrors.VECTOR_B_INVALID_SIZE }

    try {
        if (computeSteps) return lu_factorization_with_steps(matrix, b);

        const f = mathjs.lup(matrix)
        // @ts-ignore
        const x = mathjs.lusolve(f, b)
        // ok
        // @ts-ignore
        return { result: { L: f.L.toArray(), U: f.U.toArray(), X: x.toArray().flat() } }
    } catch (e) {
        let error = e.message;
        switch (error) {
            case 'Dimension mismatch. Matrix columns must match vector length.':
                error = MatrixErrors.VECTOR_B_INVALID_SIZE; break;
            case 'Linear system cannot be solved since matrix is singular':
                error = MatrixErrors.NOT_INVERTIBLE; break;
            default: break;
        }
        return { result: null, error: error };
    }
}