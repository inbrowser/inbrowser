//
// AUTHOR: DataSaiyentist (https://github.com/DataSaiyentist)
// DATE: 09/30/2021
// DESCRIPTION: Test of the main functions from the library "statistics"
//

const assert = require('assert');
const {getSummary} = require('./api');

describe('getSummary', function() {
    describe('Check the returned value, hat_x, S2(x) and sqrt_S2(x)', function() {
        it('given an ArrayList x', function() {
            // should return -1 because the given list is empty
            json1=getSummary([])
            assert.equal(json1.result.avg_emp, -1);
            assert.equal(json1.result.var_emp, -1);
            assert.equal(json1.result.std_emp, -1);
            
            let myList = [1,2,3,4,5,6,7,8,9,10]
            json2=getSummary(myList)
            // should return 10*(10+1)/(10*2)=11/2
            assert.equal(json2.result.avg_emp, 5.5);
            // should return 2*(0.5^2+1.5^2+2.5^2+3.5^2+4.5^2)/9=55/6
            assert.equal(json2.result.var_emp, 55/6);
            // should return 2*(0.5^2+1.5^2+2.5^2+3.5^2+4.5^2)/9=sqrt(55/6)
            assert.equal(json2.result.std_emp, Math.sqrt(55/6));
        });
    });
});