(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
/** 站点配置信息 */
exports.CONFIG = {
    /** 站点标题 */
    siteName: 'APEE 云盘'
};

},{}],5:[function(require,module,exports){
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
var config_1 = require("./config");
document.body.ondragstart = function () { return false; };
var poncon = new ponconjs_1.default();
/** 页面加载就绪记录 */
// const LOAD: Record<string, boolean> = {}
/** 页面数据存储 */
var DATA = {};
poncon.setPageList(['home', 'upload', 'about', 'list', 'file']);
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
poncon.setPage('upload', function () {
    document.title = '上传文件 - ' + config_1.CONFIG.siteName;
});
poncon.start();
document.documentElement.oncontextmenu = function (event) { return event.preventDefault(); };
/** 右键菜单面板 */
var menuEle = document.querySelector('.file-list-menu');
document.documentElement.onclick = function (event) {
    var targetEle = event.target;
    if (!targetEle.classList.contains('file-list-menu')) {
        if (menuEle)
            menuEle.style.display = 'none';
    }
};
var uploadEle = document.querySelector('.header .upload');
var inputFileEle = document.querySelector('.input-file');
uploadEle === null || uploadEle === void 0 ? void 0 : uploadEle.addEventListener('click', function () {
    inputFileEle === null || inputFileEle === void 0 ? void 0 : inputFileEle.click();
});
window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = '';
});
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
                list.sort(function (a, b) {
                    if (a.id === parentId) {
                        return -1;
                    }
                    else if (b.id === parentId) {
                        return 1;
                    }
                    else if (a.is_dir > b.is_dir) {
                        return -1;
                    }
                    else if (a.is_dir < b.is_dir) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                var folderName = list[0].name;
                document.title = "".concat(parentId == 0 ? '' : "".concat(folderName, " - ")).concat(config_1.CONFIG.siteName);
                list.forEach(function (item) {
                    html_1 += getHtml(item, parentId);
                });
                if (page == 0)
                    listEle.innerHTML = html_1;
                else
                    listEle.innerHTML += html_1;
                addEvent(listEle);
                resolve(null);
            }
        };
    });
}
/** 文件列表右键事件 */
function contextmenuEvent(event) {
    event.preventDefault();
    if (!menuEle)
        return false;
    var left = event.clientX;
    var top = event.clientY;
    menuEle.style.display = 'block';
    var maxLeft = window.innerWidth - menuEle.offsetWidth;
    var maxTop = window.innerHeight - menuEle.offsetHeight;
    if (left > maxLeft)
        left = maxLeft;
    if (top > maxTop)
        top = maxTop;
    menuEle.style.left = left + 'px';
    menuEle.style.top = top + 'px';
}
/**
 * 为文件列表的列表项增加事件
 * @param listEle 列表元素对象
 */
function addEvent(listEle) {
    var eles = listEle.querySelectorAll('.file-list-item:not(.back)');
    eles.forEach(function (ele) {
        ele.addEventListener('contextmenu', contextmenuEvent);
    });
}
/**
 * 获取列表项 HTML
 * @param item 列表项数据
 * @param parentId 文件所属文件夹 ID
 * @returns 列表项 HTML
 */
function getHtml(item, parentId) {
    /** 当前列表项是否为返回上一级 */
    var ifBack = item.id == parentId;
    var imgPath = ifBack ? './img/chevron-left-solid.svg' :
        item.is_dir == 1 ? './img/folder-solid.svg' : './img/file-regular.svg';
    var name = ifBack ? '返回上一级' : item.name;
    var id = ifBack ? item.parent_id : item.id;
    return "<div class=\"col-sm-6 col-lg-4 col-xxl-3 mb-3\">\n    <a class=\"file-list-item hover-shadow card card-body flex-row align-items-center ".concat(ifBack ? 'back' : '', "\"\n    title=\"").concat(name, "\" href=\"").concat(item.is_dir ? "#/list/".concat(id) : "#/file/".concat(id), "\">\n        <img class=\"icon\" src=\"").concat(imgPath, "\" alt=\"").concat(['file', 'folder'][item.is_dir], "\" height=\"35px\" width=\"35px\">\n        <div class=\"fs-5 ms-3 text-truncate\">").concat(name, "</div>\n    </a>\n</div>");
}

},{"../../src/util":6,"./config":4,"ponconjs":7,"querystring":3}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * @author 欧阳鹏
 * https://apee.top
 */
var Poncon = /** @class */ (function () {
    function Poncon() {
        this.pages = {};
        this.pageNames = []; // 页面列表
    }
    /**
     * 切换页面显示
     * @param target 页面标识
     */
    Poncon.prototype.changeView = function (target) {
        if (!target) {
            return;
        }
        document.querySelectorAll('.poncon-page').forEach(function (dom) {
            dom.style.display = 'none';
        });
        var dom = document.querySelector(".poncon-".concat(target));
        dom.style.display = '';
    };
    /**
     * 设置页面名称列表
     * @param pageNames 页面名称列表
     */
    Poncon.prototype.setPageList = function (pageNames) {
        var _this_1 = this;
        pageNames.forEach(function (target) {
            var dom = document.querySelector(".poncon-".concat(target));
            _this_1.pages[target] = {
                dom: dom,
                event: (function () { }),
                data: {}
            };
        });
        this.pageNames = pageNames;
    };
    /**
     * 配置页面
     * @param target 页面标识
     * @param func 页面载入事件
     */
    Poncon.prototype.setPage = function (target, func) {
        if (!target) {
            return;
        }
        this.pages[target]['event'] = func || (function () { });
    };
    /**
     * 开启路由系统
     */
    Poncon.prototype.start = function () {
        var _this = this;
        window.addEventListener('hashchange', function (event) {
            var hash = new URL(event.newURL).hash;
            _this.loadTarget(hash);
        });
        this.loadTarget();
    };
    /**
     * 切换页面并执行页面事件
     * @param hash 页面标识
     */
    Poncon.prototype.loadTarget = function (hash) {
        var target = this.getTarget(hash);
        var dom = this.getDom(target);
        var args = this.getArgs(hash);
        this.changeView(target);
        this.pages[target].event(dom, args, this.pages[target].data);
    };
    /**
     * 获取页面参数列表
     * @param hash 网址Hash
     * @returns 页面参数列表
     */
    Poncon.prototype.getArgs = function (hash) {
        var strs = (hash || location.hash).split('/');
        if (strs.length < 3) {
            return [];
        }
        return strs.slice(2);
    };
    /**
     * 获取当前页面标识, 支持自动矫正
     * @param hash 网址hash
     * @returns 页面标识
     */
    Poncon.prototype.getTarget = function (hash) {
        var strs = (hash || location.hash).split('/');
        var target = strs[1] || '';
        // target不合法或者不在白名单
        if (target.search(/^\w+$/) != 0 || this.pageNames.indexOf(target) == -1) {
            history.replaceState({}, '', "".concat(location.pathname));
            return 'home';
        }
        return target;
    };
    /**
     * 获取页面DOM
     * @param target 页面标识
     * @returns 页面DOM元素
     */
    Poncon.prototype.getDom = function (target) {
        return document.querySelector(".poncon-".concat(target));
    };
    return Poncon;
}());
exports["default"] = Poncon;

},{}]},{},[5]);
