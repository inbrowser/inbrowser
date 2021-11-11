// test related to the evaluation of a function
const assert = require("assert");
const {evaluate_function, CalculusErrorMessages, compute_integral} = require("./api");


describe('evaluate_function', function() {
    //test related to the parameters of the function
    describe('undefined or null parameters', function() {
        it('undefined fx', function() {
            const fx = undefined;
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, null);
            assert.equal(json.error, CalculusErrorMessages.InvalidParameterForFunction);
        });
        it('undefined fx', function() {
            const fx = null;
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, null);
            assert.equal(json.error, CalculusErrorMessages.InvalidParameterForFunction);
        });
        it('undefined variables', function() {
            const fx = "x + y";
            let json = evaluate_function(fx, undefined);
            assert.equal(json.result, null);
            assert.equal(json.error, CalculusErrorMessages.NullParameterForFunction);
        });
        it('null variables', function() {
            const fx = "x + y";
            let json = evaluate_function(fx, null);
            assert.equal(json.result, null);
            assert.equal(json.error, CalculusErrorMessages.NullParameterForFunction);
        });
    });

    describe('special cases', function() {
        // "x + y", {x = 2}
        it('only one of the variables of fx', function() {
            const fx = "x + y";
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, null);
            assert.equal(json.error, "Undefined symbol y")
        });
        it('constant function', function() {
            const fx = "5";
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result,5);
        });
    });
    describe('f(x) = x', function() {
        it('x=5', function() {
            const fx = "x";
            const x = 5;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, x);
        })
    });
    describe('f(x) = x^2', function() {
        it('x=2', function() {
            const fx = "x^2";
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, x**2);
        });
    });
    describe('f(x) = 1/x', function() {
        const fx = "1/x";
        it('x=0', function() {
            const x = 0;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, "Infinity");
        });
        it('x=2', function() {
            const x = 2;
            let json = evaluate_function(fx, {x: x});
            assert.equal(json.result, 1/x);
        });
    });
});




/**
 * tests for the simple integral function
 */
describe('integral tests', function() {
   it('basic OK test', function() {
       const fx = '10y+4x^2';
       const x = 'x';
       let res = compute_integral(fx,x);
       assert.equal(res.result,"10 * y * x + x ^ 3 * 4 / 3");
       assert.equal(res.error, null);
   });
   it('test with missing variable', function() {
       const fx = '10y+4x^2';
       let res = compute_integral(fx);
       assert.equal(res.result,null);
       assert.equal(res.error.substring(0,48), "Unexpected type of argument in function integral");
   });
   it('test with a variable missing in the function', function() {
      const fx =  '10y+4x^2';
      const z = 'z';
      let res = compute_integral(fx,z);
      assert.equal(res.result,"(10 y + 4 x ^ 2) * z");
      assert.equal(res.error, null);
   });
   it('test with null function', function() {
       const fx = null;
       const x = 'x';
       let res = compute_integral(fx,x);
       assert.equal(res.result, null);
       assert.equal(res.error.substring(0,48), "Unexpected type of argument in function integral");
   });
});