import * as mathjs from "mathjs";
import {Complex} from "mathjs";


function createComplex(re: number, im: number) {
    return mathjs.complex(re, im);
}

function getNeg(complexNumber: Complex) : Complex {
    //@ts-ignore
    return complexNumber.neg();
}

function getConjugate(complexNumber: Complex) : Complex {
    //@ts-ignore
    return complexNumber.conjugate();
}

function getInverse(complexNumber: Complex) {
    //@ts-ignore
    return complexNumber.inverse();
}

function addComplex(complexNumber1: Complex, complexNumber2: Complex) {
    return mathjs.add(complexNumber1, complexNumber2)
}

function multiplyComplex(complexNumber1: Complex, complexNumber2: Complex) {
    return mathjs.multiply(complexNumber1, complexNumber2)
}

function getPolarCoordinates(complexNumber: Complex) {
    let polar = complexNumber.toPolar();

    return polar;
}