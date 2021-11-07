"use strict";
exports.__esModule = true;
exports.compute_integral = exports.evaluate_function = exports.CalculusErrorMessages = void 0;
var mathjs = require("mathjs");
var CalculusErrorMessages;
(function (CalculusErrorMessages) {
    CalculusErrorMessages["InvalidParameterForFunction"] = "The given parameter for the function's expression is not valid";
    CalculusErrorMessages["NullParameterForFunction"] = "This function does not have parameters";
})(CalculusErrorMessages = exports.CalculusErrorMessages || (exports.CalculusErrorMessages = {}));
function evaluate_function(fx, variables) {
    if (fx === undefined || fx == null) {
        return {
            result: null,
            error: CalculusErrorMessages.InvalidParameterForFunction
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
var mathjs_1 = require("mathjs");
var math = (0, mathjs_1.create)(mathjs_1.all);
var integral = require("./lib/integral");
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