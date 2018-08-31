// const is ok for files that are not to be converted
// plugins has to be declared here
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {

  mode: "development",
  //define entry points
  entry:
  {
    //here introduce different modules as pages with different entry names
    appcore: './src/js/appmainrenderer.js',
    search: './src/js/search.js',
    menu: './src/menu.js',
    notification: './src/notification.js',
    contentWindow: './src/contentWindow.js'

  },

  //define output points
  output:
  {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/assets/"
  },
  watch: true, //Watches for changes within entrypoint & outputs in output point
  module:
  {
    rules:
      [
        {
          test:/\.html$/,
          use:['html-loader']
        },
        {
          test:/\.(jpg|jpeg|png|svg)$/,
          use:
          [
            {
              loader: 'file-loader',
              options:
              {
                name:'[name].[ext]',
                outputPath:'img/',
                publicPath:'img/'
              }
            }
          ]
        }
        
      ],
    loaders:
      [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          exclude: /core\libs/,
          loader: ExtractTextPlugin.extract(
            {
              fallbackLoader: 'style',
              loader: 'css:scss'
            }
          )
        }
      ]
  },
  plugins:
    [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new ExtractTextPlugin('dist/style.css'),
      // Combines all common vendors into one //
      new webpack.optimize.CommonChunkPlugin('vendors.js'),
      new HtmlWebpackPlugin (
        {
          template: 'src/mainWindow.html'
        }
      ),

      // Minify assets.
      // new webpack.optimize.UglifyJsPlugin({

      //   compress: {

      //     warnings: false // https://github.com/webpack/webpack/issues/1496

      //   }

      // })

      //cleaning dist folder before each build

      new CleanWebpackPlugin(['dist'])
  
    ],

  // module:{
  //   loaders:[
  //     // {
  //     //   test:/\.js$/,
  //     //   exclude:/(node_modules)/,
  //     //   loader:'babel-loader',
  //     //   query: {
  //     //     presets: ['es2015']
  //     //   }
  //     // },
  //     {
  //       test:/\.scss$/,
  //       exclude:/(node_modules)/,
  //       loader:'style-loader!css-loader!sass-loader',

  //     }
  //   ]
  // },

  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".css"],
    // extensions that are used
    alias: {
      // a list of module name aliases
      "module": "new-module",
      // alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // alias "only-module" -> "new-module", but not "only-module/path/file" -> "new-module/path/file"
      "module": path.resolve(__dirname, "app/third/module.js"),
      // alias "module" -> "./app/third/module.js" and "module/file" results in error
      // modules aliases are imported relative to the current context
    },
    /* alternative alias syntax (click to show) */
    /* Advanced resolve configuration (click to show) */
  },
};
