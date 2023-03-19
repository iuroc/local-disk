import { Express } from 'express'
import addRecord from './router/addRecord'

export default function router(app: Express) {
    app.use(addRecord)
    return app
}