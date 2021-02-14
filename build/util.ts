import path from 'path'
import fs from 'fs'
import { RuleSetUseItem } from 'webpack'
import getPort from 'get-port'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { RequestHandler } from 'express'
import { isDev } from './config'
import { MethodProps, MockRoutesMap } from './type'

function resolve(relativePath: string) {
  return path.resolve(__dirname, relativePath)
}
const getCssLoaders = (importLoaders: number): RuleSetUseItem[] => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: isDev,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: isDev,
    },
  },
]

async function getRandomPort(preferredPort: number) {
  const port = await getPort({
    host: '0.0.0.0',
    port: getPort.makeRange(preferredPort, preferredPort + 100),
  })
  return port
}

async function loadMockRoutes(
  parentPath: string,
  prefix: string,
  options: {
    include?: RegExp
    exclude?: RegExp
  } = {}
): Promise<MockRoutesMap | null> {
  const routesMap: MockRoutesMap = {}
  const { include, exclude } = options
  if (fs.existsSync(parentPath)) {
    const files = fs.readdirSync(parentPath)
    for (const file of files) {
      const currentPath = path.resolve(parentPath, file)
      const stat = fs.statSync(currentPath)
      if (stat.isDirectory()) {
        // eslint-disable-next-line no-await-in-loop
        const childRoutesMap = await loadMockRoutes(
          currentPath,
          path.join(prefix, file),
          options
        )
        if (childRoutesMap) {
          Object.keys(childRoutesMap).forEach((key) => {
            routesMap[key] = childRoutesMap[key]
          })
        }
      } else {
        if (exclude instanceof RegExp && exclude.test(currentPath)) {
          continue
        }
        if (
          !(include instanceof RegExp) ||
          (include instanceof RegExp && include.test(currentPath))
        ) {
          // eslint-disable-next-line no-await-in-loop
          const { prefix: routePrefix, default: routes } = (await import(
            currentPath
          )) as {
            prefix?: string
            default: Record<string, RequestHandler>
          }
          Object.keys(routes).forEach((key) => {
            const [method, routePath] = key.split(' ')
            routesMap[path.join(prefix, routePrefix || '', routePath)] = {
              method: method.toLowerCase() as MethodProps,
              handler: routes[key],
            }
          })
        }
      }
    }
    return routesMap
  }
  return null
}

export { resolve, getCssLoaders, getRandomPort, loadMockRoutes }
