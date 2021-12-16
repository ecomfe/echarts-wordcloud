module.exports = (env, options) => {
  return {
    entry: {
      'echarts-wordcloud': __dirname + '/index.js'
    },
    output: {
      libraryTarget: 'umd',
      library: ['echarts-wordcloud'],
      path: __dirname + '/dist',
      filename: options.mode === 'production' ? '[name].min.js' : '[name].js'
    },
    optimization: {
      concatenateModules: true
    },
    devtool: 'source-map',
    externals: {
      'echarts/lib/echarts': 'echarts'
    }
  };
};
