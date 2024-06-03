import { generate } from "./generate";
import { baseParse } from "./parse";
import { transform } from "./transform";
import { transformElement } from "./transforms/transformElement";
import { transformExpression } from "./transforms/transformExpression";
import { transformText } from "./transforms/transformText";

export function baseCompile(template) {
    const ast = baseParse(template);
    transform(ast, {
        nodeTransforms: [
            transformExpression,
            transformElement,
            transformText
        ]
    })

    return generate(ast);
}