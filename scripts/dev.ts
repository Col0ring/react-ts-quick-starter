import { merge } from 'webpack-merge'
import Application, {
  devConfig,
  FriendlyErrorsWebpackPluginGenerator,
} from '../build'

const app = new Application()

app.initWebpackDevServer((port) =>
  merge(devConfig, {
    plugins: [FriendlyErrorsWebpackPluginGenerator(port)],
  })
)
