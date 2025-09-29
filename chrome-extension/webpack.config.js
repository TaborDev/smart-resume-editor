const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  
  entry: {
    // Main extension components
    popup: './src/popup/index.tsx',
    sidebar: './src/sidebar/index.tsx',
    'content-script': './src/content-scripts/content-script.ts',
    'service-worker': './src/background/service-worker.ts'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'icons/[name][ext]'
        }
      }
    ]
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  plugins: [
    // Copy static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: 'manifest.json'
        },
        {
          from: 'src/content-scripts/content-styles.css',
          to: 'content-styles.css'
        },
        {
          from: 'icons',
          to: 'icons',
          noErrorOnMissing: true
        }
      ]
    }),
    
    // Generate HTML files for popup and sidebar
    new HtmlWebpackPlugin({
      template: './src/popup/index.html',
      filename: 'popup/index.html',
      chunks: ['popup'],
      minify: false
    }),
    
    new HtmlWebpackPlugin({
      template: './src/sidebar/index.html',
      filename: 'sidebar/index.html',
      chunks: ['sidebar'],
      minify: false
    })
  ],
  
  optimization: {
    splitChunks: false // Disable code splitting for Chrome extension
  },
  
  // Chrome extension specific settings
  target: 'web',
  
  stats: {
    errorDetails: true
  }
};