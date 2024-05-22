'use strict';

var Fragment = Symbol("Fragment");
var Text = Symbol("Text");
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    // 组件 + children object
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string" ?
        1 /* ELEMENT */ :
        2 /* STATEFUL_COMPONENT */;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    var slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);


const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    })
};

const captitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};  

const toHandlerKey = (str) => {
    return str ? "on" + captitalize(camelize(str)) : "";
};

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        // if (key in setupState) {
        //     return setupState[key];
        // }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

function initSlots(instance, children) {
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
    // instance.slots = Array.isArray(children) ? children: [children];
}
function normalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        slots[key] = function (props) { return normalizeSlotValue(value(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

const extend = Object.assign;

const isObject = (val) => {
    return val !== null && typeof val === "object";
};

var targetMap = new Map();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.schedular) {
            effect_1.schedular();
        }
        else {
            effect_1.run();
        }
    }
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonly$1 = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        var res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn("key: " + key + " set \u5931\u8D25 \u56E0\u4E3A target \u662F readonly", target);
        return true;
    }
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonly$1
});

function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}
function createActiveObject(raw, baseHandlers) {
    if (isObject(raw)) {
        console.warn("target " + raw + "\u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61");
        return raw;
    }
    return new Proxy(raw, baseHandlers);
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log("event", event);
    // instance.props -> event
    var props = instance.props;
    var handlerName = toHandlerKey(event);
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
    // TPP
    // 先写一个特定的行为 -》重构成通用的行为 
}

function createComponentInstance(vnode, parent) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: {},
        parent: parent ? parent.provides : {},
        emit: function () { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // todo
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance); // 初始化一个有状态的component (无状态的就是函数组件)
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({
        _: instance
    }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        setCurrentInstance(instance);
        // 可以返回function,也可以返回object
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // todo function
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}
var currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    // 中间层的概念，后续如果出现错误，只要调查这个就可以
    currentInstance = instance;
}

function provide(key, value) {
    // 存
    // key value
    var currentInstance = getCurrentInstance(); // provide inject必须在setup中使用
    if (currentInstance) {
        var provides = currentInstance.provides;
        var parentProvides = currentInstance.parent.provides;
        // init
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    // 取
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var parent_1 = currentInstance.parent;
        var parentProviders = parent_1.provides;
        if (key in parentProviders) {
            return parentProviders[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount: function (rootContainer) {
                // 先转换成虚拟节点vnode
                // component -> vnode
                // 后续所有操作都基于vnode操作
                var vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

function createRenderer(options) {
    var createElement = options.createElement, patchProp = options.patchProp, insert = options.insert;
    function render(vnode, container) {
        // patch
        patch(vnode, container, null);
    }
    function patch(vnode, container, parentComponent) {
        // 去处理组件
        // 1.先判断组件是什么类型
        // todo 判断vnode是不是一个element
        // 是element就应该处理element
        var type = vnode.type, shapeFlag = vnode.shapeFlag;
        // Fragment -> 只渲染children
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    // h函数时候
                    processElement(vnode, container, parentComponent);
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    processComponent(vnode, container, parentComponent);
                }
                break;
        }
    }
    function processText(vnode, container) {
        var children = vnode.children;
        var textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processFragment(vnode, container, parentComponent) {
        mountChildren(vnode, container, parentComponent);
    }
    function processElement(vnode, container, parentComponent) {
        mountElement(vnode, container, parentComponent);
    }
    function processComponent(vnode, container, parentComponent) {
        mountComponent(vnode, container, parentComponent);
    }
    function mountElement(vnode, container, parentComponent) {
        var el = (vnode.el = createElement(vnode.type));
        var children = vnode.children, props = vnode.props, shapeFlag = vnode.shapeFlag;
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            // string
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
            mountChildren(vnode, el, parentComponent);
        }
        // props
        for (var key in props) {
            var val = props[key];
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
        vnode.children.forEach(function (v) {
            patch(v, container, parentComponent);
        });
    }
    function mountComponent(vnode, container, parentComponent) {
        var instance = createComponentInstance(vnode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, vnode, container);
    }
    function setupRenderEffect(instance, vnode, container) {
        var proxy = instance.proxy;
        var subTree = instance.render.call(proxy);
        // vnode
        patch(subTree, container, instance);
        vnode.el = subTree.el;
    }
    return {
        createApp: createAppAPI(render)
    };
}

function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, val) {
    var isOn = function (key) { return /^on[A-Z]/.test(key); };
    if (isOn(key)) {
        var event_1 = key.slice(2).toLowerCase();
        el.addEventListener(event_1, val);
    }
    else {
        el.setAttribute(key, val);
    }
}
function insert(el, parent) {
    parent.append(el);
}
var renderer = createRenderer({
    createElement: createElement,
    patchProp: patchProp,
    insert: insert,
});
function createApp() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return renderer.createApp.apply(renderer, args);
}

exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.renderSlots = renderSlots;
