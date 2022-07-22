export default {
  esm: 'babel',
  cjs: 'babel',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  // pkgFilter: {
  //   include: ['@orca-fe/hooks', '@orca-fe/tools'],
  // },
};
