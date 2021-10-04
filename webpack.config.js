const path = require('path');

module.exports = {
    mode: "production", //todo: production or development
    entry: {
        matrix: './matrix/api.js',
        statistics: './statistics/api.js',
        calculus: './calculus/api.js',
        algebra: './algebra/api.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'inbrowser_[name]',
        libraryTarget: 'window'
    }
};