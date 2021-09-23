//
// AUTHOR: DataSaiyentist (https://github.com/DataSaiyentist)
// DATE: 09/23/2021
// DESCRIPTION: This files receive a CSV file of dataset (one
// column of data) and will display its main characteristics as the
// empirical mean, the empirical variation or the empirical
// standard deviation.
//

let fileUploaded = false;

// This method verify if the browser can support FileReader
function handleFiles(files) {
    if (window.FileReader) {
        // Take the first file uploaded (Only one file can be uploaded)
        getAsBuffer(files[0]);
        fileUploaded = true;
    } else {
        alert('FileReader not supported in browser.');
    }
}

// This method read each elements (array) of the dataset
function getAsBuffer(fileToRead) {
    let reader = new FileReader();
    // This block set what's going to be triggered each time the reading operation encounters an error
    reader.onerror = function(event) {
        alert("Fail to read the file!\n" + reader.error);
    }
    // This block set what's going to be triggered each time the reading operation successes
    reader.onload = function(event) {
        let csv = event.target.result;
        processData(csv);
    }
    reader.readAsArrayBuffer(fileToRead);
}

// This method calculate the data characteristics
function processData(csv) {
    getEmpiricalMean(csv);
    getEmpiricalVariation(csv);
    getStandardDeviation(csv);
}

// This method returns the empirical mean of a data set
function getEmpiricalMean(dataArray) {
    let n = dataArray.length;
    let sum = 0;
    for (let i = 0; i<n; i++) {
        sum = sum + dataArray[i];
    }
    return sum/n;
}

// This method returns the empirical variation of a data set
function getEmpiricalVariation(dataArray) {
    let n = dataArray.length;
    let avg = getEmpiricalMean(dataArray)
    let sum = 0;
    for (let i = 0; i<n; i++) {
        sum = sum + Math.pow(dataArray[i]-avg, 2);
    }
    return sum/(n-1);
}

// This method returns the standard deviation of a data set
function getStandardDeviation(dataArray) {
    let n = dataArray.length;
    let avg = getEmpiricalMean(dataArray)
    let sum = 0;
    for (let i = 0; i<n; i++) {
        sum = sum + Math.pow(dataArray[i]-avg, 2);
    }
    return Math.sqrt(sum/(n-1));
}