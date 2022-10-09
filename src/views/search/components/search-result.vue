<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载！"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  // 组件名称
  name: 'SearchResult',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子
  created () { },

  mounted () { },
  // 组件方法
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页数l
          q: this.searchText// 查询关键词
        })

        /** if (Math.random() > 0.5) {
          JSON.parse('dfasgfd')
        } */

        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)

        // 3. 设置加载状态结束
        this.loading = false

        // 4. 判断数据是否加载完毕
        if (results.length) {
          // 如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        // 加载失败了 loading 也要关闭
        this.loading = false
      }

      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }

      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 1000)
    }
  }
}

</script>

<style scoped lang="less">
</style>
