import Application from './server/app'
import FriendlyErrorsWebpackPluginGenerator from './plugins/FriendlyErrorsWebpackPlugin'
import prodConfig from './webpack/webpack.prod'
import devConfig from './webpack/webpack.dev'

export * from './type'
export {
  Application,
  FriendlyErrorsWebpackPluginGenerator,
  prodConfig,
  devConfig,
}

export default Application
