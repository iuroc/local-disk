import { Router } from 'express'
import { createProxyServer } from 'http-proxy'

const router = Router()
const proxy = createProxyServer()
router.post('/upload', (req, res) => {
    proxy.web(req, res, {
        target: 'http://office.chaoxing.com/data/mobile/forms/gather/fore/file',
        changeOrigin: true
    })
})

export default router