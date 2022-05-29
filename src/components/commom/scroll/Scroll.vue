<template>
  <!-- ref/children -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BetterScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import ObserveDom from '@better-scroll/observe-dom'

BetterScroll.use(Pullup)
BetterScroll.use(ObserveDom)

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
    }
  },
  mounted() {
    // 1.创建BetterScroll对象
    this.scroll = new BetterScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
      click: true,
      observeDOM: true
    })
    // 2.监听滚动的位置
      // this.scroll.on('scroll', (position) => {
      //   // console.log(position);
      //   this.$emit('scroll', position)
      // })
  
    // 3.监听上拉事件
    // if (this.pullUpLoad) {
    //   this.scroll.on('pullingUp', () => {
    //     // console.log('上拉加载更多')
    //     this.$emit('pullingUp')
    //   })
    // }
  },
  updated() {
    // 2.监听滚动的位置
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        this.$emit('scroll', position)
      })
    // 3.监听上拉事件
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        // console.log('上拉加载更多')
        this.$emit('pullingUp')
      })
    }

    

  },
  methods: {
    scollTo(x, y, time=500) {
      this.scroll && this.scroll.scollTo && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  },
}
</script>

<style></style>
