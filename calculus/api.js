"use strict";
exports.__esModule = true;
exports.compute_integral = exports.first_simple_derivative = exports.evaluate_function = exports.CalculusErrorMessages = void 0;
var mathjs = require("mathjs");
var integral = require("./lib/integral");
var CalculusErrorMessages;
(function (CalculusErrorMessages) {
    CalculusErrorMessages["InvalidFunction"] = "The given parameter for the function's expression is not valid";
    CalculusErrorMessages["NullParameterForFunction"] = "This function does not have parameters";
})(CalculusErrorMessages = exports.CalculusErrorMessages || (exports.CalculusErrorMessages = {}));
function evaluate_function(fx, variables) {
    if (fx === undefined || fx == null) {
        return {
            result: null,
            error: CalculusErrorMessages.InvalidFunction
        };
    }
    if (variables === undefined || variables == null) {
        return {
            result: null,
            error: CalculusErrorMessages.NullParameterForFunction
        };
    }
    try {
        var x = mathjs.evaluate(fx, variables);
        return {
            result: x
        };
    }
    catch (e) {
        return {
            result: null,
            error: e.message
        };
    }
}
exports.evaluate_function = evaluate_function;
function first_simple_derivative(fx, variable) {
    if (fx == null) {
        return {
            result: null,
            error: CalculusErrorMessages.InvalidFunction
        };
    }
    if (variable == null) {
        return {
            result: fx,
            error: CalculusErrorMessages.NullParameterForFunction
        };
    }
    try {
        var res = mathjs.derivative(fx, variable);
        return {
            result: res
        };
    }
    catch (e) {
        return {
            result: null,
            error: e.message
        };
    }
}
exports.first_simple_derivative = first_simple_derivative;
var math = mathjs.create(mathjs.all);
math["import"]([[integral.createIntegral]]);
function compute_integral(fx, x) {
    try {
        var res = math.integrate(fx, x);
        return {
            result: res.toString()
        };
    }
    catch (e) {
        return {
            error: e.message
        };
    }
}
exports.compute_integral = compute_integral;
//# sourceMappingURL=api.js.map