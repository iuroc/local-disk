"use strict";
exports.__esModule = true;
var express = require("express");
var multer = require("multer");
var upload_1 = require("./router/upload");
var child_process_1 = require("child_process");
var app = express();
var upload = multer();
// 前端项目
app.use(express.static('public'));
// 文件上传接口
app.post('/upload', upload.single('file'), upload_1["default"]);
app.listen(3000, function () {
    (0, child_process_1.exec)('start msedge --app=http://127.0.0.1:3000');
});
