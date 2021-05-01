const path = require('path');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: {
    preHookFunction: path.resolve(__dirname, './src/index.ts'),
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
};
