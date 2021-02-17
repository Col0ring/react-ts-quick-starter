/**
 * copied from https://github.com/umijs/umi/blob/master/packages/babel-plugin-auto-css-modules/src/index.ts
 */
import type { NodePath, Visitor } from '@babel/traverse'
import type { ImportDeclaration } from '@babel/types'
// eslint-disable-next-line unicorn/import-style
import { extname } from 'path'

export interface IOpts {
  flag?: string
}

const CSS_EXTNAMES = new Set([
  '.css',
  '.less',
  '.sass',
  '.scss',
  '.stylus',
  '.styl',
])

export default function AutoCssModules() {
  return {
    visitor: {
      ImportDeclaration(
        path: NodePath<ImportDeclaration>,
        { opts }: { opts: IOpts }
      ) {
        const {
          specifiers,
          source,
          source: { value },
        } = path.node
        // 是否是 import xxx from 'xxx’ 的形式
        if (specifiers.length > 0 && CSS_EXTNAMES.has(extname(value))) {
          source.value = `${value}?${opts.flag || 'modules'}`
        }
      },
    } as Visitor,
  }
}
