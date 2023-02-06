import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    output: 'es',
  },
  cjs: {
    output: 'lib',
    transformer: 'babel',
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        {
          libraryName: 'antd',
          style: true,
        },
      ],
    ],
  },
});
