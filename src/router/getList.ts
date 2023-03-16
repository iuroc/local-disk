import { Router, Request, Response } from 'express'
import { initDatabase, FileDataRow } from '../database'
import { sendResponse } from '../tool'
import { ParsedQs } from 'qs'

const router = Router()

router.get('/', async (request, response) => {
    const conn = await initDatabase()
    if (!request.query) return sendResponse(response, {
        code: 0,
        msg: '参数缺失',
        data: null
    })
    let parentId: string = getQueryItem(request.query, 'parentId') || '0'
    let sql = `SELECT * FROM "filelist" WHERE "parent_id" = ${parentId}`
    const result = await new Promise<FileDataRow[]>((resolve) => {
        conn.all(sql, (_error, rows) => {
            resolve(rows as FileDataRow[])
        })
    })
    console.log(result)
    sendResponse(response, {
        code: 200,
        msg: '获取成功',
        data: result
    })
})

export default router

function getQueryItem(query: ParsedQs, name: string): string {
    if (!query || !query[name]) return ''
    return query[name] as string
}