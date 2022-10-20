module.exports = {
  extends: '@orca-fe',
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@orca-fe/hooks', './packages/hooks/src'],
          ['@orca-fe/pocket', './packages/pocket/src'],
          ['@orca-fe/tools', './packages/tools/src'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'max-len': ['error', 160],
  },
};
