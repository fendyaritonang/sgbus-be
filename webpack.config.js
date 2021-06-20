const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'bundle/dist'),
    filename: 'api.bundle.js',
  },
  target: 'node',
  node: {
    __dirname: false,
  },
};
