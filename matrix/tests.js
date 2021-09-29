const {createMatrix} = require("./utils/Matrix");
const {lu_factorization} = require("./api");
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
            assert.notEqual(json.result.X, expected);
        });
    });
});