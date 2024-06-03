import { h, ref } from "../../packages/runtime-dom/lib/guide-mini-vue.esm.js";

// 左侧对比
// a b c
// a b d e
// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "D" }, "D"),
//     h("div", { key: "E" }, "E"),
// ];

// 右侧对比
// a b c 
// d e b c
// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//     h("div", { key: "D" }, "D"),
//     h("div", { key: "E" }, "E"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ];

// 新的比老的长
// 左侧
// a b
// a b c
// i = 2 e1 = 1 e2 = 2
// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
// ];
// const nextChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
//     h("div", { key: "D" }, "D")
// ];

// 右侧
// a b
// c a b
// i = 0, e1 = -1, e2 = 0
// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
// ];
// const nextChildren = [
//     h("div", { key: "C" }, "C"),
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
// ];

// 老的比新的长
// 左侧
// (a b) c
// a b
// i = 2 e1 = 2 e2 = 1
// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
// ];

// 右侧
// a (b c)
// b c
// i = 2 e1 = 2 e2 = 1
// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ];

// 5. 对比中间部分

// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C", id: "c-prev" }, "C"),
//     h("div", { key: "D" }, "D"),
//     h("div", { key: "F" }, "F"),
//     h("div", { key: "G" }, "G"),
// ];
// const nextChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "E" }, "E"),
//     h("div", { key: "C", id: "c-next" }, "C"),
//     h("div", { key: "F" }, "F"),
//     h("div", { key: "G" }, "G"),
// ];

// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C", id: "c-prev" }, "C"),
//     h("div", { key: "E" }, "E"),
//     h("div", { key: "D" }, "D"),
//     h("div", { key: "F" }, "F"),
//     h("div", { key: "G" }, "G"),
// ];
// const nextChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "E" }, "E"),
//     h("div", { key: "C", id: "c-next" }, "C"),
//     h("div", { key: "F" }, "F"),
//     h("div", { key: "G" }, "G"),
// ];

// const prevChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C", id: "c-prev" }, "C"),
//     h("div", { key: "D" }, "D"),
//     h("div", { key: "E" }, "E"),
//     h("div", { key: "F" }, "F"),
//     h("div", { key: "G" }, "G"),
// ];
// const nextChildren = [
//     h("div", { key: "A" }, "A"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "E" }, "E"),
//     h("div", { key: "C", id: "c-prev" }, "C"),
//     h("div", { key: "D" }, "D"),
//     h("div", { key: "F" }, "F"),
//     h("div", { key: "G" }, "G"),
// ];

const prevChildren = [
    h("div", { key: "A" }, "A"),
    h("div", { key: "B" }, "B"),
    h("div", { key: "C", id: "c-prev" }, "C"),
    h("div", { key: "D" }, "D"),
    h("div", { key: "E" }, "E"),
    h("div", { key: "Z" }, "Z"),
    h("div", { key: "F" }, "F"),
    h("div", { key: "G" }, "G"),
];
const nextChildren = [
    h("div", { key: "A" }, "A"),
    h("div", { key: "B" }, "B"),
    h("div", { key: "D" }, "D"),
    h("div", { key: "C", id: "c-prev" }, "C"),
    h("div", { key: "Y" }, "Y"),
    h("div", { key: "E" }, "E"),
    h("div", { key: "F" }, "F"),
    h("div", { key: "G" }, "G"),
];

export default {
    name: "ArrayToArray",
    setup() {
        const isChange = ref(false);
        window.isChange = isChange;

        return {
            isChange
        }
    },
    render() {
        const self = this;

        return self.isChange === true ?
            h("div", {}, nextChildren) :
            h("div", {}, prevChildren)
    }
}