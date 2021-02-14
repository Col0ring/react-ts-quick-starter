import { RequestHandler } from 'express'

type Methods = [
  'all',
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head'
]
type Item<T> = T extends Array<infer U> ? U : never
export type MethodProps = Item<Methods>
export type MethodsType = MethodProps | `${Uppercase<MethodProps>}`
// 因为 typescript 目前的 bug，这样写后类型直接变 {} 了
// export type RoutesMap = Partial<
//   Record<`${MethodsType} ${string}`, RequestHandler>
// >
export type RoutesMap = Record<string, RequestHandler | RequestHandler[]>

export type MockRoutesMap = Record<
  string,
  {
    handler: RequestHandler | RequestHandler[]
    method: MethodProps
  }
>
