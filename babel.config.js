module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 防止babel将任何模块类型都转译成CommonJS类型，导致tree-shaking失效问题
        modules: false,
        // 只导入需要的 polyfill
        useBuiltIns: 'usage',
        // 指定 corjs 版本
        corejs: 3,
        targets: {
          browsers: ['last 2 versions'], // 最近 2 个版本的浏览器
        },
      },
    ],
    // 转jsx
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  // @babel/runtime-corejs3 是辅助函数
  plugins: [
    // 开发库/工具、移除冗余工具函数(helper function)
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: {
          version: 3,
          proposals: true,
        },
        useESModules: true,
      },
    ],
  ],
  env: {
    development: {
      plugins: ['react-refresh/babel'],
    },
    production: {
      plugins: [
        // 函数组件中的变量提升到函数外来避免每次重新调用函数组件重复声明和没必要的垃圾回收
        '@babel/plugin-transform-react-constant-elements',
        // https://github.com/facebook/react/issues/3228
        '@babel/plugin-transform-react-inline-elements',
      ],
    },
  },
}
