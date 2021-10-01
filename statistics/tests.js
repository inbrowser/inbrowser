//
// AUTHOR: DataSaiyentist (https://github.com/DataSaiyentist)
// DATE: 09/30/2021
// DESCRIPTION: Test of the main functions from the library "statistics"
//
const assert = require('assert');
const {getSummary} = require('./api');

describe('getSummary', function() {
    let list_1_to_10 = [1,2,3,4,5,6,7,8,9,10]

    describe('Testing default options', function() {
        it('for an empty set', function() {
            let json = getSummary([])
            // todo: assert things after deciding what should be returned
            //  when we are using the default config, and an empty set
            //  old code (do not return -1, I think the mean can be -1...)
            //  should return -1 because the given list is empty
        });
    });
    describe('Testing mean', function() {
        it('with list_1_to_10', function() {
            let json = getSummary(list_1_to_10, { empirical_mean: true })
            // should return 10*(10+1)/(10*2)=11/2
            assert.equal(json.result.empirical_mean, 5.5);
        });
    });
    describe('Testing variance', function() {
        it('with list_1_to_10', function() {
            let json = getSummary(list_1_to_10, { empirical_variance: true })
            // should return 2*(0.5^2+1.5^2+2.5^2+3.5^2+4.5^2)/9=55/6
            assert.equal(json.result.empirical_variance, 55/6);
        });
    });
    describe('Testing std variation', function() {
        it('with list_1_to_10', function() {
            let json = getSummary(list_1_to_10, { empirical_std_variation: true })
            // should return 2*(0.5^2+1.5^2+2.5^2+3.5^2+4.5^2)/9=sqrt(55/6)
            assert.equal(json.result.empirical_std_variation, Math.sqrt(55/6));
        });
    });
});