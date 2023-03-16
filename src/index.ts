import * as express from 'express'
import * as multer from 'multer'
import uploadApi from './router/upload'
const app = express()
const upload = multer()
// 前端项目
app.use(express.static('public'))
// 文件上传接口
app.post('/upload', upload.single('file'), uploadApi)
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})