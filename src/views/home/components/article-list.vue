<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载！"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  // 组件名称
  name: 'ArticleList',
  // 局部注册的组件
  components: {
    ArticleItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null,
      error: false, // 控制失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的loading失败状态
      refreshSuccessText: ''// 下拉刷新成功的提示文案
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () { },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    // onLoad () {
    //   // 异步更新数据1.请求获取数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     // 2. 把请求结果数据放到list数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }

    //     // 3.本次数据加载结束之后要把加载状态设置为结束
    //     //  loading 关闭以后才能触发下一次的加载更多
    //     this.loading = false

    //     // 4. 判断数据是否全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 1000)
    // }

    async onLoad () {
      try {
        // 异步更新数据1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // timestamp 简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1// 是否包含置顶
        })

        // 随机错误
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsdfgfghfj')
        // }
        // 2. 把请求结果数据放到list数组中
        const { results } = data.data
        // 数组的展开操作符，它会把数组元素一个一个拿出来
        this.list.push(...results)

        // 3.本次数据加载结束之后要把加载状态设置为结束
        //  loading 关闭以后才能触发下一次的加载更多
        this.loading = false

        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据全部加载完成
          // console.log(data)
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将 finished 设置为true,不再加载更多
          this.finished = true
        }
      } catch (err) {
        // console.log('请求失败！', err)
        // 展示错误提示状态
        this.error = true

        // 请求失败了，loading 也需要关闭
        this.loading = false
      }
    },
    // 当触发下拉刷新的时候调用该函数
    async onRefresh () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID

          timestamp: Date.now(), // 下拉刷线，每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1// 是否包含置顶
        })

        // 随机错误
        // if (Math.random() > 0.2) {
        //   JSON.parse('dsdfgfghfj')
        // }
        // 2. 把请求结果数据放到list数组中顶部
        const { results } = data.data

        this.list.unshift(...results)

        // 3.关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 4. 判断数据是否全部加载完成
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败！'

        this.isreFreshLoading = false
      }
    }
  }

}
</script>

<style scoped lang="less">
.article-list {
  // 百分比相对于父元素的
  height: 79vh;
  overflow-y: auto;
}
</style>
