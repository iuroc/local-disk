import * as express from 'express'
import uploadApi from './router/upload'
import getList from './router/getList'
const app = express()

// 前端项目
app.use(express.static('public'))
// 文件上传接口
app.use(getList, uploadApi)
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000/')
})