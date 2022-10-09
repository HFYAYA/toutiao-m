<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div
        slot="title"
        class="title-text"
      >我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid
      class="my-grid"
      :gutter="10"
    >
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >

        <!--
        v-bind:class 语法
        一个对象，对象中的key 表示要作用的 CSS 类名
        对象中的 value 要计算出布尔值
        true ，则作用该类名
        false， 不作用类名
       -->
        <van-icon
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span
          class="text"
          :class="{ active: index === active }"
          slot="text"
        >{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title">频道推荐</div>
    </van-cell>

    <van-grid
      class="recommend-grid"
      :gutter="10"
    >
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  // 组件名称
  name: 'ChannelEdit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0]// 固定频道，不允许删除
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user']),

    recommendChannels () {
      // 这是数组的filter 方法，遍历数组，把符合条件的元素存储到新数组（内部会定义一个数组）并返回
      return this.allChannels.filter(channel => {
        // const channels = []

        // 数组的 find 方法： 遍历数组。把符合条件的第一个元素返回
        return !this.myChannels.find(myChannel => myChannel.id === channel.id)
      })
      // return channels
    }

    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find 遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })

    //     // 如果我的频道中不包括该频道项，则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })

    //   // 把计算结果返回
    //   return channels
    // }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },

    async onAddChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理

      if (this.user) {
        try {
          // - 已登录，把数据请求接口存储到线上
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length // 序号(push后数组的长度)
          })
        } catch (err) {
          this.$toast('保存失败,请稍后重试!')
        }
      } else {
        // - 未登录，把数据则存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    // 点击我的频道
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 1）如果是固定频道，则不删除
        if (this.fiexdChannels.includes(index)) {
          return
        }
        // 如果编辑状态，执行删除频道
        // 2.删除
        this.myChannels.splice(index, 1)

        // 3.如果删除的激活频道之前的频道，则更新激活的频道项
        // 参数1： 言删除的元素的开始索引（包括）
        // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
        if (index <= this.active) {
          // 让激活的频道索引 - 1
          this.$emit('update-active', this.active - 1, true)
        }

        // 4. 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },

    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除频道失败,请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;

      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>
