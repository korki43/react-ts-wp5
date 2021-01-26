const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const svgToMiniDataURI = require('mini-svg-data-uri');
const path = require('path');
const dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');

module.exports = (_env, argv) => {
  const envVars = dotenvExpand(dotenv.config()).parsed;
  const isDev = argv.mode == 'development' ? true : false;
  envVars.IS_DEV = isDev;
  for (key in envVars) {
    const val = envVars[key];
    if (typeof val != 'string') continue;
    if (val == 'true') {
      envVars[key] = true;
    } else if (val == 'false') {
      envVars[key] = false;
    } else if (!isNaN(Number(val))) {
      envVars[key] = Number(val);
    } else {
      envVars[key] = `"${envVars[key]}"`;
    }
  }
  return {
    entry: './src/index.tsx',
    devtool: isDev ? 'inline-source-map' : false,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    devServer: {
      inline: true,
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: path.join(__dirname, 'src'),
          use: [
            isDev && {
              loader: 'babel-loader',
              options: { plugins: ['react-refresh/babel'] },
            },
            {
              loader: 'ts-loader',
              options: { transpileOnly: true },
            },
          ].filter(Boolean),
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                generator: (content) => svgToMiniDataURI(content.toString()),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new DefinePlugin({
        'process.env': envVars,
      }),
      isDev && new HotModuleReplacementPlugin(),
      isDev && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
  };
};
