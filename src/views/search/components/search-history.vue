<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <!-- props 只能读不能改 受父组件影响 searchHistories = []不行
        可行
        "$emit('clear-search-histories')
        "searchHistories.splice(0)""-->
        <span @click="$emit('clear-search-histories')
        ">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon
        v-else
        name="delete-o"
        @click="isDeleteShow = true"
      />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon
        name="close"
        v-show="isDeleteShow"
      />
    </van-cell>

  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'SearchHistory',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    // props 数据
    // 如果是普通数据（数字，字符串、布尔值）绝对不能修改
    // 即便改了也不会传导给父组件
    // 如果是引用数据(数组,对象)
    // 可以修改,例如 [].push
    // 不能重新赋值， xxx=[]
    searchHistories: {
      type: Array,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      isDeleteShow: false
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
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
