//
// AUTHORs: QuentinRa (https://github.com/QuentinRa)
//          DataSaiyentist (https://github.com/DataSaiyentist)
// DATE: 09/30/2021
// DESCRIPTION: Test of the main functions from the library "statistics"
//
const assert = require('assert');
const {getSummary, SummaryData} = require('./api');

describe('getSummary', function() {
    const list_1_to_10 = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]
    const result_for_1_to_10 = {empirical_mean: [5.5], empirical_variance: [55/6] ,empirical_std_deviation: [Math.sqrt(55/6)]}

    describe('Testing parameter data', function() {
        const dataset_is_empty = SummaryData.createAllWithValue("Dataset is empty.");

        it('for an empty set', function() {
            let json = getSummary([]);
            assert.deepEqual(json, dataset_is_empty)
        });
        it('for an empty set', function() {
            let json = getSummary(null);
            assert.deepEqual(json, dataset_is_empty)
        });
    });

    describe('Testing parameter options', function() {
        it('options are undefined', function() {
            let json = getSummary(list_1_to_10);
            assert.deepEqual(json, result_for_1_to_10);
        });
    });

    describe('Testing results', function() {
        const all_false = SummaryData.createAllWithValue(false);

        it('only mean option is true', function() {
            let json = getSummary(list_1_to_10, Object.assign(all_false, {empirical_mean: true}));
            // should return 10*(10+1)/(10*2)=11/2
            assert.deepEqual(json, Object.assign(all_false, {empirical_mean: [5.5]}))
        });
        it('only variance option is true', function() {
            let json = getSummary(list_1_to_10, Object.assign(all_false, {empirical_variance: true}));
            // should return 2*(0.5^2+1.5^2+2.5^2+3.5^2+4.5^2)/9=55/6
            assert.deepEqual(json, Object.assign(all_false, {empirical_variance: [55/6]}))
        });
        it('only standard deviation option is true', function() {
            let json = getSummary(list_1_to_10, Object.assign(all_false, {empirical_std_deviation: true}));
            // should return 2*(0.5^2+1.5^2+2.5^2+3.5^2+4.5^2)/9=sqrt(55/6)
            assert.deepEqual(json, Object.assign(all_false, {empirical_std_deviation: [Math.sqrt(55/6)]}))
        });
        it('three above options are true', function() {
            let json = getSummary(list_1_to_10, Object.assign(all_false, {empirical_mean:true, empirical_variance:true , empirical_std_deviation: true}));
            assert.deepEqual(json, Object.assign(all_false, result_for_1_to_10))
        });
    });
});