module.exports = {
  extends: '@orca-fe',
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@orca-fe/hooks', './packages/hooks/src'],
          ['@orca-fe/pocket', './packages/pocket/src'],
          ['@orca-fe/tools', './packages/tools/src'],
          ['@orca-fe/pdf-viewer', './packages/pdf-viewer/src'],
          ['@orca-fe/painter', './packages/painter/src'],
          ['@orca-fe/transformer', './packages/transformer/src'],
          ['@orca-fe/dnd', './packages/dnd/src'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/consistent-type-exports': ['error'],
    'max-len': ['error', 160],
    'react/jsx-max-depth': ['off'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
