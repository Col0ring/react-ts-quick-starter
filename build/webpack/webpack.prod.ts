import webpack, { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

// 提出 css
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// 压缩 css
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// 压缩 js
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CompressionPlugin from 'compression-webpack-plugin'

// 查看 gzip 改变，webpack5 报错，谷歌出品，等结果
// import SizePlugin from 'size-plugin'
// webpack5 报错，先观望，github 还在更新
// import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'

import commonConfig from './webpack.common'
import FriendlyErrorsWebpackPluginGenerator from '../plugins/FriendlyErrorsWebpackPlugin'
import DotenvWebpackPluginGenerator from '../plugins/DotenvWebpackPlugin'
import { bannerDescription } from '../config'

const prodConfig: Configuration = {
  mode: 'production',
  devtool: 'nosources-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          compress: { pure_funcs: ['console.log'] },
        },
      }),
    ],
  },
  externals: {
    // 减小打包体积，可以 cdn 引入
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
  plugins: [
    new CleanWebpackPlugin(),

    // 包注释
    new webpack.BannerPlugin({
      raw: true,
      banner: bannerDescription,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false,
    }),
    // 分析打包，不配置每次 build 都会启动服务器
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
    }),
    // gzip 包
    new CompressionPlugin({
      algorithm: 'gzip',
      filename: 'gzip/[path][base].gz',
    }),
    FriendlyErrorsWebpackPluginGenerator(),
    DotenvWebpackPluginGenerator(),
    // new SizePlugin({ writeFile: false }),
  ].filter(Boolean) as Configuration['plugins'],
}

// const smp = new SpeedMeasurePlugin()
// export default smp.wrap(merge(commonConfig, prodConfig))
export default merge(commonConfig, prodConfig)
