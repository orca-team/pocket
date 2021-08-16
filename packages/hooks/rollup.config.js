import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');
const d = pkg.dependencies || {};
const pd = pkg.peerDependencies || {};
const external = [...new Set([...Object.keys(d), ...Object.keys(pd)])];
console.log(external);

export default {
  input: 'src/index.ts',
  output: {
    file: 'index.esm.js',
    format: 'esm',
    name: 'pocket',
  },
  plugins: [
    resolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
    }),
    typescript({}),
    commonjs({}),
  ],
  external: ['@orca-fe/hooks', ...external],
};
