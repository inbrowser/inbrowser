"use strict";
exports.__esModule = true;
exports.getPolarCoordinates = void 0;
const Mathjs = require("mathjs");

function createComplex(re, im) {
    return Mathjs.complex(re, im);
}

function getNeg(complexNumber) {
    return complexNumber.neg();
}

function getConjugate(complexNumber) {
    return complexNumber.conjugate();
}

function getInverse(complexNumber) {
    return complexNumber.inverse();
}

function addComplex(complexNumber1, complexNumber2) {
    return Mathjs.add(complexNumber1, complexNumber2)
}

function multiplyComplex(complexNumber1, complexNumber2) {
    return Mathjs.multiply(complexNumber1, complexNumber2)
}

function getPolarCoordinates(complexNumber) {
    let polar = complexNumber.toPolar();

    return polar;
}

exports.createComplex = createComplex;
exports.getNeg = getNeg;
exports.getConjugate = getConjugate;
exports.getInverse = getInverse;
exports.addComplex = addComplex;
exports.multiplyComplex = multiplyComplex;
exports.getPolarCoordinates = getPolarCoordinates;
//# sourceMappingURL=Matrix.js.map