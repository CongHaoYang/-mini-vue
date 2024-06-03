import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from "./componentProps";
import { initSlots } from "./componentSlots";
import { shallowReadonly } from "reactivity";
import { emit } from "./componentEmit";
import { proxyRefs } from "reactivity";

export function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        next: null,
        props: {},
        slots: {},
        provides: {},
        parent: parent ? parent.provides : {},
        isMounted: false,
        subTree: {},
        emit: () => {}
    }

    component.emit = emit.bind(null, component) as any;

    return component;
}

export function setupComponent(instance) {
    // todo
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)

    setupStatefulComponent(instance); // 初始化一个有状态的component (无状态的就是函数组件)
}

function setupStatefulComponent(instance: any) {
    const Component = instance.type;

    instance.proxy = new Proxy({
        _: instance
    }, PublicInstanceProxyHandlers)

    const { setup } = Component;

    if (setup) {
        setCurrentInstance(instance);
        // 可以返回function,也可以返回object
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);

        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult: any) {
    // todo function
    if (typeof setupResult === "object") {
        instance.setupState = proxyRefs(setupResult);
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
    const Component = instance.type;

    if (compiler && !Component.render) {
        if (Component.template) {
            Component.render = compiler(Component.template);
        }
    }

    if (Component.render) {
        instance.render = Component.render;
    }
}

let currentInstance = null;

export function getCurrentInstance() {
    return currentInstance;
}

function setCurrentInstance(instance) {
    // 中间层的概念，后续如果出现错误，只要调查这个就可以
    currentInstance = instance;
}

let compiler;

export function registerRuntimeCompiler(_compiler) {
    compiler = _compiler;
}