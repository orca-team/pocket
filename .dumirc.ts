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
    '@orca-fe/antd-plus': resolve('packages', 'antd-plus', 'src'),
    '@orca-fe/tools': resolve('packages', 'tools', 'src'),
    '@orca-fe/transformer': resolve('packages', 'transformer', 'src'),
    '@orca-fe/dnd': resolve('packages', 'dnd', 'src'),
  },

  resolve: {
    atomDirs: [
      { type: 'component', dir: 'packages/pocket/src' },
      { type: 'antd-plus', dir: 'packages/antd-plus/src' },
      { type: 'hooks', dir: 'packages/hooks/docs' },
      { type: 'tools', dir: 'packages/tools/docs' },
      { type: 'pro-component/painter', dir: 'packages/painter/docs' },
      { type: 'pro-component/pdf-viewer', dir: 'packages/pdf-viewer/docs' },
      { type: 'pro-component/transformer', dir: 'packages/transformer/docs' },
      { type: 'pro-component/dnd', dir: 'packages/dnd/docs' },
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
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
  styles: [
    `
  body .dumi-default-hero-title { font-size: 100px; }
  body .dumi-default-sidebar { width: 230px; }
  .dumi-default-navbar { white-space: nowrap; }
  body .dumi-default-header-left { width: 230px; }
  `,
  ],
});
