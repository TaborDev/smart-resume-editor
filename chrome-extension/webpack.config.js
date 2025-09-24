const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'content-script': './content-scripts/content-script.ts',
    'service-worker': './background/service-worker.ts',
    'sidebar': './sidebar/index.tsx',
    'popup': './popup/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false,
              outDir: './dist'
            }
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@smart-resume/types': path.resolve(__dirname, '../packages/types/src'),
      '@smart-resume/utils': path.resolve(__dirname, '../packages/utils/src'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]/styles.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: 'manifest.json',
        },
        {
          from: 'content-scripts/content-styles.css',
          to: 'content-styles.css',
        },
        {
          from: 'sidebar/styles.css',
          to: 'sidebar/styles.css',
        },
        {
          from: 'icons',
          to: 'icons',
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './sidebar/index.html',
      filename: 'sidebar/index.html',
      chunks: ['sidebar'],
      inject: false,
      scriptLoading: 'defer',
      publicPath: '',
    }),
    new HtmlWebpackPlugin({
      template: './popup/index.html',
      filename: 'popup/index.html',
      chunks: ['popup'],
      inject: false,
      scriptLoading: 'defer',
      publicPath: '../',
    }),
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',
};