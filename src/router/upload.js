"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
var axios_1 = require("axios");
var FormData = require("form-data");
var database_1 = require("../database");
var tool_1 = require("../tool");
var router = (0, express_1.Router)();
router.post('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var conn, isExists, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!request.file || !request.body)
                    return [2 /*return*/, (0, tool_1.sendResponse)(response, {
                            code: 0,
                            msg: '文件或参数错误',
                            data: null
                        })
                        /** SQLite 数据库连接 */
                    ];
                return [4 /*yield*/, (0, database_1.initDatabase)()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, fileExistsInFolder(conn, request)];
            case 2:
                isExists = _a.sent();
                if (isExists)
                    return [2 /*return*/, (0, tool_1.sendResponse)(response, {
                            code: 0,
                            msg: '当前目录已经存在该文件',
                            data: null
                        })];
                return [4 /*yield*/, uploadFile(request.file)];
            case 3:
                result = _a.sent();
                return [4 /*yield*/, insertFileRow(conn, request, result)];
            case 4:
                _a.sent();
                conn.close();
                (0, tool_1.sendResponse)(response, {
                    code: 200,
                    msg: '上传成功',
                    data: result.data.data.result
                });
                return [2 /*return*/];
        }
    });
}); });
/**
 * 判断当前文件夹是否已经存在该文件名
 * @param conn 数据库连接
 * @param request 前端请求对象
 */
function fileExistsInFolder(conn, request) {
    /** 父文件夹 ID */
    var parentId = request.body.parentId || '';
    var file = request.file;
    var filename = getFileName(file);
    var sql = "SELECT COUNT(*) as count FROM \"filelist\" WHERE \"name\" = \"".concat(filename, "\" AND \"parent_id\" = ").concat(parentId);
    return new Promise(function (resolve) {
        conn.get(sql, function (_error, row) {
            resolve(row.count > 0);
        });
    });
}
/**
 * 插入数据库记录
 * @param conn 数据库连接
 * @param file 文件对象
 * @param parentId 父文件夹 ID
 * @returns
 */
function insertFileRow(conn, request, result) {
    /** 父文件夹 ID */
    var parentId = request.body.parentId || 0;
    return new Promise(function (resolve) {
        var file = request.file;
        var filename = getFileName(file);
        var objectId = result.data.data.result.objectId;
        var sql = "INSERT INTO \"filelist\" (\"parent_id\", \"name\", \"is_dir\", \"object_id\", \"upload_time\") VALUES (".concat(parentId, ", \"").concat(filename, "\", 0, \"").concat(objectId, "\", \"").concat(new Date().toLocaleString(), "\")");
        conn.run(sql, function (error) {
            resolve(error);
        });
    });
}
/**
 * 获取文件名
 * @param file 文件对象
 * @returns 文件名
 */
function getFileName(file) {
    var filename = file.originalname;
    // 浏览器上传文件时，文件名默认为 latin1 编码，这里进行判断和转换
    if (isEncoding(filename, 'latin1'))
        return Buffer.from(filename, 'latin1').toString('utf-8');
    return filename;
}
/**
 * 上传文件到超星
 * @param file 文件对象
 * @returns 超星响应内容
 */
function uploadFile(file) {
    var api = 'https://office.chaoxing.com/data/mobile/forms/gather/fore/file/upload';
    var formData = new FormData();
    // 很关键的部分，必须定义 options，否则会变成普通的 Buffer
    formData.append('file', file.buffer, {
        filename: getFileName(file),
        contentType: file.mimetype,
        knownLength: file.size
    });
    return axios_1["default"].post(api, formData);
}
/**
 * 判断字符串是否是某种编码
 * @param data 待判断字符串
 * @param encoding 待判断编码
 */
function isEncoding(data, encoding) {
    return Buffer.from(data, encoding).toString(encoding) == data;
}
exports["default"] = router;
