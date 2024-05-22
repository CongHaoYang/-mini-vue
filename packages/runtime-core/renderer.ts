import { ShapeFlags } from "./ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;

  function render(vnode, container) {
    // patch
    patch(vnode, container, null);
  }

  function patch(vnode, container, parentComponent) {
    // 去处理组件
    // 1.先判断组件是什么类型
    // todo 判断vnode是不是一个element
    // 是element就应该处理element
    const { type, shapeFlag } = vnode;

    // Fragment -> 只渲染children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // h函数时候
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        }
        break;
    }
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent);
  }

  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }

  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const el = (vnode.el = createElement(vnode.type));

    const { children, props, shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // string
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    // props
    for (const key in props) {
      const val = props[key];
      // 具体 -》通用
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if (isOn(key)) {
      //     const event = key.slice(2).toLowerCase();
      //     el.addEventListener(event, val);
      // } else {
      //     const val = props[key];
      //     el.setAttribute(key, val);
      // }
      patchProp(el, key, val);
    }

    // container.append(el);
    insert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }

  function mountComponent(vnode: any, container: any, parentComponent) {
    const instance = createComponentInstance(vnode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, vnode, container);
  }

  function setupRenderEffect(instance: any, vnode: any, container: any) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);

    // vnode
    patch(subTree, container, instance);

    vnode.el = subTree.el;
  }

  return {
    createApp: createAppAPI(render)
  }
}
