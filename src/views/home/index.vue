<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      fixed
    >
      <van-button
        round
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs
      v-model="active"
      animated
      swipeable
      class="channel-tabs"
    >
      <van-tab
        v-for="(channel, index) in channels"
        :key="index"
        :title="channel.name"
      >
        <!-- 频道的文章列表 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->

      </van-tab>

      <div
        slot="nav-right"
        class="placeholder"
      ></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :active="active"
        :my-channels="channels"
        @update-active="onUpdateActive"
      />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
// 1.导入获取频道列表的方法
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'HomeIndex',
  // 局部注册的组件
  components: {
    ArticleList,
    ChannelEdit
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      active: 0,
      // 4.定义数据接受频道列表
      channels: [],
      isChennelEditShow: false// 控制编辑频道弹出层的显示状态
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {
    // 3.调用获取频道列表
    this.loadChannels()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    // 2.定义加载频道列表数据的方法
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels

        let channels = []
        if (this.user) {
          // 已登录，请求获取线上的频道数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录,判断是否有本地的频道列表
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            // 有本地频道数据，则使用
            channels = localChannels
          } else {
            // 没有本地频道数据，则请求获取默认推荐的频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        // 将数据更新到组件中
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道列表数据失败！')
      }
    },

    onUpdateActive (index, isChennelEditShow = true) {
      // 更新激活的频道项
      this.active = index
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /* 添加tabs样式 */
  /deep/.channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      width: 100%;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.9;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
