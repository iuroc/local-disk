"use strict";
exports.__esModule = true;
var express = require("express");
var upload_1 = require("./router/upload");
var getList_1 = require("./router/getList");
var app = express();
// 前端项目
app.use(express.static('public'));
// 文件上传接口
app.use(getList_1["default"], upload_1["default"]);
app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/');
});
