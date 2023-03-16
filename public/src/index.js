"use strict";
var uploadEle = document.querySelector('.upload');
var fileEle = document.querySelector('.file');
uploadEle.addEventListener('click', function () {
    var files = fileEle.files;
    if (!files || files.length == 0)
        return;
    var file = files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('parentId', '0');
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/upload', true);
    xhr.send(formData);
});
