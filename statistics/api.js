"use strict";
exports.__esModule = true;
exports.getSummary = exports.SummaryData = void 0;
var mathjs = require("mathjs");
var SummaryData = (function () {
    function SummaryData() {
    }
    SummaryData.createAllWithValue = function (value) {
        return {
            empirical_mean: value,
            empirical_variance: value,
            empirical_std_deviation: value
        };
    };
    return SummaryData;
}());
exports.SummaryData = SummaryData;
function getSummary(data, options) {
    if (data == null || data.length == 0) {
        return SummaryData.createAllWithValue("Dataset is empty.");
    }
    if (options === undefined) {
        options = SummaryData.createAllWithValue(true);
    }
    var empirical_mean = false;
    var empirical_variance = false;
    var empirical_std_deviation = false;
    if (options.empirical_mean) {
        empirical_mean = mathjs.mean(data, 0);
    }
    if (options.empirical_variance) {
        empirical_variance = mathjs.variance(data, 0, "unbiased");
    }
    if (options.empirical_std_deviation) {
        empirical_std_deviation = mathjs.std(data, 0, "unbiased");
    }
    return {
        empirical_mean: empirical_mean,
        empirical_variance: empirical_variance,
        empirical_std_deviation: empirical_std_deviation
    };
}
exports.getSummary = getSummary;
//# sourceMappingURL=api.js.map