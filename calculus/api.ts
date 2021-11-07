import * as mathjs from "mathjs";
import {APIResult} from "../index";

/**
 * Error messages
 */
export enum CalculusErrorMessages {
    InvalidFunction = "The given parameter for the function's expression is not valid",
    NullParameterForFunction = "This function does not have parameters",
}

//precise that only functions with a single parameter are supported
/**
 * @param fx string expression of the function (example : x^2).
 *           If null, empty, or undefined, return InvalidParameterForFunction in error
 * @param variables object expression listing the values for the parameters of the function (example : {x: 1, y: 9})
 *                  If null/undefined, return NullParameterForFunction
 *                  If a variable is missing, return MissingParameterForFunction in error (ex: Undefined symbol x)
 * @return json if there is no error, return {result: your_result_here}
 *         else return null for result and the errorMessage
 *         ======> check behavior if 1/0
 */
export function evaluate_function(fx: string, variables : object) : APIResult {
    if (fx === undefined || fx == null)
    {
        return {
            result: null,
            error: CalculusErrorMessages.InvalidFunction
        }
    }

    if (variables === undefined || variables == null)
    {
        return {
            result: null,
            error: CalculusErrorMessages.NullParameterForFunction
        }
    }

    try {
        let x = mathjs.evaluate(fx, variables)
        return {
            result: x
        }
    } catch (e) {
        return {
            result: null,
            error: e.message
        }
    }
}


/**
 * @param fx string expression of the function (example: x^2).
 *          If null, empty or undefined, return InvalidParameterForFunction in error
 * @param variable string corresponding to the variable according to which we want to compute the derivative
 *          If null, empty or undefined, return InvalidVariableForFunction in error and the string expression of the
 *          function in result
 * @return json if there is no error, return the string corresponding to thr expression of the derivative in result
 */
export function first_simple_derivative(fx: string, variable: string) : object {
    if (fx === undefined || fx == null){
        return{
            result: null,
            error: CalculusErrorMessages.InvalidFunction
        }
    }

    if (variable === undefined || variable == null){
        return{
            result: fx,
            error: CalculusErrorMessages.NullParameterForFunction
        }
    }

    try{
        let res = mathjs.derivative(fx,variable)
        return{
            result: res
        }
    }
    catch(e) {
        return {
            result: null,
            error: e.message
        }
    }
}