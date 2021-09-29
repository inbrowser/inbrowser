"use strict";
exports.__esModule = true;
exports.lu_factorization = void 0;
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
exports.lu_factorization = lu_factorization;
//# sourceMappingURL=api.js.map