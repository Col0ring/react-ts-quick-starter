import { RoutesMap } from '../build/type'
// 默认是使用文件名作为 prefix，也可以导出一个 prefix 变量手动更替，注意该 prefix 只是当前文件的前缀。
export const prefix = '/example'
const routes: RoutesMap = {
  // 使用请求方式 + 路径的形式,handler 可以传数组，一般用于中间件形式
  'GET /': [
    (req, res) => {
      res.send('hello world, example')
    },
  ],
}

export default routes
