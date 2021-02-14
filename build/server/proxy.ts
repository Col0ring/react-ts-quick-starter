import { Options } from 'http-proxy-middleware'
import { devPort } from '../config'

const proxySetting: Record<string, Options> = {
  '/api': {
    // 这里是代理的 mock 数据，先代理再 mock
    target: `http://localhost:${devPort}`,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  },
}

export default proxySetting
