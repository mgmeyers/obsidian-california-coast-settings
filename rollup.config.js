import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import { pluginDestination } from "./dev-config";

const output = [
  {
    input: "main.ts",
    output: {
      dir: ".",
      sourcemap: "inline",
      format: "cjs",
      exports: "default",
    },
    external: ["obsidian"],
    plugins: [typescript(), nodeResolve({ browser: true }), commonjs()],
  },
];

if (pluginDestination) {
  output.push({
    input: "main.ts",
    output: {
      dir: pluginDestination,
      sourcemap: "inline",
      format: "cjs",
      exports: "default",
    },
    external: ["obsidian"],
    plugins: [typescript(), nodeResolve({ browser: true }), commonjs()],
  });
}

export default output;
