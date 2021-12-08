import * as mathjs from "mathjs";
import * as integral from "./lib/integral";
import {APIResult} from "../index";

/**
 * Error messages
 */
export enum CalculusErrorMessages {
    InvalidFunction = "The given parameter for the function's expression is not valid",
    NullParameterForFunction = "This function does not have parameters",
    InvalidParameterFunction = "The parameter %s is invalid. Expected {variable_name: value}.",
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
    if (fx === undefined || fx == null) {
        return {
            result: null,
            error: CalculusErrorMessages.InvalidFunction
        }
    }

    if (variables === undefined || variables == null) {
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
export function first_simple_derivative(fx: string, variable: string) : APIResult {
    // failure cases
    if (fx == null) {
        return {
            result: null,
            error: CalculusErrorMessages.InvalidFunction
        }
    }
    if (variable == null) {
        return {
            result: null,
            error: CalculusErrorMessages.InvalidParameterFunction.replace("%s", `"${variable}"`)
        }
    }

    try {
        let res = mathjs.derivative(fx,variable)
        return{
            result: res
        }
    } catch(e) {
        return {
            result: null,
            error: e.message
        }
    }
}

const math = mathjs.create(mathjs.all); // creating math for integrals
// @ts-ignore
math.import( [[integral.createIntegral]] );

/**
 * @param fx string : the string expression of the function we want to get the integral
 *                    - if it is undefined, return the corresponding error message
 * @param x string : the string of the variable compared to which we want to integrate
 *                    - if there is an error, return the corresponding error message
 * @return res json : two attributes (result,error) and two different cases
 *                    - if there is an error when trying to integrate, return a null result and the corresponding
 *                    error message
 *                    - else, return the string of the computed integral in result and a null error
*/
export function compute_integral(fx: string, x: string) : APIResult {
    // failure cases
    if (fx == null) return { result: null, error: CalculusErrorMessages.InvalidFunction }
    if (x == null)
        return {
            result: null,
            error: CalculusErrorMessages.InvalidParameterFunction.replace("%s", `"${x}"`)
        }

    try {
        // @ts-ignore
        let res = math.integrate(fx,x);
        return {
            result: res.toString()
        }
    }
    catch (e) {
        return {
            result: null,
            error: e.message
        }
    }
}
