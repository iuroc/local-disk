"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var addRecord_1 = require("./router/addRecord");
var getList_1 = require("./router/getList");
/**
 * 路由函数
 * @param app Express 对象
 * @returns Express 对象
 */
function router(app) {
    app.use(function (_req, res, next) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        next();
    }, addRecord_1.default, getList_1.default);
    return app;
}
exports.default = router;
