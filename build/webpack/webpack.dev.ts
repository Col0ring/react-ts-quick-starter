import qs from 'querystring'
import webpack, { Configuration } from 'webpack'
import webpackHotMiddleware from 'webpack-hot-middleware'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { merge } from 'webpack-merge'
import commonConfig from './webpack.common'
import DotenvWebpackPluginGenerator from '../plugins/DotenvWebpackPlugin'

const hotMiddlewareOptions: webpackHotMiddleware.ClientOptions = {
  // 编译出错会在网页中显示出错信息遮罩
  overlay: true,
  // 超时时间
  timeout: 2000,
  path: '/__webpack_hmr',
  noInfo: true,
  // webpack 卡住自动刷新页面
  reload: true,
}
const devConfig: Configuration = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    // 只有 main 入口，记得名称一致，用于合并
    main: [
      `webpack-hot-middleware/client?${qs.stringify(
        hotMiddlewareOptions as Record<string, any>
      )}`,
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    DotenvWebpackPluginGenerator(),
  ].filter(Boolean) as Configuration['plugins'],
}
export default merge(commonConfig, devConfig)
