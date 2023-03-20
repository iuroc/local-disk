import { Router, Response } from 'express'
import { sendErr, sendSuc } from '../util'
import { query, validationResult } from 'express-validator'
import { getConn, DATABASE_CONFIG, fileInfo } from '../db'
import { Database } from 'sqlite3'

/** 获取文件列表 */
export default Router().get('/getList',
    query('parentId').isInt(),
    query('page').default(0).isInt().custom((input) => input >= 0),
    query('pageSize').default(24).isInt().custom((input) => input >= 0),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return sendErr(res, errors.array()[0].msg)
        /** 数据库连接 */
        const conn = await getConn(res)
        const fileList = await getFileList(res, conn, req.query as Record<string, any>)
        sendSuc(res, fileList, '获取成功')
    }
)

/**
 * 获取文件列表
 * @param res 响应对象
 * @param conn 数据库连接
 * @param query 请求参数
 * @returns 查询结果
 */
function getFileList(res: Response, conn: Database, query: Record<string, any>) {
    return new Promise<fileInfo[]>((resolve) => {
        let page = query.page as number
        let pageSize = query.pageSize as number
        let parentId = query.parentId as number
        let sql = `SELECT * FROM "${DATABASE_CONFIG.table}"
        WHERE "parent_id" = ${parentId} OR "id" = ${parentId} LIMIT ${pageSize} OFFSET ${page * pageSize}`
        conn.all(sql, (err, rows: fileInfo[]) => {
            if (err) return sendErr(res, '数据库查询失败')
            resolve(rows)
        })
    })
}