import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
    input: "./index.ts",
    output: [
        {
            format: "cjs",
            file: "lib/runtime-core.cjs.js"
        },
        {
            format: "es",
            file: "lib/runtime-core.esm.js"
        },
    ],
    plugins: [
        typescript(),
        nodeResolve()
    ]
}