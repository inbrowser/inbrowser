import {Matrix} from "mathjs";
import * as mathjs from "mathjs";

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
 * Take a matrix, and returns the LU factorization, with the steps
 *
 * lu_factorization([[4,2,2], [2,10,7], [2,7,21]], [12,-9,-20])
 *
 * The result is an array made of one to two entries
 *
 * - result, null if failed, error_message will be added with some information
 *  - L: [[1,0,0], [0.5,1,0], [0.5,0.0.6666667, 1]]
 *  - U: [[4,2,2], [0,9,6], [0,0,16]]
 *  - X: [4, -1, -1]
 * - steps (null, if computeSteps is false)
 *  - ... checking ... => ok/ko
 *  - ... formula ... => L
 *  - ... coefficients ... => U
 *  - ... solving LY=b ... => Y
 *  - ... solving UX=Y => X
 *  - [error_message]: if result is null, information about "why"
 */
 export function lu_factorization(matrix: Matrix, b: Array<Number>, computeSteps = true) {
    // not coded
    return {
        result: {
            L: [[1,0,0], [0.5,1,0], [0.5,0.6666667, 1]],
            U: [[4,2,2], [0,9,6], [0,0,16]],
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
                        /*done: true, true by default*/
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