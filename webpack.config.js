module.exports = {
  context: __dirname + '/',
  entry: './src/index',
  output: {
    path: __dirname + '/',
    filename: 'index.js',
    library: 'model-environment',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel',
      exclude: /node_modules/,
    }],
  },
};
