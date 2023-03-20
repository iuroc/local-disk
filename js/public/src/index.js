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
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = require("querystring");
var util_1 = require("../../src/util");
var ponconjs_1 = require("ponconjs");
document.body.ondragstart = function () { return false; };
var poncon = new ponconjs_1.default();
/** 页面加载就绪记录 */
var LOAD = {};
poncon.setPageList(['home', 'upload', 'about', 'list']);
poncon.setPage('home', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadFileList()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
poncon.setPage('list', function (_dom, args) { return __awaiter(void 0, void 0, void 0, function () {
    var parentId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!args)
                    return [2 /*return*/];
                parentId = (0, util_1.parseValue)(args[0], 'number');
                if (parentId === false)
                    return [2 /*return*/];
                return [4 /*yield*/, loadFileList(parentId, 0)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
poncon.start();
/**
 * 加载文件列表
 * @param parentId 文件夹 ID
 * @param page 页码
 * @param pageSize 每页加载数量
 * @returns
 */
function loadFileList(parentId, page, pageSize) {
    if (parentId === void 0) { parentId = 0; }
    if (page === void 0) { page = 0; }
    if (pageSize === void 0) { pageSize = 24; }
    return new Promise(function (resolve) {
        var listEle = document.querySelector('.file-list');
        if (page == 0)
            listEle.innerHTML = '';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', './getList?' + (0, querystring_1.stringify)({
            parentId: parentId,
            page: page,
            pageSize: pageSize
        }), true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.code != 200)
                    return alert(data.msg);
                var html_1 = '';
                var list = data.data;
                list.forEach(function (item) {
                    html_1 += getHtml(item, parentId);
                });
                listEle.innerHTML += html_1;
                resolve(null);
            }
        };
    });
}
/**
 * 获取列表项 HTML
 * @param item 列表项数据
 * @param parentId 文件所属文件夹 ID
 * @returns 列表项 HTML
 */
function getHtml(item, parentId) {
    var imgPath = item.is_dir == 1 ? './img/folder-solid.svg' : './img/file-regular.svg';
    var name = item.id == parentId ? '返回上一级' : item.name;
    var id = item.id == parentId ? item.parent_id : item.id;
    return "<div class=\"col-sm-6 col-lg-4 col-xxl-3 mb-3\">\n    <a class=\"file-list-item hover-shadow card card-body flex-row align-items-center\"\n    title=\"".concat(name, "\" ").concat(item.is_dir ? "href=\"#/list/".concat(id, "\"") : '', ">\n        <img class=\"icon\" src=\"").concat(imgPath, "\" alt=\"").concat(['file', 'folder'][item.is_dir], "\" height=\"35px\" width=\"35px\">\n        <div class=\"fs-5 ms-3 text-truncate\">").concat(name, "</div>\n    </a>\n</div>");
}
