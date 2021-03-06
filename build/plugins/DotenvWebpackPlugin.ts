import Dotenv from 'dotenv-webpack'
import fs from 'fs'
import { isDev } from '../config'
import { resolve } from '../util'

function PluginGenerator() {
  const path = resolve(
    isDev ? '../.env.development.local' : '../.env.production.local'
  )
  return fs.existsSync(path)
    ? new Dotenv({
        path,
        safe: true,
      })
    : null
}

export default PluginGenerator
