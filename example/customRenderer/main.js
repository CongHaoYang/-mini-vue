// vue3
import { createRenderer } from "../../packages/runtime-dom/lib/guide-mini-vue.esm.js";
import { App } from "./App.js";

let game = new PIXI.Application();
await game.init({ width: 500, height: 500 })

document.body.append(game.canvas);

const renderer = createRenderer({
    createElement(type) {
        if (type === "rect") {
            const rect = new PIXI.Graphics()
            .circle(100, 100, 50)
            .fill('red')

            return rect;
        }
    },
    patchProp(el, key, value) {
        el[key] = value;
    },
    insert(el, parent) {
        parent.addChild(el);
    }
})

renderer.createApp(App).mount(game.stage);