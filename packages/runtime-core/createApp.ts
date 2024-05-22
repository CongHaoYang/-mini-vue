import { createVNode } from "./vnode";

export function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 先转换成虚拟节点vnode
                // component -> vnode
                // 后续所有操作都基于vnode操作
    
                const vnode = createVNode(rootComponent);
    
                render(vnode, rootContainer);
            }
        }
    }  
}
