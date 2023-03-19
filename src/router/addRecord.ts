import { Router } from 'express'
import { setResponse } from '../tool'
import { Database } from 'sqlite3'
import { query, validationResult } from 'express-validator'
/** 新增文件记录 */

export default Router().get('/addRecord', query('id').isInt(), (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json(
            setResponse(null, errors.array()[0].msg, 0)
        )
    res.json(setResponse('哈哈'))
})