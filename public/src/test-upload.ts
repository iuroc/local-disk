const uploadEle = document.querySelector('.upload') as HTMLButtonElement
const fileEle = document.querySelector('.file') as HTMLInputElement
const resultEle = document.querySelector('.result') as HTMLDivElement
uploadEle.addEventListener('click', () => {
    const files = fileEle.files
    if (!files || files.length == 0) return
    resultEle.innerHTML = ''
    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('parentId', '0')
    resultEle.innerHTML = ''
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (event) => {
        resultEle.innerHTML = Math.floor(event.loaded / event.total * 100) + '%'
    })
    xhr.open('post', '/upload', true)
    xhr.send(formData)
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const result = JSON.parse(xhr.responseText)
            if (result.code == 0) return
            let objectId = result.data.objectId
            resultEle.innerHTML = `<a target="_blank" href="http://sharewh1.xuexi365.com/share/download/${objectId}">文件上传成功，点击下载</a>`
        }
    }
})