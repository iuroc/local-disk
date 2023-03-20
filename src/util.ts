import { ParsedQs } from 'qs'
import { Response } from 'express'
/**
 * 转换请求参数值
 * @param value 待处理的值
 * @param type 希望被转换为的类型
 * @param defaultValue 默认值，缺省则此请求参数为必填
 * @returns 转换结果，如为 `false`，则参数缺失或参数类型转换错误
 * @author 欧阳鹏
 */
export function parseValue<T extends keyof ValueType>(
    value: string | ParsedQs | string[] | ParsedQs[] = '',
    type: T | 'string' = 'string',
    defaultValue?: ValueType[T]): ValueType[T] | false {

    type Return = ValueType[T] | false
    /** 请求参数是否可留空 */
    let notNull = defaultValue == undefined
    if (notNull && (value == undefined || value == ''))
        // 请求参数缺失
        return false
    /** `value` 转为的字符串 */
    const strValue = value.toString()
    if (type == 'string')
        // 输出 string 类型
        return setReturn(strValue)
    if (type == 'number') {
        // 输出 number 类型
        return setReturn(toNumber(strValue))
    }
    if (type == 'array') {
        // 输出 string[] 类型
        if (typeof value == 'string')
            return setReturn([value])
        if (Array.isArray(value)) {
            const result = value.map(
                (item: string | ParsedQs) => item.toString()
            )
            return setReturn(result)
        }
    }
    if (type == 'numArray') {
        // 输出数字数组
        if (typeof value == 'string')
            return setReturn([toNumber(strValue)])
        if (Array.isArray(value)) {
            /** 转换成功与否 */
            let isGood = true
            let result = value.map((item: string | ParsedQs) => {
                let temp = toNumber(item as string)
                isGood = (temp !== false)
                return temp
            }) as Return
            // 判断转换成功与否
            if (isGood) return setReturn(result)
            return false
        }
    }
    return false
    /**
     * 字符串转为数字
     * @param str 待转换的字符串
     * @returns 转换结果，失败则返回 false
     */
    function toNumber(str: string): false | number {
        let num = parseInt(str)
        let result = isNaN(num) ? false : num
        return result
    }
    /**
     * 设置返回内容
     * @param value 处理前返回内容
     * @returns 处理后返回内容
     */
    function setReturn(value: any): Return {
        if ((value === false || value === '')
            && defaultValue !== undefined)
            return defaultValue
        return value as Return
    }
}

/** 参数值类型 */
interface ValueType {
    /** 数字 */
    number: number
    /** 字符串 */
    string: string
    /** 字符串数组 */
    array: string[],
    /** 数字数组 */
    numArray: number[],
}

/** 响应代码 */
type resCode = 200 | 400

/** API 响应数据 */
export type ApiResponse = {
    code: resCode,
    msg: string,
    data: any
}

/**
 * 发送响应
 * @param res 响应对象
 * @param data 响应数据主体
 * @param msg 提示文本
 * @param code 响应代码
 * @returns 生成结果
 */
export function sendRes(
    res: Response,
    data: any = null,
    msg: string = '',
    code: resCode = 200
) {
    return res.status(code).json({ code, msg, data })
}

/**
 * 发送错误响应
 * @param res 响应对象
 * @param msg 提示文本
 * @returns 
 */
export function sendErr(res: Response, msg?: string) {
    return sendRes(res, null, msg, 400)
}

/**
 * 发送成功响应
 * @param res 响应对象
 * @param data 响应数据主体
 * @param msg 提示文本
 * @returns 
 */
export function sendSuc(res: Response, data?: any, msg?: string) {
    return sendRes(res, data, msg, 200)
}