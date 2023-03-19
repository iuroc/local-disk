import { Router, Request, Response, NextFunction } from 'express'
import { Database } from 'sqlite3'
import { parseValue } from '../tool'

/** 新增文件记录 */

export default Router().get('/addRecord', checkQuery, (_req, res) => {
    res.end('Hello World')
})

/** 校验 GET 参数 */
function checkQuery(req: Request, _res: Response, next: NextFunction) {
    const query = req.query
    console.log(query)
    let id = parseValue(query.id, 'string')
    let id2 = parseValue(query.id, 'number')
    let id3 = parseValue(query.id, 'array')
    let id4 = parseValue(query.id, 'numArray')
    console.log(id, id2, id3, id4)
    next()
}