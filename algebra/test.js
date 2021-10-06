const { createComplex, getNeg, getConjugate, getInverse, addComplex, multiplyComplex, getPolarCoordinates } = require("./api");
const assert = require("assert");

describe('operations on complex numbers', function() {
    let complexNumber = createComplex(1, 2);
    let complexNumber2 = createComplex(3, 4);

    it('should get negative of complex number', function () {
        let negComplexNumber = getNeg(complexNumber);
        let expected = { re: -1, im: -2 };

        assert.equal(negComplexNumber.re, expected.re);
        assert.equal(negComplexNumber.im, expected.im);
    });

    it('should get conjugate of complex number', function () {
        let conjugateComplexNumber = getConjugate(complexNumber);
        let expected = { re: 1, im: -2 };

        assert.equal(conjugateComplexNumber.re, expected.re);
        assert.equal(conjugateComplexNumber.im, expected.im);
    });

    it('should get inverse of complex number', function () {
        let inverseComplexNumber = getInverse(complexNumber);
        let expected = { re: 0.2, im: -0.4 };

        assert.equal(inverseComplexNumber.re, expected.re);
        assert.equal(inverseComplexNumber.im, expected.im);
    });

    it('should add complex number', function () {
        let result = addComplex(complexNumber, complexNumber2);
        let expected = { re: 4, im: 6 };

        assert.equal(result.re, expected.re);
        assert.equal(result.im, expected.im);
    });

    it('should multiply complex number', function () {
        let result = multiplyComplex(complexNumber, complexNumber2);
        let expected = { re: -5, im: 10 };

        assert.equal(result.re, expected.re);
        assert.equal(result.im, expected.im);
    });
});

describe('get polar coordinates from complex number', function() {
    it('should get polar coordinates from complex number', function () {
        let complexNumber = createComplex(1, 2);
        let polarCoordinates = getPolarCoordinates(complexNumber);
        let expected = { r: 2.23606797749979, phi: 1.1071487177940904 };

        assert.equal(polarCoordinates.r, expected.r);
        assert.equal(polarCoordinates.phi, expected.phi);
    });
});