module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  // plugins: [
  //   'svelte3',
  // ],
  // overrides: [
  //   {
  //     files: ['*.svelte'],
  //     processor: 'svelte3/svelte3',
  //     rules: {
  //       'import/first': 0,
  //       'import/no-duplicates': 0,
  //       'import/no-mutable-exports': 0,
  //       'import/prefer-default-export': 0,
  //     },
  //   },
  // ],
  rules: {
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: false }
    ]
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['app', './src'],
        ],
        extensions: ['.js', '.ts', '.svelte'],
      }
    },
  },
};
