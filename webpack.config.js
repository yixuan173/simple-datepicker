const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/, 
            exclude: /node_modules/, 
            use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                        ["@babel/preset-env"],
                        ["@babel/preset-react",  { "runtime": "automatic" }]
                    ],
                }
            }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
    ],
  },
};