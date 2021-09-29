import * as Mathjs from "mathjs";

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
            matrixData[i][j] = data[i * cols + j] ?? 0;
        }
    }

    return Mathjs.matrix(matrixData, "dense", "number");
}