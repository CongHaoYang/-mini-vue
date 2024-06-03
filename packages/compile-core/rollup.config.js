import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
    input: "./src/index.ts",
    output: [
        {
            format: "cjs",
            file: "lib/compile-core.cjs.js"
        },
        {
            format: "es",
            file: "lib/compile-core.esm.js"
        },
    ],
    plugins: [
        typescript(),
        nodeResolve()
    ]
}