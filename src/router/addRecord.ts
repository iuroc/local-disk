import { Router, Response } from 'express'
import { sendErr, sendRes } from '../tool'
import { query, validationResult } from 'express-validator'
import { getConn } from '../db'
import { Database } from 'sqlite3'
import { DATABASE_CONFIG } from '../db'
/** 新增文件记录 */

export default Router().get('/addRecord',
    query('parentId').isInt(),
    query('name').notEmpty(),
    query('size').isInt(),
    query('objectId').notEmpty(),
    query('isDir').custom((input) => input == 1 || input == 0),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return sendErr(res, errors.array()[0].msg)
        if (!req.query) return sendErr(res, '参数错误')
        /** 数据库连接 */
        const conn = await getConn(res)
        await insertData(res, conn, req.query)
    })
/**
 * 插入数据
 * @param res 请求对象
 * @param conn 数据库连接
 */
async function insertData(res: Response, conn: Database, query: Record<string, any>) {
    /** 父文件夹 ID */
    let parentId: number = query.parentId
    /** 文件名 */
    let name: string = query.name
    /** 文件大小 */
    let size: number = query.size
    /** 文件对象 ID */
    let objectId: string = query.objectId
    /** 是否是文件夹 */
    let isDir: string = query.isDir
    // 判断文件或文件夹是否已经存在
    await new Promise((resolve) => {
        conn.get(`SELECT NULL FROM "${DATABASE_CONFIG.table}"
        WHERE "parent_id" = ${parentId} AND "name" = "${name}" AND "is_dir" = ${isDir}`, (err, row) => {
            if (err) return sendErr(res, err.message)
            if (row) return sendErr(res, '文件或文件夹已经存在')
            resolve(null)
        })
    })
    // 插入数据
    await new Promise((resolve) => {
        conn.run(`INSERT INTO "${DATABASE_CONFIG.table}"
        ("parent_id", "name", "size", "object_id", "is_dir", "upload_time") VALUES
        (${parentId}, "${name}", ${size}, "${objectId}", ${isDir}, DATETIME('NOW'))`, (err) => {
            if (err) return sendErr(res, err.message)
            resolve(null)
        })
    })
    sendRes(res)
}