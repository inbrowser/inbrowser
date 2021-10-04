// test related to the evaluation of a function
const assert = require("assert");
const {evaluate_function, CalculusErrorMessages} = require("./api");


describe('evaluate_function', function() {
    // test related to the parameters of the function
    describe('params', function() {
        // "x^5", {y= 2}
        it('invalid variable', async function() {
            // todo: ...
        });
    });
    describe('f(x) = x', function() {
        it('x=5', async function() {
            const fx = "x";
            const x = 5;
            let json = evaluate_function(fx, {x: x});
            assert.ok(json.success);
            assert.equal(json.result, x);
        })
    });
    describe('f(x) = x^2', function() {
        it('x=2', async function() {
            const fx = "x^2";
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.ok(json.success);
            assert.equal(json.result, x**2);
        });
    });
    describe('f(x) = 1/x', function() {
        const fx = "1/x";
        it('x=0', async function() {
            const x = 0;
            let json = evaluate_function(fx, {x: x});
            assert.ok(!json.success);
            // check we got an error message
            assert.notEqual(json.error, undefined);
            assert.equal(json.error, CalculusErrorMessages.InvalidParameterValueForFunction);
        });
        it('x=2', async function() {
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.ok(json.success);
            assert.equal(json.result, 1/x);
        });
    });
});