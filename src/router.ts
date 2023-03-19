import { Express } from 'express'
import addRecord from './router/addRecord'

export default function router(app: Express) {
    app.use((_req, res, next) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        next()
    }, addRecord)
    return app
}