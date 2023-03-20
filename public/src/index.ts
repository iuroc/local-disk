import { fileInfo } from '../../src/db'
import { stringify } from 'querystring'
import { ApiResponse, parseValue } from '../../src/util'
import Poncon from 'ponconjs'
document.body.ondragstart = () => false
const poncon = new Poncon()
/** 页面加载就绪记录 */
const LOAD: Record<string, boolean> = {}
poncon.setPageList(['home', 'upload', 'about', 'list'])
poncon.setPage('home', async () => {
    await loadFileList()
})
poncon.setPage('list', async (_dom, args) => {
    if (!args) return
    let parentId = parseValue(args[0], 'number')
    if (parentId === false) return
    await loadFileList(parentId, 0)
})
poncon.start()

/**
 * 加载文件列表
 * @param parentId 文件夹 ID
 * @param page 页码
 * @param pageSize 每页加载数量
 * @returns 
 */
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
                const list: fileInfo[] = data.data
                list.forEach(item => {
                    html += getHtml(item, parentId)
                })
                listEle.innerHTML += html
                resolve(null)
            }
        }
    })
}

/**
 * 获取列表项 HTML
 * @param item 列表项数据
 * @param parentId 文件所属文件夹 ID
 * @returns 列表项 HTML
 */
function getHtml(item: fileInfo, parentId: number) {
    let imgPath = item.is_dir == 1 ? './img/folder-solid.svg' : './img/file-regular.svg'
    let name = item.id == parentId ? '返回上一级' : item.name
    let id = item.id == parentId ? item.parent_id : item.id
    return `<div class="col-sm-6 col-lg-4 col-xxl-3 mb-3">
    <a class="file-list-item hover-shadow card card-body flex-row align-items-center"
    title="${name}" ${item.is_dir ? `href="#/list/${id}"` : ''}>
        <img class="icon" src="${imgPath}" alt="${['file', 'folder'][item.is_dir]}" height="35px" width="35px">
        <div class="fs-5 ms-3 text-truncate">${name}</div>
    </a>
</div>`
}