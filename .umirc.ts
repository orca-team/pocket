import { defineConfig } from 'dumi';

let isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  base: '/orca-fe/',
  publicPath: '/orca-fe/',
  runtimePublicPath: true,
  title: 'Orca-team',
  hash: true,
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  // more config: https://d.umijs.org/config
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@orca-fe/pocket',
        libraryDirectory: isDev ? 'src' : 'lib',
        style: (name: string, file: Object) => {
          if (/@orca-fe\/pocket\/(src|lib|esm?)\/[^/]+/.test(name))
            return `${name}/style`;
          return false;
        },
      },
    ],
  ],
});
