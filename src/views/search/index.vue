<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
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
    <search-history v-else />
    <!-- /搜索历史纪录 -->

  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      // 控制搜索结果的显示不
      isResultShow: false

    }
  },
  computed: {},
  watch: {

  },
  created () { },
  methods: {
    onSearch (val) {
      this.searchText = val
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
  .van-search__action {
    color: #fff;
  }
}
</style>
