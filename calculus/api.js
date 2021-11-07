"use strict";
exports.__esModule = true;
exports.first_simple_derivative = exports.evaluate_function = exports.CalculusErrorMessages = void 0;
var mathjs = require("mathjs");
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
    if (fx === undefined || fx == null) {
        return {
            result: null,
            error: CalculusErrorMessages.InvalidFunction
        };
    }
    if (variable === undefined || variable == null) {
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
//# sourceMappingURL=api.js.map