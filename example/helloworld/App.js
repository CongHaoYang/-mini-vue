import { h, createTextVNode, getCurrentInstance } from "../../packages/runtime-dom/lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js"
// template最后会被编译成render函数
window.self = null;
export const App = {
    render() {
        window.self = this;
        return h("div", {
            id: "root",
            class: ["red", "hard"],
            onClick() {
                console.log("click");
            }
        },
        // $el -> 返回rootElement
        // "hi, " + this.msg
        // array -> object
        // [h(Foo, {}, [h("p", {}, "123"), h("p", {}, "456")])]
        [h(Foo, {}, {
            header: ({age}) => [
                h("p", {}, "header" + age),
                createTextVNode("你好呀")
            ], 
            footer: () => h("p", {}, "footer")
        })]
        // [
        //     h("div", {}, "hi" + this.msg),
        //     h(Foo, {
        //         count: 1,
        //         onAdd(a, b) {
        //             console.log("onAdd", a, b);
        //         },
        //         onAddFoo(a, b) {
        //             console.log("onAddFoo", a, b);
        //         }
        //     })
        // ]
        // [
        //     h("p", {
        //         class: "red"
        //     }, "hi"),
        //     h("p", {
        //         class: "blue"
        //     }, "mini-vue")
        // ]
        );
    },
    setup() {
        const instance = getCurrentInstance();
        console.log("App", instance);
        return {
            msg: "mini-vue"
        }
    }
}