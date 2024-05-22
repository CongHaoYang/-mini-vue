import { h, renderSlots, getCurrentInstance } from "../../packages/runtime-dom/lib/guide-mini-vue.esm.js";

export const Foo = {
    setup(props, {emit}) {
        const instance = getCurrentInstance();
        console.log("Foo", instance);


        const emitAdd = () => {
            console.log("emit Add")
            emit("Add", 1, 2)
            emit("add-foo", 1, 2)
        }
        
        return {
            emitAdd
        }
    },
    render() {
        // const btn = h("button", {
        //     onClick: this.emitAdd
        // }, "emitted")

        const foo = h("p", {}, "foo");

        console.log(this.$slots);
        const age = 18;
        return h("div", {}, [
            renderSlots(this.$slots, "header", {
                age
            }),
            foo, 
            renderSlots(this.$slots, "footer")
        ])
    }
}