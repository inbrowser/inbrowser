import * as mathjs from "mathjs";
import {Matrix} from "mathjs";

/**
 * Take two matrices and return the result of their mathematical product
 * @param a if undefined then error (Unexpected type of argument)
 * @param b if undefined then error (Unexpected type of argument)
 *
 * @return json
 * => error if sizes does not match (Dimension mismatch in multiplication)
 */
export function matrix_product(a: Matrix, b: Matrix) : object {
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
export function matrix_inverse(a: Matrix) : object {
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
export function createMatrix(data: number[], cols: number, rows?: number) {
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

/**
 * Take a matrix, and returns the LU factorization, with the steps
 *
 * @param matrix return PARAMETER_EMPTY in error if undefined/null
 *               return NOT_INVERTIBLE in error in not invertible
 * @param b return PARAMETER_EMPTY if undefined/null
 *          return VECTOR_B_INVALID_SIZE if the number rows of b isn't equals to the numbers of rows in matrix

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
export function lu_factorization(matrix: Matrix, b: Array<Number>) : object {
    // include undefined
    if ( matrix == null || b == null ) return { result: null, error: MatrixErrors.PARAMETER_EMPTY }
    if ( matrix.size().shift() != b.length ) return { result: null, error: MatrixErrors.VECTOR_B_INVALID_SIZE }

    try {
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