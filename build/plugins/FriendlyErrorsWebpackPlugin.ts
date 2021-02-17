import FriendlyErrorsWebpackPlugin, {
  WebpackError,
} from 'friendly-errors-webpack-plugin'
import notifier from 'node-notifier'
import { isDev, isNotify } from '../config'

function PluginGenerator(port?: number) {
  return new FriendlyErrorsWebpackPlugin({
    // 清除控制台
    clearConsole: false,
    compilationSuccessInfo: {
      messages: [
        isDev
          ? `You application is running here http://localhost:${port} !`
          : 'You application is building successfully',
      ],
      notes: [
        'Some additionnal notes to be displayed unpon successful compilation',
      ],
    },
    onErrors: (severity, errors) => {
      if (severity !== 'error') {
        return
      }
      const error = (errors[0] as unknown) as WebpackError
      // 桌面通知
      if (isNotify) {
        notifier.notify({
          title: 'webpack compile failed',
          message: `${severity} ${error.name}`,
          subtitle: error.file || '',
        })
      }
    },
  })
}

export default PluginGenerator
