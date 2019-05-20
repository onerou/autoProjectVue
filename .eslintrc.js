module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    worker: true,
    serviceworker: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  globals: {
    vue: true,
    AMap: true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //强制使用单引号
    quotes: ['error', 'single']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
