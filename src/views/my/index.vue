<template>
  <div class="my-container">

    <!--已登录：用户信息  -->
    <div
      v-if="user"
      class="header user-info"
    >
      <div class="base-info">
        <div class="left">
          <van-image
            round
            fit="cover"
            class="avatar"
            :src="userInfo.photo"
          />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button
            size="mini"
            round
          >编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">互赞</span>
        </div>
      </div>
    </div>
    <!--/已登录：用户信息  -->
    <!-- 未登录 -->
    <div
      v-else
      class="header not-login"
    >
      <div
        class="login-btn"
        @click="$router.push('/login')"
      >
        <img
          class="mobile-img"
          src="~@/assets/mobile.png"
          alt=""
        >
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 未登录 -->

    <!-- 导航 -->
    <van-grid
      class="grid-nav mb-9"
      :column-num="2"
    >
      <van-grid-item class="grid-item">
        <i
          slot="icon"
          class="toutiao toutiao-shoucang"
        ></i>
        <span
          slot="text"
          class="text"
        >收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i
          slot="icon"
          class="toutiao toutiao-lishi"
        ></i>
        <span
          slot="text"
          class="text"
        >历史</span>
      </van-grid-item>

    </van-grid>
    <!-- /导航 -->

    <van-cell
      title="消息通知"
      is-link
    />
    <van-cell
      title="小智同学"
      class="mb-9"
      is-link
    />
    <van-cell
      v-if="user"
      title="退出登录"
      class="logout-cell"
      @click="onLogout"
    />

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
import { removeItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'MyIndex',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      userInfo: {}// 用户信息
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
    // 如果用户登陆了，则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo()
    }
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    onLogout () {
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹窗组件
      this.$dialog.confirm({
        title: '确认退出吗？'

      }).then(() => {
        // on confirm
        // 确认退出：清除登陆状态
        this.$store.commit('setUser', null)

        removeItem('TOUTIAO_USER')
      }).catch(() => {
        // on cancel
        console.log('取消执行这里')
      })
    },

    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      height: 130px;
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }

  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
