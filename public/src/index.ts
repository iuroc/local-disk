const uploadEle = document.querySelector('.upload') as HTMLButtonElement
const fileEle = document.querySelector('.file') as HTMLInputElement
uploadEle.addEventListener('click', () => {
    const files = fileEle.files
    if (!files || files.length == 0) return
    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('parentId', '0')
    const xhr = new XMLHttpRequest()
    xhr.open('post', '/upload', true)
    xhr.send(formData)
})