"use strict";
exports.__esModule = true;
var express = require("express");
var multer = require("multer");
var upload_1 = require("./router/upload");
var getList_1 = require("./router/getList");
var app = express();
var upload = multer();
// 前端项目
app.use(express.static('public'));
// 文件上传接口
app.use('/upload', upload.single('file'), upload_1["default"]);
app.use('/getList', getList_1["default"]);
app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/');
});
