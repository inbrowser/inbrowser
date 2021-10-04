// test related to the evaluation of a function
const assert = require("assert");
const {evaluate_function, CalculusErrorMessages} = require("./api");


describe('evaluate_function', function() {
    //test related to the parameters of the function
    describe('undefined or null parameters', function() {
        it('undefined fx', async function() {
            const fx = undefined;
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, null);
            assert.equal(json.error, CalculusErrorMessages.InvalidParameterForFunction);
        });
        it('undefined fx', async function() {
            const fx = null;
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, null);
            assert.equal(json.error, CalculusErrorMessages.InvalidParameterForFunction);
        });
        it('undefined variables', async function() {
            const fx = "x + y";
            let json = evaluate_function(fx, undefined);
            assert.equal(json.result, null);
            assert.equal(json.error, CalculusErrorMessages.NullParameterForFunction);
        });
        it('null variables', async function() {
            const fx = "x + y";
            let json = evaluate_function(fx, null);
            assert.equal(json.result, null);
            assert.equal(json.error, CalculusErrorMessages.NullParameterForFunction);
        });
    });

    describe('special cases', function() {
        // "x + y", {x = 2}
        it('only one of the variables of fx', async function() {
            const fx = "x + y";
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, null);
            assert.equal(json.error, "Undefined symbol y")
        });
        it('constant function', async function() {
            const fx = "5";
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result,5);
        });
    });
    describe('f(x) = x', function() {
        it('x=5', async function() {
            const fx = "x";
            const x = 5;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, x);
        })
    });
    describe('f(x) = x^2', function() {
        it('x=2', async function() {
            const fx = "x^2";
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, x**2);
        });
    });
    describe('f(x) = 1/x', function() {
        const fx = "1/x";
        it('x=0', async function() {
            const x = 0;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, "Infinity");
        });
        it('x=2', async function() {
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, 1/x);
        });
    });
});