import { fileInfo } from '../../src/db'
import { stringify } from 'querystring'
import { ApiResponse, parseValue } from '../../src/util'
import Poncon from 'ponconjs'
import { CONFIG } from './config'
document.body.ondragstart = () => false
const poncon = new Poncon()
/** 页面加载就绪记录 */
// const LOAD: Record<string, boolean> = {}
/** 页面数据存储 */
const DATA: Record<string, any> = {}
poncon.setPageList(['home', 'upload', 'about', 'list', 'file'])
poncon.setPage('home', async () => {
    await loadFileList()
})
poncon.setPage('list', async (_dom, args) => {
    if (!args) return
    let parentId = parseValue(args[0], 'number')
    if (parentId === false) return
    await loadFileList(parentId, 0)
})
poncon.setPage('upload', () => {
    document.title = '上传文件 - ' + CONFIG.siteName
})
poncon.start()

document.body.oncontextmenu = (event) => event.preventDefault()
/** 右键菜单面板 */
const menuEle = document.querySelector<HTMLDivElement>('.file-list-menu')
document.documentElement.onclick = (event) => {
    const targetEle = event.target as Element
    if (!targetEle.classList.contains('file-list-menu')) {
        if (menuEle) menuEle.style.display = 'none'
    }
}

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
                list.sort((a, b) => {
                    if (a.id === parentId) {
                        return -1;
                    } else if (b.id === parentId) {
                        return 1;
                    } else if (a.is_dir > b.is_dir) {
                        return -1;
                    } else if (a.is_dir < b.is_dir) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                let folderName = list[0].name
                document.title = `${parentId == 0 ? '' : `${folderName} - `}${CONFIG.siteName}`
                list.forEach(item => {
                    html += getHtml(item, parentId)
                })
                if (page == 0)
                    listEle.innerHTML = html
                else
                    listEle.innerHTML += html
                addEvent(listEle)
                resolve(null)
            }
        }
    })
}

/** 文件列表右键事件 */
function contextmenuEvent(event: MouseEvent) {
    event.preventDefault()
    if (!menuEle) return false
    let left = event.clientX
    let top = event.clientY
    menuEle.style.display = 'block'
    let maxLeft = window.innerWidth - menuEle.offsetWidth
    let maxTop = window.innerHeight - menuEle.offsetHeight
    if (left > maxLeft) left = maxLeft
    if (top > maxTop) top = maxTop
    menuEle.style.left = left + 'px'
    menuEle.style.top = top + 'px'
}

/**
 * 为文件列表的列表项增加事件
 * @param listEle 列表元素对象
 */
function addEvent(listEle: HTMLDivElement) {
    const eles = listEle.querySelectorAll<HTMLDivElement>('.file-list-item:not(.back)')
    eles.forEach(ele => {
        ele.addEventListener('contextmenu', contextmenuEvent)
    })
}
/**
 * 获取列表项 HTML
 * @param item 列表项数据
 * @param parentId 文件所属文件夹 ID
 * @returns 列表项 HTML
 */
function getHtml(item: fileInfo, parentId: number) {
    /** 当前列表项是否为返回上一级 */
    let ifBack = item.id == parentId
    let imgPath = ifBack ? './img/chevron-left-solid.svg' :
        item.is_dir == 1 ? './img/folder-solid.svg' : './img/file-regular.svg'
    let name = ifBack ? '返回上一级' : item.name
    let id = ifBack ? item.parent_id : item.id
    return `<div class="col-sm-6 col-lg-4 col-xxl-3 mb-3">
    <a class="file-list-item hover-shadow card card-body flex-row align-items-center ${ifBack ? 'back' : ''}"
    title="${name}" href="${item.is_dir ? `#/list/${id}` : `#/file/${id}`}">
        <img class="icon" src="${imgPath}" alt="${['file', 'folder'][item.is_dir]}" height="35px" width="35px">
        <div class="fs-5 ms-3 text-truncate">${name}</div>
    </a>
</div>`
}