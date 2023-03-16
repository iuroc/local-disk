import { Response } from 'express'
/** 发送响应 */
export function sendResponse(response: Response, data: ApiResponse) {
    response.send(data)
}

/** API 响应数据 */
export type ApiResponse = {
    /** 响应码 */
    code: 200 | 0,
    /** 响应说明 */
    msg: string,
    /** 响应数据 */
    data: any
}
