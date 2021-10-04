"use strict";
exports.__esModule = true;
exports.evaluate_function = exports.CalculusErrorMessages = void 0;
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
//# sourceMappingURL=api.js.map