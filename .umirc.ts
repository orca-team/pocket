import { defineConfig } from 'dumi';
import fs from 'fs';

let isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  base: '/',
  publicPath: '/',
  runtimePublicPath: true,
  title: 'Orca-team',
  hash: true,
  favicon: '/orca-logo.png',
  logo: '/orca-logo.png',
  outputPath: 'docs-dist',
  mode: 'site',
  // more config: https://d.umijs.org/config
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@orca-fe/pocket',
        libraryDirectory: 'src',
        style: true,
        // style: (name: string, file: Object) => {
        //   if (/@orca-fe\/pocket\/(src|lib|esm?)\/[^/]+/.test(name))
        //     return `${name}/style`;
        //   return false;
        // },
      },
    ],
  ],
});
