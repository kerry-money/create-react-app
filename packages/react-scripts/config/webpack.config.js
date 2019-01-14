'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

process.traceDeprecation = true;

module.exports = function(env = {}) {
  console.log('env', env);
  console.log('build_number', process.env.ReleaseLabel);

  // these are needed to signal Babel during the build that we're in dev vs prod builds
  // these look redundent to the DefinePlugin below but the DefinePlugin also makes the variables visible in the browser
  const environmentName = env.production ? 'production' : 'development';
  process.env.BABEL_ENV = environmentName;
  process.env.NODE_ENV = environmentName;

  return {
    entry: {
      app: [
        'babel-polyfill', // babel must be included before react or IE11 will not work
        'react',
        'react-dom',
        './src/index.js',
      ],
    },
    output: {
      path: path.resolve(`.dist`),
      filename: '[name].js',
      chunkFilename: '[chunkhash].js',
    },
    devtool: env.production ? 'none' : 'cheap-module-eval-source-map',
    cache: true,
    stats: {
      maxModules: 0,
      modules: false,
      assets: false,
    },
    devServer: {
      stats: 'errors-only',
      port: 9004,
      publicPath: `/`,
      contentBase: '/',
      open: true,
      historyApiFallback: true,
      overlay: true,
    },
    resolve: {
      symlinks: false,
      modules: [path.resolve('node_modules')],
      alias: {
        scripts: path.resolve(__dirname, `app/scripts/`),
        '../../theme.config': path.join(
          __dirname,
          'node_modules/eh-blocks/semantic-overrides/theme.config'
        ),
      },
      extensions: ['.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules(?![\\/]react-core)]/,
          use: {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  minimize: env.production,
                },
              },
              {
                loader: 'postcss-loader',
                options: { plugins: () => [require('autoprefixer')] },
              },
              {
                loader: 'resolve-url-loader',
                options: { fail: true },
              },
              {
                loader: 'sass-loader',
                options: { sourceMap: true },
              },
            ],
          }),
        },
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  minimize: env.production,
                },
              },
              {
                loader: 'postcss-loader',
                options: { plugins: () => [require('autoprefixer')] },
              },
              {
                loader: 'resolve-url-loader',
                options: { fail: true },
              },
              {
                loader: 'less-loader',
                options: { sourceMap: true },
              },
            ],
          }),
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: [
            {
              loader: 'file-loader',
              options: { name: 'images/[name].[ext]' },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          loader: [
            {
              loader: 'file-loader',
              options: { name: 'fonts/[name].[ext]' },
            },
          ],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(
            __dirname,
            './node_modules/oidc-client/dist/oidc-client.min.js'
          ),
          to: 'oidc-client.min.js',
        },
      ]),
      new HtmlWebpackPlugin({
        filename: 'renew-authentication-token.html',
        template: path.resolve(
          __dirname,
          './node_modules/eh-mortar/lib/authentication/renewAuthenticationToken.ejs'
        ),
        chunks: [],
        hash: true,
      }),
      /* new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: function(module) {
          return module.resource && /node_modules/.test(module.resource);
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "core",
        minChunks: function(module) {
          return (
            module.resource &&
            /node_modules[\\/]react-core/.test(module.resource)
          );
        }
      }), 
      new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: Infinity
      }), */
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true,
      }),
      new CopyWebpackPlugin([
        {
          from: 'app/images',
          to: 'images',
        },
        {
          from: 'env.js',
          to: 'env.js',
        },
      ]),
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(process.env.ReleaseLabel || ''),
        'process.env.NODE_ENV': JSON.stringify(
          env.production ? 'production' : 'development'
        ),
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './index.template.ejs',
        chunks: ['manifest', 'vendor', 'core', 'app'],
        hash: true,
      }),
      new webpack.NamedModulesPlugin(),
      new ProgressBarPlugin({ clear: true }),
    ].concat(
      env.production
        ? [
            new webpack.optimize.UglifyJsPlugin({
              minimize: true,
              mangle: false,
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
          ]
        : []
    ),
  };
};
