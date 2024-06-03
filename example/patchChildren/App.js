import { h } from "../../packages/runtime-dom/lib/guide-mini-vue.esm.js";

import ArrayToArray from "./ArrayToArray.js";

export default {
    name: "App",
    setup() {},
    render() {
        return h("div", {
            tId: 1
        }, [
            h("p", {}, "主页"),
            h(ArrayToArray)
        ])
    }
}