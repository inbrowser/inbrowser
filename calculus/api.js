"use strict";
exports.__esModule = true;
exports.evaluate_function = exports.CalculusErrorMessages = void 0;
var mathjs = require("mathjs");
var CalculusErrorMessages;
(function (CalculusErrorMessages) {
    CalculusErrorMessages["InvalidParameterValueForFunction"] = "The given value is not valid for this function";
    CalculusErrorMessages["InvalidParameterNameForFunction"] = "This function does not have a parameter of this name";
})(CalculusErrorMessages = exports.CalculusErrorMessages || (exports.CalculusErrorMessages = {}));
function evaluate_function(fx, variables) {
    var success = true;
    var errorMessage = undefined;
    for (var variableName in variables) {
        var variableValue = variables[variableName];
        if (fx.indexOf(variableName) == -1) {
            success = false;
            errorMessage = CalculusErrorMessages.InvalidParameterNameForFunction;
            break;
        }
        fx = fx.replace(variableName, variableValue + "");
        break;
    }
    return {
        result: mathjs.evaluate(fx),
        success: success,
        error: errorMessage
    };
}
exports.evaluate_function = evaluate_function;
//# sourceMappingURL=api.js.map