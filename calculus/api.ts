import * as mathjs from "mathjs";
import {APIResult} from "../index";

/**
 * Error messages
 */
export enum CalculusErrorMessages {
    InvalidParameterForFunction = "The given parameter for the function's expression is not valid",
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
            error: CalculusErrorMessages.InvalidParameterForFunction
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


// configuring the import of the integral library
// @ts-ignore
import {create,all} from "mathjs";
const math = create(all);

import * as integral from "./lib/integral";

// @ts-ignore
math.import( [[integral.createIntegral]] ); //simulates importing the npm package, which nests it [[]]

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
export function compute_integral(fx: string, x: string) {
    try {
        // @ts-ignore
        let res = math.integrate(fx,x);
        return {
            result: res.toString()
        }
    }
    catch (e) {
        return {
            error: e.message
        }
    }
}
