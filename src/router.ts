import { Express } from 'express'
import addRecord from './router/addRecord'
import getList from './router/getList'

/**
 * 路由函数
 * @param app Express 对象
 * @returns Express 对象
 */
export default function router(app: Express) {
    app.use((_req, res, next) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        next()
    }, addRecord, getList)
    return app
}