import { RequestHandler } from 'express'
// 默认是使用文件名作为 prefix，也可以导出一个 prefix 变量手动更替，注意该 prefix 只是当前文件的前缀。
export const prefix = ''
// 最后的路径会边我得 /example/hello 会根据目录的结构自动加前缀
const routes: Record<string, RequestHandler | RequestHandler[]> = {
  'GET /hello': (req, res) => {
    res.send('hello world')
  },
}

export default routes
