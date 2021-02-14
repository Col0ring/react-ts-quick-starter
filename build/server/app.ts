import express, { Router } from 'express'
import webpack from 'webpack'
import { createProxyMiddleware, Options } from 'http-proxy-middleware'
import chalk from 'chalk'
import open from 'open'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import cors from 'cors'
import { getRandomPort, loadMockRoutes, resolve } from '../util'
import { devPort, isOpenBrowser, mock } from '../config'
import proxySetting from './proxy'

class Application {
  private app = express()

  private hadBrowserOpened = false

  private compiler!: webpack.Compiler

  private getServerPort(defaultPort: number) {
    // 将文件 serve 到 port 3000。
    return getRandomPort(defaultPort)
  }

  private listen(port: number) {
    this.app.listen(port, () => {
      console.log(
        `- your application is working on：${chalk.cyan.underline(
          `http://localhost:${port}`
        )}`
      )
    })
  }

  private openBrowser(address: string) {
    // 编译完成时执行
    this.compiler.hooks.done.tap('open-browser-plugin', async (stats) => {
      // 没有打开过浏览器并且没有编译错误就打开浏览器
      if (!this.hadBrowserOpened && !stats.hasErrors()) {
        await open(address)
        this.hadBrowserOpened = true
      }
    })
  }

  private async initMock() {
    // You can use mocker-api repo
    const parentPath = resolve('../mock')
    const routesMap = await loadMockRoutes(parentPath, '/', {
      include: /\.ts$/,
    })
    if (routesMap) {
      const router = Router()
      Object.entries(routesMap).forEach(([pathname, { method, handler }]) => {
        if (method in router) {
          if (Array.isArray(handler)) {
            router[method](pathname, ...handler)
          } else {
            router[method](pathname, handler)
          }
        }
      })
      this.app.use(router)
    }
  }

  private setProxy(options: Record<string, Options>) {
    Object.entries(options).forEach(([path, option]) => {
      const from = path
      const to = option.target
      console.log(
        `proxy ${chalk.magenta.underline(from)} ${chalk.green(
          '->'
        )} ${chalk.magenta.underline(to)}`
      )

      this.app.use(
        from,
        createProxyMiddleware({
          ...option,
          logLevel: option.logLevel ? option.logLevel : 'warn',
        })
      )
    })
    process.stdout.write('\n')
  }

  async initWebpackDevServer(
    config: ((port: number) => webpack.Configuration) | webpack.Configuration
  ) {
    const port = await this.getServerPort(devPort)
    if (typeof config === 'function') {
      this.compiler = webpack(config(port))
    } else {
      this.compiler = webpack(config)
    }
    // 开启跨域
    // 开发 chrome 扩展的时候可能需要开启跨域，参考：https://juejin.cn/post/6844904049276354567
    this.app.use(cors())

    // 告知 express 使用 webpack-dev-middleware，
    // 以及将 webpack.config.js 配置文件作为基础配置。
    this.app.use(
      webpackDevMiddleware(this.compiler, {
        // 只在发生错误或有新的编译时输出
        stats: 'errors-warnings',
      })
    )
    this.app.use(
      webpackHotMiddleware(this.compiler, {
        path: '/__webpack_hmr',
        log: false,
      })
    )
    if (mock) {
      this.initMock()
    }

    this.setProxy(proxySetting)

    this.listen(port)
    if (isOpenBrowser) {
      this.openBrowser(`http://localhost:${port}`)
    }
  }

  async initWebpackProdServer(
    config: (() => webpack.Configuration) | webpack.Configuration
  ) {
    if (typeof config === 'function') {
      this.compiler = webpack(config())
    } else {
      this.compiler = webpack(config)
    }
    this.compiler.run((err, stats) => {
      if (err || (stats && stats.hasErrors())) {
        if (err) {
          console.error(err)
        }
        if (stats) {
          const info = stats.toJson()
          if (stats.hasWarnings()) {
            console.warn(info.warnings)
          }
          if (stats.hasErrors()) {
            console.error(info.errors)
          }
        }
      } else {
        const prodStatsOpts = {
          preset: 'normal',
          colors: true,
        }
        console.log(stats?.toString(prodStatsOpts))
      }
    })
  }
}

export default Application
