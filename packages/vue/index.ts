export * from "runtime-dom";
export * from "compile-core";

import { registerRuntimeCompiler } from "compile-core";

import { baseCompile } from "compile-core";
import * as runtimeDom from "runtime-dom";

function compileToFunction(template) {
  const { code } = baseCompile(template);
  const render = new Function("Vue", code)(runtimeDom);
  return render;

//   function renderFunction(Vue) {
//     const {
//       toDisplayString: _toDisplayString,
//       openBlock: _openBlock,
//       createElementBlock: _createElementBlock,
//     } = Vue;

//     return function render(_ctx, _cache, $props, $setup, $data, $options) {
//       return (
//         _openBlock(),
//         _createElementBlock(
//           "div",
//           null,
//           "hi, " + _toDisplayString(_ctx.message),
//           1 /* TEXT */
//         )
//       );
//     };
//   }
}

registerRuntimeCompiler(compileToFunction);