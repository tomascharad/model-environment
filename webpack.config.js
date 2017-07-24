var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: path.resolve('./src/index'),
  output: {
    path: path.resolve('./'),
    filename: 'index.js',
    library: 'model-environment',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel',
      exclude: /node_modules/
    }]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  }
};
