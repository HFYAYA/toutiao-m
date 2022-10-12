//  PostCSS 配置文件
module.exports = {
  // 配置要使用的 PostCSS 插件
  plugins: {
    // 配置使用 autoprefixer 插件
    // 作用：生成浏览器 CSS 样式规则前缀

    // 'autoprefixer': { // autoprefixer 插件的配置
    //   // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 配置使用 postcss-pxtorem 插件
    // 作用：把 px 转为 rem
    'postcss-pxtorem': {
      // lib-flexible 的REM 失陪方案:把一行分为 10 份，每份就是十分之一
      // 所以 rootValue 应该设置为你的设计稿宽度的十分之一

      // 有没有更好的办法？
      //    如果是Vant 的样式，就按照 37.5 来转换
      // 如果是 我们自己的样式，就按照 75 来转换
      // 通过查悦文挡，我们发现rootValue 支持两种类型
      //       数字：固定的数值
      //        函数：可以动态处理返回
      //        posecss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
      // 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // rootValue: 75,
      // 配置要转换的 CSS 属性
      // * 表示所有
      propList: ['*'],

      // 配置不要转换的样式资源
      exclude: 'github-markdown.css'
    }
  }
}
