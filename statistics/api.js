//
// AUTHOR: DataSaiyentist (https://github.com/DataSaiyentist)
// DATE: 09/23/2021
// DESCRIPTION: From a dataset (one column of data)
// we return its main characteristics as the
// empirical mean, the unbiased variation or the unbiased
// standard deviation.
//

function getSummary(dataArray) {
    let n = dataArray.length;
    
    // Empirical mean
    let sum = 0;
    for (let i = 0; i<n; i++) {
        sum = sum + dataArray[i];
    }
    avg = sum/n;
    
    // Unbiased Variance and Standard Deviation
    let sum = 0;
    for (let i = 0; i<n; i++) {
        sum = sum + Math.pow(dataArray[i]-avg, 2);
    }
    variance = sum/(n-1);
    std = Math.sqrt(var_emp);

    return {
        result: {
            avg_emp: avg,
            var_emp: variance,
            std_emp: std
        },
        steps : [
            {
                text: "Calculate the empirical mean",
                steps: [{ math: "\\hat{X} = \\frac{1}{n}\\sum_{i=1}^n X_i" }]
            },
            {
                text: "Calculate the unbiased sample variation",
                steps: [{ math: "S^2 = \\frac{1}{n-1}\\sum_{i=1}^n (X_i-\\hat{X})^2" }]
            },
            {
                text: "Calculate the unbiased sample standard deviation",
                steps: [{ math: "S = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^n (X_i-\\hat{X})^2} " }]
            },
        ]
    };

}
exports.getSummary = getSummary;