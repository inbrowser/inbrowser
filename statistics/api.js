"use strict";
exports.__esModule = true;
exports.getSummary = void 0;
function getSummary(data, options) {
    var empiricalMean = undefined;
    var empiricalVariance = undefined;
    var empiricalStdDeviation = undefined;
    var empiricalQuantiles = undefined;
    if (options === undefined) { }
    return {
        result: {
            empirical_mean: empiricalMean,
            empirical_variance: empiricalVariance,
            empirical_std_variation: empiricalStdDeviation,
            empirical_quantiles: empiricalQuantiles
        }
    };
}
exports.getSummary = getSummary;
//# sourceMappingURL=api.js.map