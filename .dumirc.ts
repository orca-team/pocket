import { defineConfig } from 'dumi';
import { resolve } from 'path';

let isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  base: '/',
  publicPath: '/',
  runtimePublicPath: {},
  hash: true,
  favicons: ['/orca-logo.png'],
  outputPath: 'docs-dist',
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en', name: 'English' },
  ],
  alias: {
    '@orca-fe/hooks': resolve('packages', 'hooks', 'src'),
    '@orca-fe/painter': resolve('packages', 'painter', 'src'),
    '@orca-fe/pdf-viewer': resolve('packages', 'pdf-viewer', 'src'),
    '@orca-fe/pocket': resolve('packages', 'pocket', 'src'),
    '@orca-fe/tools': resolve('packages', 'tools', 'src'),
    '@orca-fe/transformer': resolve('packages', 'transformer', 'src'),
  },

  resolve: {
    atomDirs: [
      { type: 'component', dir: 'packages/pocket/src' },
      { type: 'hooks', dir: 'packages/hooks/src/docs' },
      { type: 'tools', dir: 'packages/tools/src/docs' },
      { type: 'pro-component/painter', dir: 'packages/painter/src' },
      { type: 'pro-component/pdf-viewer', dir: 'packages/pdf-viewer/src' },
      { type: 'pro-component/transformer', dir: 'packages/transformer/src' },
    ],
  },

  themeConfig: {
    name: 'Orca-team',
    logo: '/orca-logo.png',
    socialLinks: {
      github: 'https://github.com/orca-team/pocket',
    },
  },
  extraBabelIncludes: [/\.md/],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@orca-fe/pocket',
        libraryDirectory: '',
        // style: true,
        style: (name: string, file: Object) => {
          console.log(name);
          const matched = name.match(/@orca-fe\/pocket\/([^/]+)/);
          if (matched) {
            console.log(matched[1]);
            return resolve('packages', 'pocket', 'src', matched[1], 'style');
          }
          return false;
        },
      },
      'orca',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
  styles: [`body .dumi-default-hero-title { font-size: 100px; } body .dumi-default-sidebar { width: 230px; } .dumi-default-navbar { white-space: nowrap; }`],
});
