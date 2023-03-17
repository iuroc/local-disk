import { FileDataRow } from '../../src/database'
import { stringify } from 'querystring'
import { ApiResponse } from '../../src/tool'
import Poncon from 'ponconjs'
document.body.ondragstart = () => false
const poncon = new Poncon()
poncon.setPageList(['home', 'upload', 'about'])
poncon.setPage('home', async (dom, args, data) => {
    if (!data.load) {
        await loadFileList()
        poncon.pages.home.data.load = true
    }
})
poncon.start()

function loadFileList(parentId: number = 0, page: number = 0, pageSize: number = 24) {
    return new Promise((resolve) => {
        const listEle = document.querySelector('.file-list') as HTMLDivElement
        if (page == 0) listEle.innerHTML = ''
        const xhr = new XMLHttpRequest()
        xhr.open('GET', './getList?' + stringify({
            parentId: parentId,
            page: page,
            pageSize: pageSize
        }), true)
        xhr.send()
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const data: ApiResponse = JSON.parse(xhr.responseText)
                if (data.code != 200) return alert(data.msg)
                let html = ''
                const list: FileDataRow[] = data.data
                list.forEach(item => {
                    let imgPath = item.is_dir == 1 ? './img/folder-solid.svg' : './img/file-regular.svg'
                    html += `<div class="col-sm-6 col-lg-4 col-xxl-3 mb-3">
                                <div class="file-list-item hover-shadow card card-body flex-row align-items-center"
                                title="${item.name}">
                                    <img class="icon" src="${imgPath}" alt="${['file', 'folder'][item.is_dir]}" height="35px" width="35px">
                                    <div class="fs-5 ms-3 text-truncate">${item.name}</div>
                                </div>
                            </div>`
                })
                listEle.innerHTML += html
                resolve(null)
            }
        }
    })
}