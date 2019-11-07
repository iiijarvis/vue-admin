'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const fs = require('fs')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const chalk = require('chalk')
const PAGE_PATH = path.resolve(__dirname, '../src/module')
const PAGES_NAME = getPagesName()

function getPagesName () {
  let arr = [];
  arr = fs.readdirSync(PAGE_PATH)
  for (let i = 0; i < arr.length; i++) {
    let stats = fs.statSync(path.join(PAGE_PATH, arr[i]))
    if (!stats.isDirectory()) {
      arr.splice(i, 1)
    }
  }

  for (let i = 0; i < arr.length; i++) {
    try {
      fs.accessSync(path.join(PAGE_PATH, arr[i], arr[i] + '.html'))
      fs.accessSync(path.join(PAGE_PATH, arr[i], arr[i] + '.js'))
    } catch (error) {
      arr.splice(i, 1)
    }
  }

  return arr;
}

// 多入口配置
exports.entries = function () {
  let map = {}
  PAGES_NAME.forEach(function (pageName) {
    map[pageName] = path.join(PAGE_PATH, pageName, pageName + '.js')
  })
  console.log(chalk.yellow("\n entry \n"))
  console.log(map)
  return map
}

// 多页面输出配置
exports.htmlPlugin = function () {
  let arr = []
  PAGES_NAME.forEach(function (pageName) {
    let conf = {
      filename: pageName + '.html',
      template: path.join(PAGE_PATH, pageName, pageName + '.html'),
      chunks: [pageName],
      inject: true
    }
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        chunks: ['manifest', 'vendor', pageName],
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    }

    arr.push(new HtmlWebpackPlugin(conf))
  })

  console.log(chalk.yellow("\n entryHtml \n"))
  console.log(arr)
  return arr
}

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
