import * as mathjs from "mathjs";
import {Complex} from "mathjs";
import {APIResult} from "../index";

/**
 * Error messages
 */
export enum AlgebraErrorMessages {
    InvalidParameterFunction = "The parameter \"%s\" is invalid.",
    InvalidNthParameterFunction = "The %s parameter \"%s\" is invalid.",
}

function checkParameter(complexNumber: Complex) : APIResult {
    if (complexNumber == null)
        return {
            result: null,
            error: AlgebraErrorMessages.InvalidParameterFunction.replace("%s", complexNumber+"")
        }
    return null;
}

function check2Parameters(complexNumber1: Complex, complexNumber2: Complex) : APIResult {
    if (complexNumber1 == null)
        return {
            result: null,
            error: AlgebraErrorMessages.InvalidNthParameterFunction
                .replace("%s", "1st")
                .replace("%s", complexNumber1+"")
        }
    if (complexNumber2 == null)
        return {
            result: null,
            error: AlgebraErrorMessages.InvalidNthParameterFunction
                .replace("%s", "2nd")
                .replace("%s", complexNumber2+"")
        }
    return null;
}


export function createComplex(re: number, im: number) {
    return mathjs.complex(re, im);
}

export function getNeg(complexNumber: Complex) : APIResult {
    let check = checkParameter(complexNumber);
    if (check != null) return check;

    //@ts-ignore
    return { result: complexNumber.neg() };
}

export function getConjugate(complexNumber: Complex) : APIResult {
    let check = checkParameter(complexNumber);
    if (check != null) return check;

    //@ts-ignore
    return { result: complexNumber.conjugate() };
}

export function getInverse(complexNumber: Complex) : APIResult {
    let check = checkParameter(complexNumber);
    if (check != null) return check;

    //@ts-ignore
    return { result: complexNumber.inverse() };
}

export function addComplex(complexNumber1: Complex, complexNumber2: Complex) : APIResult {
    let check = check2Parameters(complexNumber1, complexNumber2);
    if (check != null) return check;

    //@ts-ignore
    return { result: mathjs.add(complexNumber1, complexNumber2) };
}

export function multiplyComplex(complexNumber1: Complex, complexNumber2: Complex) : APIResult {
    let check = check2Parameters(complexNumber1, complexNumber2);
    if (check != null) return check;

    //@ts-ignore
    return { result: mathjs.multiply(complexNumber1, complexNumber2) };
}

export function getPolarCoordinates(complexNumber: Complex) : APIResult {
    let check = checkParameter(complexNumber);
    if (check != null) return check;

    //@ts-ignore
    return { result: complexNumber.toPolar() };
}