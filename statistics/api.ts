/**
 * AUTHOR: DataSaiyentist (https://github.com/DataSaiyentist)
 * DATE: 09/23/2021
 * DESCRIPTION: From a dataset (one column of data)
 * we return its main characteristics as the
 * empirical mean, the unbiased variation or the unbiased
 * standard deviation.
 *
 * todo: comment here, what's happening if data if null, what's happening if option
 *  is undefined? what's option, what's the default values? etc.
 **/
export function getSummary(data: Array<number>, options?: object) {
    let empiricalMean: number = undefined;
    let empiricalVariance: number = undefined;
    let empiricalStdDeviation: number = undefined;
    let empiricalQuantiles: Array<number> = undefined;

    if (options === undefined) { /* todo: use default options */ }

    // let n = dataArray.length;
    //
    // // Empirical mean
    // let sum = 0;
    // for (let i = 0; i<n; i++) {
    //     sum = sum + dataArray[i];
    // }
    // avg = sum/n;
    //
    // // Unbiased Variance and Standard Deviation
    // let sum = 0;
    // for (let i = 0; i<n; i++) {
    //     sum = sum + Math.pow(dataArray[i]-avg, 2);
    // }
    // variance = sum/(n-1);
    // std = Math.sqrt(var_emp);

    return {
        result: {
            empirical_mean: empiricalMean,
            empirical_variance: empiricalVariance,
            empirical_std_variation: empiricalStdDeviation,
            empirical_quantiles: empiricalQuantiles,
        },
    };
}