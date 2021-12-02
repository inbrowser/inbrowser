const { createComplex, getNeg, getConjugate, getInverse, addComplex, multiplyComplex, getPolarCoordinates } = require("./api");
const assert = require('assert');

describe('Testing parameters for functions', function() {
    let complexNumber = createComplex(1, 2);

    [null, undefined].forEach(function(complex) {
        [getNeg, getConjugate, getInverse, getPolarCoordinates].forEach(function (f) {
            it('testing ' + f.name + ' with ' + complex + ' parameter.', async function () {
                let res = f(complex);
                assert.equal(res.result, null)
                assert.equal(res.error, "The parameter \""+complex+"\" is invalid.")
            });
        });

        [addComplex, multiplyComplex].forEach(function (f) {
            it('testing ' + f.name + ' with ' + complex + ' parameter.', async function () {
                let res = f(complex, complexNumber);
                assert.equal(res.result, null)
                assert.equal(res.error, "The 1st parameter \""+complex+"\" is invalid.")
            });
            it('testing ' + f.name + ' with ' + complex + ' parameter.', async function () {
                let res = f(complexNumber, complex);
                assert.equal(res.result, null)
                assert.equal(res.error, "The 2nd parameter \""+complex+"\" is invalid.")
            });
        });
    });
});

describe('operations on complex numbers', function() {
    let complexNumber = createComplex(1, 2);
    let complexNumber2 = createComplex(3, 4);

    it('should get negative of complex number', function () {
        let json = getNeg(complexNumber);
        assert.notEqual(json.result, null);

        let negComplexNumber = json.result;
        let expected = { re: -1, im: -2 };

        assert.equal(negComplexNumber.re, expected.re);
        assert.equal(negComplexNumber.im, expected.im);
    });

    it('should get conjugate of complex number', function () {
        let json = getConjugate(complexNumber);
        assert.notEqual(json.result, null);

        let conjugateComplexNumber = json.result;
        let expected = { re: 1, im: -2 };

        assert.equal(conjugateComplexNumber.re, expected.re);
        assert.equal(conjugateComplexNumber.im, expected.im);
    });

    it('should get inverse of complex number', function () {
        let json = getInverse(complexNumber);
        assert.notEqual(json.result, null);

        let inverseComplexNumber = json.result;
        let expected = { re: 0.2, im: -0.4 };
        assert.equal(inverseComplexNumber.re, expected.re);
        assert.equal(inverseComplexNumber.im, expected.im);
    });

    it('should add complex number', function () {
        let json = addComplex(complexNumber, complexNumber2);
        assert.notEqual(json.result, null);

        let result = json.result;
        let expected = { re: 4, im: 6 };
        assert.equal(result.re, expected.re);
        assert.equal(result.im, expected.im);
    });

    it('should multiply complex number', function () {
        let json = multiplyComplex(complexNumber, complexNumber2);
        assert.notEqual(json.result, null);

        let result = json.result;
        let expected = { re: -5, im: 10 };

        assert.equal(result.re, expected.re);
        assert.equal(result.im, expected.im);
    });
});

describe('get polar coordinates from complex number', function() {
    it('should get polar coordinates from complex number', function () {
        let complexNumber = createComplex(1, 2);
        let json = getPolarCoordinates(complexNumber);
        assert.notEqual(json.result, null);

        let polarCoordinates = json.result;
        let expected = { r: 2.23606797749979, phi: 1.1071487177940904 };

        assert.equal(polarCoordinates.r, expected.r);
        assert.equal(polarCoordinates.phi, expected.phi);
    });
});