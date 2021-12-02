"use strict";
exports.__esModule = true;
exports.getPolarCoordinates = exports.multiplyComplex = exports.addComplex = exports.getInverse = exports.getConjugate = exports.getNeg = exports.createComplex = exports.AlgebraErrorMessages = void 0;
var mathjs = require("mathjs");
var AlgebraErrorMessages;
(function (AlgebraErrorMessages) {
    AlgebraErrorMessages["InvalidParameterFunction"] = "The parameter \"%s\" is invalid.";
    AlgebraErrorMessages["InvalidNthParameterFunction"] = "The %s parameter \"%s\" is invalid.";
})(AlgebraErrorMessages = exports.AlgebraErrorMessages || (exports.AlgebraErrorMessages = {}));
function checkParameter(complexNumber) {
    if (complexNumber == null)
        return {
            result: null,
            error: AlgebraErrorMessages.InvalidParameterFunction.replace("%s", complexNumber + "")
        };
    return null;
}
function check2Parameters(complexNumber1, complexNumber2) {
    if (complexNumber1 == null)
        return {
            result: null,
            error: AlgebraErrorMessages.InvalidNthParameterFunction
                .replace("%s", "1st")
                .replace("%s", complexNumber1 + "")
        };
    if (complexNumber2 == null)
        return {
            result: null,
            error: AlgebraErrorMessages.InvalidNthParameterFunction
                .replace("%s", "2nd")
                .replace("%s", complexNumber2 + "")
        };
    return null;
}
function createComplex(re, im) {
    return mathjs.complex(re, im);
}
exports.createComplex = createComplex;
function getNeg(complexNumber) {
    var check = checkParameter(complexNumber);
    if (check != null)
        return check;
    return { result: complexNumber.neg() };
}
exports.getNeg = getNeg;
function getConjugate(complexNumber) {
    var check = checkParameter(complexNumber);
    if (check != null)
        return check;
    return { result: complexNumber.conjugate() };
}
exports.getConjugate = getConjugate;
function getInverse(complexNumber) {
    var check = checkParameter(complexNumber);
    if (check != null)
        return check;
    return { result: complexNumber.inverse() };
}
exports.getInverse = getInverse;
function addComplex(complexNumber1, complexNumber2) {
    var check = check2Parameters(complexNumber1, complexNumber2);
    if (check != null)
        return check;
    return { result: mathjs.add(complexNumber1, complexNumber2) };
}
exports.addComplex = addComplex;
function multiplyComplex(complexNumber1, complexNumber2) {
    var check = check2Parameters(complexNumber1, complexNumber2);
    if (check != null)
        return check;
    return { result: mathjs.multiply(complexNumber1, complexNumber2) };
}
exports.multiplyComplex = multiplyComplex;
function getPolarCoordinates(complexNumber) {
    var check = checkParameter(complexNumber);
    if (check != null)
        return check;
    return { result: complexNumber.toPolar() };
}
exports.getPolarCoordinates = getPolarCoordinates;
//# sourceMappingURL=api.js.map