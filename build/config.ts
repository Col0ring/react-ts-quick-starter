const isDev = process.env.NODE_ENV !== 'production'
const projectName = 'react-ts-quick-starter'
const bannerDescription =
  '/** @preserve Powered by react-ts-quick-starter (https://github.com/Col0ring/react-ts-quick-starter) */'
const devPort = 9527
const isOpenBrowser = false
const mock = true
const isNotify = false

export {
  isDev,
  isNotify,
  projectName,
  devPort,
  isOpenBrowser,
  bannerDescription,
  mock,
}
