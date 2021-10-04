import * as mathjs from "mathjs";

/**
 * ...
 */
export enum CalculusErrorMessages {
    InvalidParameterValueForFunction = "The given value is not valid for this function",
    InvalidParameterNameForFunction = "This function does not have a parameter of this name",
}

//precise that only functions with a single parameter are supported
/**
 * ...
 */
export function evaluate_function(fx: string, variables : object) {
    let success = true;
    let errorMessage = undefined;

    // ...
    for (let variableName in variables) {
        //@ts-ignore
        let variableValue : number = variables[variableName];

        // ...
        if (fx.indexOf(variableName) == -1) {
            success = false;
            errorMessage = CalculusErrorMessages.InvalidParameterNameForFunction;
            break;
        }

        // ...
        fx = fx.replace(variableName, variableValue+"");
        break;
    }

    return {
        result: mathjs.evaluate(fx), //todo: handle 1/0 etc.
        success: success,
        error: errorMessage
    }
}