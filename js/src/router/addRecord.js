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
var util_1 = require("../util");
var express_validator_1 = require("express-validator");
var db_1 = require("../db");
var db_2 = require("../db");
/** 新增文件记录 */
exports["default"] = (0, express_1.Router)().get('/addRecord', (0, express_validator_1.query)('parentId').isInt(), (0, express_validator_1.query)('name').notEmpty(), (0, express_validator_1.query)('size').isInt(), (0, express_validator_1.query)('objectId').notEmpty(), (0, express_validator_1.query)('isDir').custom(function (input) { return input == 1 || input == 0; }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, conn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, (0, util_1.sendErr)(res, errors.array()[0].msg)
                        /** 数据库连接 */
                    ];
                return [4 /*yield*/, (0, db_1.getConn)(res)];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, insertData(res, conn, req.query)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
/**
 * 插入数据
 * @param res 请求对象
 * @param conn 数据库连接
 */
function insertData(res, conn, query) {
    return __awaiter(this, void 0, void 0, function () {
        var parentId, name, size, objectId, isDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parentId = query.parentId;
                    name = query.name;
                    size = query.size;
                    objectId = query.objectId;
                    isDir = query.isDir;
                    // 判断文件或文件夹是否已经存在
                    return [4 /*yield*/, new Promise(function (resolve) {
                            conn.get("SELECT NULL FROM \"".concat(db_2.DATABASE_CONFIG.table, "\"\n        WHERE \"parent_id\" = ").concat(parentId, " AND \"name\" = \"").concat(name, "\" AND \"is_dir\" = ").concat(isDir), function (err, row) {
                                if (err)
                                    return (0, util_1.sendErr)(res, err.message);
                                if (row)
                                    return (0, util_1.sendErr)(res, '文件或文件夹已经存在');
                                resolve(null);
                            });
                        })
                        // 插入数据
                    ];
                case 1:
                    // 判断文件或文件夹是否已经存在
                    _a.sent();
                    // 插入数据
                    return [4 /*yield*/, new Promise(function (resolve) {
                            conn.run("INSERT INTO \"".concat(db_2.DATABASE_CONFIG.table, "\"\n        (\"parent_id\", \"name\", \"size\", \"object_id\", \"is_dir\", \"upload_time\") VALUES\n        (").concat(parentId, ", \"").concat(name, "\", ").concat(size, ", \"").concat(objectId, "\", ").concat(isDir, ", DATETIME('NOW'))"), function (err) {
                                if (err)
                                    return (0, util_1.sendErr)(res, err.message);
                                resolve(null);
                            });
                        })];
                case 2:
                    // 插入数据
                    _a.sent();
                    (0, util_1.sendSuc)(res, null, '新增记录成功');
                    return [2 /*return*/];
            }
        });
    });
}
