"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_proxy_1 = require("http-proxy");
var router = (0, express_1.Router)();
var proxy = (0, http_proxy_1.createProxyServer)();
router.post('/upload', function (req, res) {
    proxy.web(req, res, {
        target: 'http://office.chaoxing.com/data/mobile/forms/gather/fore/file',
        changeOrigin: true
    });
});
exports["default"] = router;
