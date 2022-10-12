<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form
      class="search-form"
      action="/"
    >
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      :search-text="searchText"
      v-else-if="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史纪录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    />
    <!-- /搜索历史纪录 -->

  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'

import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {

  },
  data () {
    return {
      searchText: '',

      isResultShow: false, // 控制搜索结果的显示不

      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []// (本地) 存储历史记录
    }
  },
  computed: {},
  watch: {
    searchHistories (value) {
      // 同步到本地存储
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  created () { },
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val

      // 存储搜索历史纪录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 索引不等于-1 说明该关键词已经存在于搜索历史纪录里面，需要先删除
        this.searchHistories.splice(index, 1)
      }
      // 把该关键词 放在搜索历史数组
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }

}
</script>

<style scoped lang='less'>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
