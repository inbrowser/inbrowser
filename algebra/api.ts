import * as mathjs from "mathjs";
import {Complex} from "mathjs";

export function createComplex(re: number, im: number) {
    return mathjs.complex(re, im);
}

export function getNeg(complexNumber: Complex) : Complex {
    //@ts-ignore
    return complexNumber.neg();
}

export function getConjugate(complexNumber: Complex) : Complex {
    //@ts-ignore
    return complexNumber.conjugate();
}

export function getInverse(complexNumber: Complex) {
    //@ts-ignore
    return complexNumber.inverse();
}

export function addComplex(complexNumber1: Complex, complexNumber2: Complex) {
    return mathjs.add(complexNumber1, complexNumber2)
}

export function multiplyComplex(complexNumber1: Complex, complexNumber2: Complex) {
    return mathjs.multiply(complexNumber1, complexNumber2)
}

export function getPolarCoordinates(complexNumber: Complex) {
    return complexNumber.toPolar();
}