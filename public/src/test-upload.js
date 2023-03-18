"use strict";
var uploadEle = document.querySelector('.upload');
var fileEle = document.querySelector('.file');
var resultEle = document.querySelector('.result');
uploadEle.addEventListener('click', function () {
    var files = fileEle.files;
    if (!files || files.length == 0)
        return;
    resultEle.innerHTML = '';
    var file = files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('parentId', '0');
    resultEle.innerHTML = '';
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', function (event) {
        resultEle.innerHTML = Math.floor(event.loaded / event.total * 100) + '%';
    });
    xhr.open('post', '/upload', true);
    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            if (result.code == 0)
                return;
            var objectId = result.data.objectId;
            resultEle.innerHTML = "<a target=\"_blank\" href=\"http://sharewh1.xuexi365.com/share/download/".concat(objectId, "\">\u6587\u4EF6\u4E0A\u4F20\u6210\u529F\uFF0C\u70B9\u51FB\u4E0B\u8F7D</a>");
        }
    };
});
