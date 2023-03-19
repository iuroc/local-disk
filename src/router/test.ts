/**
 * 为元素绑定唯一事件并移除旧事件
 * @param element 需要操作的 DOM 对象
 * @param eventType 事件类型
 * @param handler 事件函数
 */
function bindOnce<K extends keyof HTMLElementEventMap>(
    element: ElementType,
    eventType: K,
    handler: EventHendler<K>
) {
    if (!element.events) element.events = {}
    const event = element.events[eventType]
    if (event) {
        element.removeEventListener(eventType, event)
        delete element.events[eventType]
    }
    element.addEventListener(eventType, handler)
    // 因为无法确定 eventType 的值，所以无法确定 events[eventType] 的类型
    // 所以要指定 events 的所有属性值的类型为固定的 EventHendler<K>
    // handler 的类型为 EventHendler<K>，events[eventType] 也为 EventHendler<K>
    let newEvent = element.events[eventType] as EventHendler<K>
    newEvent = handler
}
interface ElementType extends HTMLElement {
    events?: {
        [T in keyof HTMLElementEventMap]?: EventHendler<T>
    }
}

type EventHendler<T extends keyof HTMLElementEventMap>
    = (event: HTMLElementEventMap[T]) => void
