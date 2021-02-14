import Application, { prodConfig } from '../build'

const app = new Application()

app.initWebpackProdServer(prodConfig)
