"use strict";
exports.__esModule = true;
exports.getPolarCoordinates = exports.multiplyComplex = exports.addComplex = exports.getInverse = exports.getConjugate = exports.getNeg = exports.createComplex = void 0;
var mathjs = require("mathjs");
function createComplex(re, im) {
    return mathjs.complex(re, im);
}
exports.createComplex = createComplex;
function getNeg(complexNumber) {
    return complexNumber.neg();
}
exports.getNeg = getNeg;
function getConjugate(complexNumber) {
    return complexNumber.conjugate();
}
exports.getConjugate = getConjugate;
function getInverse(complexNumber) {
    return complexNumber.inverse();
}
exports.getInverse = getInverse;
function addComplex(complexNumber1, complexNumber2) {
    return mathjs.add(complexNumber1, complexNumber2);
}
exports.addComplex = addComplex;
function multiplyComplex(complexNumber1, complexNumber2) {
    return mathjs.multiply(complexNumber1, complexNumber2);
}
exports.multiplyComplex = multiplyComplex;
function getPolarCoordinates(complexNumber) {
    return complexNumber.toPolar();
}
exports.getPolarCoordinates = getPolarCoordinates;
//# sourceMappingURL=api.js.map