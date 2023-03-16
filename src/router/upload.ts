import { Router, Request, Response } from 'express'
import axios from 'axios'
import * as FormData from 'form-data'
import { AxiosResponse } from 'axios'
import { Database } from 'sqlite3'
const router = Router()

router.post('/upload', async (request: Request, response: Response) => {
    if (!request.file) return response.send('错误')
    /** SQLite 数据库连接 */
    const conn = await initDatabase()
    let isExists = await fileExistsInFolder(conn, request)
    if (isExists) return response.send('当前目录已经存在该文件')
    const result = await uploadFile(request.file)
    await insertFileRow(conn, request, result)
    conn.close()
    response.send(result.data)
})

/**
 * 判断当前文件夹是否已经存在该文件名
 * @param conn 数据库连接
 * @param request 前端请求对象
 */
function fileExistsInFolder(conn: Database, request: Request) {
    /** 父文件夹 ID */
    let parentId: number = request.body.parentId || 0
    const file = request.file as Express.Multer.File
    let filename = getFileName(file)
    let sql = `SELECT COUNT(*) as count FROM "filelist" WHERE "name" = "${filename}" AND "parent_id" = ${parentId}`
    return new Promise<boolean>((resolve) => {
        conn.get(sql, (_error, row: { count: number }) => {
            resolve(row.count > 0)
        })
    })
}

/**
 * 插入数据库记录
 * @param conn 数据库连接
 * @param file 文件对象
 * @param parentId 父文件夹 ID
 * @returns 
 */
async function insertFileRow(conn: Database, request: Request, result: AxiosResponse) {
    /** 父文件夹 ID */
    let parentId: number = request.body.parentId || 0
    return new Promise<Error | null>((resolve) => {
        const file = request.file as Express.Multer.File
        let filename = getFileName(file)
        let objectId = result.data.data.result.objectId
        let sql = `INSERT INTO "filelist" ("parent_id", "name", "is_dir", "object_id", "upload_time") VALUES (${parentId}, "${filename}", 0, "${objectId}", "${new Date().toLocaleString()}")`
        conn.run(sql, (error) => {
            resolve(error)
        })
    })
}

/**
 * 初始化数据库
 * @param conn 数据库连接
 */
function initDatabase() {
    return new Promise<Database>((resolve) => {
        const conn = new Database('filelist.db', async (error) => {
            if (error) console.log('数据库连接失败')
            conn.run(`CREATE TABLE IF NOT EXISTS "filelist" (
                "id" INTEGER NOT NULL,
                "parent_id" INT NOT NULL,
                "name" TEXT NOT NULL,
                "is_dir" INTEGER NOT NULL,
                "object_id" TEXT NOT NULL,
                "upload_time" TEXT NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT),
                UNIQUE("parent_id", "name", "is_dir")
            )`, (error) => {
                if (error) console.log('插入记录失败')
                resolve(conn)
            })
        })
    })
}

/**
 * 获取文件名
 * @param file 文件对象
 * @returns 文件名
 */
function getFileName(file: Express.Multer.File) {
    let filename = file.originalname
    // 浏览器上传文件时，文件名默认为 latin1 编码，这里进行判断和转换
    if (isEncoding(filename, 'latin1'))
        return Buffer.from(filename, 'latin1').toString('utf-8')
    return filename
}

/**
 * 上传文件到超星
 * @param file 文件对象
 * @returns 超星响应内容
 */
async function uploadFile(file: Express.Multer.File) {
    let api = 'https://office.chaoxing.com/data/mobile/forms/gather/fore/file/upload'
    const formData = new FormData()
    // 很关键的部分，必须定义 options，否则会变成普通的 Buffer
    formData.append('file', file.buffer, {
        filename: getFileName(file),
        contentType: file.mimetype,
        knownLength: file.size
    })
    const result = await axios.post(api, formData)
    return result
}

/**
 * 判断字符串是否是某种编码
 * @param data 待判断字符串
 * @param encoding 待判断编码
 */
function isEncoding(data: string, encoding: BufferEncoding) {
    return Buffer.from(data, encoding).toString(encoding) == data
}

export default router