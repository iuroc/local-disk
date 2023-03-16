import { Database } from 'sqlite3'
/**
 * 初始化数据库
 * @param conn 数据库连接
 */
export function initDatabase() {
    return new Promise<Database>((resolve) => {
        const conn = new Database('filelist.db', async (error) => {
            if (error) console.log('数据库连接失败')
            conn.run(`CREATE TABLE IF NOT EXISTS "filelist" (
                "id" INTEGER NOT NULL,
                "parent_id" INT NOT NULL,
                "name" TEXT NOT NULL,
                "is_dir" INTEGER NOT NULL,
                "object_id" TEXT,
                "upload_time" TEXT NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT),
                UNIQUE("parent_id", "name", "is_dir")
            )`, (error) => {
                if (error) console.log('数据表创建失败')
                resolve(conn)
            })
        })
    })
}

/** 数据库中的文件记录 */
export type FileDataRow = {
    /** 文件 ID */
    id: number,
    /** 所属文件夹 ID */
    parent_id: number,
    /** 文件名 */
    name: string,
    /** 是否是文件夹 */
    is_dir: number,
    /** 文件对象 ID */
    object_id: string,
    /** 上传时间 */
    upload_time: string
}