import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
    input: "./index.ts",
    output: [
        {
            format: "cjs",
            file: "lib/reactivity.cjs.js"
        },
        {
            format: "es",
            file: "lib/reactivity.esm.js"
        },
    ],
    plugins: [
        typescript(),
        nodeResolve()
    ]
}