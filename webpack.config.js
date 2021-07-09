const path = require('path');
const copyPlugin = require('copy-webpack-plugin');

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
  plugins: [
    new copyPlugin({
      patterns: [
        { from: 'Dockerfile', to: path.resolve(__dirname, 'bundle/dist') },
      ],
    }),
  ],
};
