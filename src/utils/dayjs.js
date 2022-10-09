import Vue from 'vue'
import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn' // ES 2015 (默认英文)加载中文语言包

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用相对时间的插件
dayjs.extend(relativeTime)

dayjs.locale('zh-cn') // 全局使用

// 定义一个全局过滤器，然后就可以在任何组建的模板中使用了
// 其实过滤器就相当于一个全局可用的方法（仅供模板使用）
// 参数1： 过滤器名称
// 参数2： 过滤器函数
// 使用方式：{{ 表达式 | 过滤器名称}}
// 管道符前面的表达式的结果会作为参数传递到过滤器函数中
// 过滤器的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

// dayjs() 获取当前最新时间
// console.log(dayjs().format('YYYY-MM-DD'))

// console.log(dayjs().from(dayjs('2020')))
// console.log(dayjs().from(dayjs('1990-01-01'), true))
// console.log(dayjs().fromNow())
// console.log(dayjs().to(dayjs('1990-01-01')))
// console.log(dayjs().toNow())
