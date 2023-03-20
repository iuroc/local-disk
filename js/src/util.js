"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuc = exports.sendErr = exports.sendRes = exports.parseValue = void 0;
/**
 * 转换请求参数值
 * @param value 待处理的值
 * @param type 希望被转换为的类型
 * @param defaultValue 默认值，缺省则此请求参数为必填
 * @returns 转换结果，如为 `false`，则参数缺失或参数类型转换错误
 * @author 欧阳鹏
 */
function parseValue(value, type, defaultValue) {
    if (value === void 0) { value = ''; }
    if (type === void 0) { type = 'string'; }
    /** 请求参数是否可留空 */
    var notNull = defaultValue == undefined;
    if (notNull && (value == undefined || value == ''))
        // 请求参数缺失
        return false;
    /** `value` 转为的字符串 */
    var strValue = value.toString();
    if (type == 'string')
        // 输出 string 类型
        return setReturn(strValue);
    if (type == 'number') {
        // 输出 number 类型
        return setReturn(toNumber(strValue));
    }
    if (type == 'array') {
        // 输出 string[] 类型
        if (typeof value == 'string')
            return setReturn([value]);
        if (Array.isArray(value)) {
            var result = value.map(function (item) { return item.toString(); });
            return setReturn(result);
        }
    }
    if (type == 'numArray') {
        // 输出数字数组
        if (typeof value == 'string')
            return setReturn([toNumber(strValue)]);
        if (Array.isArray(value)) {
            /** 转换成功与否 */
            var isGood_1 = true;
            var result = value.map(function (item) {
                var temp = toNumber(item);
                isGood_1 = (temp !== false);
                return temp;
            });
            // 判断转换成功与否
            if (isGood_1)
                return setReturn(result);
            return false;
        }
    }
    return false;
    /**
     * 字符串转为数字
     * @param str 待转换的字符串
     * @returns 转换结果，失败则返回 false
     */
    function toNumber(str) {
        var num = parseInt(str);
        var result = isNaN(num) ? false : num;
        return result;
    }
    /**
     * 设置返回内容
     * @param value 处理前返回内容
     * @returns 处理后返回内容
     */
    function setReturn(value) {
        if ((value === false || value === '')
            && defaultValue !== undefined)
            return defaultValue;
        return value;
    }
}
exports.parseValue = parseValue;
/**
 * 发送响应
 * @param res 响应对象
 * @param data 响应数据主体
 * @param msg 提示文本
 * @param code 响应代码
 * @returns 生成结果
 */
function sendRes(res, data, msg, code) {
    if (data === void 0) { data = null; }
    if (msg === void 0) { msg = ''; }
    if (code === void 0) { code = 200; }
    return res.status(code).json({ code: code, msg: msg, data: data });
}
exports.sendRes = sendRes;
/**
 * 发送错误响应
 * @param res 响应对象
 * @param msg 提示文本
 * @returns
 */
function sendErr(res, msg) {
    return sendRes(res, null, msg, 400);
}
exports.sendErr = sendErr;
/**
 * 发送成功响应
 * @param res 响应对象
 * @param data 响应数据主体
 * @param msg 提示文本
 * @returns
 */
function sendSuc(res, data, msg) {
    return sendRes(res, data, msg, 200);
}
exports.sendSuc = sendSuc;
