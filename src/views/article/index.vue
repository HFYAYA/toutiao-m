<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-bar"
      title="黑马头条"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <div class="main-wrap">
      <div
        v-if="loading"
        class="loading-wrap"
      >
        <!-- 加载中 -->
        <van-loading
          size="24px"
          color="#3296fa"
          vertical
        >加载中...</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div
        v-else-if="article.title"
        class="article-detail"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title
}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell
          class="user-info"
          center
          :border="false"
        >
          <van-image
            class="avatar"
            round
            slot="icon"
            fit="cover"
            :src="article.aut_photo"
          />
          <div
            slot="title"
            class="user-name"
          >{{ article.aut_name }}</div>
          <div
            slot="label"
            class="publish-date"
          >{{ article.pubdate | relativeTime}}</div>

          <!-- 模板中的 $event 是事件参数
          当我们传递给子组件的数据既要使用还要修改
          传递：props
            :is-followed="article.is_followed"
          修改：自定义事件@update-is_followed="article.is_followed = $event"
          简写方式： 在组件上使用 v-model
          相当于-
          :value="article.is_followed"
          @input="article.is_followed = $event"

          如果想需要修改 v-model 的规则名称，则可以通过子组件的model 属性来配置修改

          一个组件上只能使用一次 v-model
          如果有多个数据需要实现类似于 v-model 的效果，咋办嘞？
          可以使用属性的 .sync 修饰符-->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          />
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="followLoading"
          >已关注</van-button>
          <van-button
            v-else
            round
            class="follow-btn"
            type="info"
            color="#3269fa"
            size="small"
            icon="plus"
            @click="onFollow"
            :loading="followLoading"
          >关注</van-button> -->

        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        >这是文章内容</div>
        <van-divider>正文结束</van-divider>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            size="small"
            round
          >写评论</van-button>
          <van-icon
            class="comment-icon"
            name="comment-o"
            badge="123"
          />

          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />

          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- <van-button
            class="btn-item"
            icon="good-job-o"
          /> -->
          <van-icon
            name="share-o"
            color="#777777"
          ></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /文章内容 -->
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <!-- v-else-if="errStatus === 404" -->
      <div
        v-else-if="errStatus === 404"
        class="error-wrap"
      >
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除</p>
      </div>
      <!-- ./加载失败：404 -->

      <!-- 加载失败：其它未知错误 -->
      <div
        v-else
        class="error-wrap"
      >
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button
          class="retry-btn"
          @click="loadArticle"
        >点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误 -->

    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   // 起始位置
//   startPosition: 1,
//   onClose () {
//     // do domething
//     console.log('onclose')
//   }
// })

export default {
  // 组件名称
  name: 'ArticleIndex',
  // 局部注册的组件
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle
  },
  // 组件参数 接收来自父组件的数据
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      article: {}, // 文章详情
      loading: false, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      followLoading: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},

  created () {
    this.loadArticle()
  },

  mounted () { },
  updated () {
    this.previewImage()
  },
  // 组件方法
  methods: {
    async loadArticle () {
      // 展示loading 加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)

        // 测试代码
        // if (Math.random() > 0.5) {
        //   JSON.parse('dfasdfvcxvsdrgfvsdf')
        // }

        // xiamian undefined 数据驱动视图这件事不是立即
        this.article = data.data

        // 初始化图片点击预览 也可以在update
        // console.log(this.$refs['article-content'])
        // setTimeout(() => {
        //   this.previewImage()
        // }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('抱歉请求出错', err)
      }
      // 无论成功还是失败都要关闭loading
      this.loading = false
    },

    previewImage () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)

        // 给每个 img 注册点击事件，在处理函数中调用 预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从0开始
            startPosition: index

          })
        }
      })
    }

  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
