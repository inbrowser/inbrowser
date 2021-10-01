import * as mathjs from "mathjs"

/** argument of getSummary, and result **/
export class SummaryData {
    empirical_mean: Array<number> | boolean | string;
    empirical_variance: Array<number>| boolean | string;
    empirical_std_deviation: Array<number> | boolean | string;

    public static createAllWithValue(value: Array<number> | boolean | string) : SummaryData {
        return {
            empirical_mean: value,
            empirical_variance: value,
            empirical_std_deviation: value,
        }
    }
}

/**
 * AUTHORs: QuentinRa (https://github.com/QuentinRa)
 *          DataSaiyentist (https://github.com/DataSaiyentist)
 * DATE: 09/23/2021
 * DESCRIPTION: From a dataset (one column of data)
 * we return its main characteristics as the
 * empirical mean, the unbiased variance, the unbiased
 * standard deviation, first and third quantiles.
 *
 * @param data if null or empty, each result's value would be the string "Dataset is empty."
 * @param options if undefined and data is not empty nor null, all its values would be true
 * so that we display all characteristics
 *
 * @return SummaryData calculated values, or false for each value not calculated, or a string if we got an error
 **/
export function getSummary(data: Array<Array<number>>, options?: SummaryData) : SummaryData {
    if (data == null || data.length == 0) {
        return SummaryData.createAllWithValue("Dataset is empty.");
    }

    if (options === undefined) {
        options = SummaryData.createAllWithValue(true);
    }

    let empirical_mean : Array<number> | boolean = false;
    let empirical_variance : Array<number> | boolean = false;
    let empirical_std_deviation : Array<number> | boolean = false;

    // for functions such as mean/variance/..., they are working
    // like this (ex: mean)
    //
    // [[40,1.66], [35,1.38], [27,2.1]]
    // => (40 + 35 + 27)/3 = 34 (by row, 0)
    // => (1.66 + 1.38 + 2.1)/3 = 1.71 (by row, 0)
    // result: [34, 1.71]

    if (options.empirical_mean) {
        empirical_mean = mathjs.mean(data, 0)
    }
    if (options.empirical_variance) {
        // @ts-ignore
        empirical_variance = mathjs.variance(data, 0, "unbiased")
    }
    if (options.empirical_std_deviation) {
        // @ts-ignore
        empirical_std_deviation = mathjs.std(data, 0, "unbiased")
    }

    return {
        empirical_mean: empirical_mean,
        empirical_variance: empirical_variance,
        empirical_std_deviation: empirical_std_deviation,
    }
}