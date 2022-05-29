<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control @tabClick="tabClick" class="tab-control" :titles="['流行', '新款', '精选']" ref="tabControl1" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" @scroll="contentScroll" @pullingUp="loadMore" :pull-up-load="true" :probeType="3">
      <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control @tabClick="tabClick" :titles="['流行', '新款', '精选']" ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick"></back-top>
  </div> 
</template>

<script>
import HomeSwiper from '@/views/home/childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from '@/components/commom/navbar/NavBar.vue'
import TabControl from '@/components/content/tabControl/TabControl.vue'
import GoodsList from '@/components/content/goods/GoodsList.vue'
import Scroll from '@/components/commom/scroll/Scroll.vue'
import BackTop from '@/components/content/backTop/BackTop.vue'

import { getHomeMultidata, getHomeGoods } from '@/network/home.js'
import { itemListenerMixin } from "@/common/mixin";

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: 'pop',
      isShowBackTop: true,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    },
  },
  created() {
    // 网络请求相关方法
    // 1.请求多个数据
    this.getHomeMultidata()
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
    // // 1.图片加载完成的事件监听
    // const refresh = debounce(this.$refs.scroll.refresh, 500)
    // // 2.获取tabControl的offsetTop
    // // 所有的组件都有一个属性$el: 用于获取组件中的元素
    // // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    // // 3.监听item中图片加载完成
    // this.itemImgListener = () => {
    //   // this.$refs.scroll.refresh()
    //   refresh()
    // }
    // this.$bus.$on('itemImgLoad', this.itemImgListener)
  },
  activated() {
    this.$refs.scroll.scollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY);
    // 2.取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    // 事件监听相关的方法
    // 防抖动函数
    // debounce(func, delay) {
    //   let timer = null

    //   return function (...args) {
    //     if (timer) clearTimeout(timer)
    //     timer = setTimeout(() => [
    //       func.apply(this, args)
    //     ], delay)
    //   }
    // },
    swiperImgLoad() {
      // 所有的组件都有一个属性$el: 用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    loadMore() {
      console.log('加载更多')
      this.getHomeGoods(this.currentType)
    },
    contentScroll(position) {
      // position > 1000
      // 1.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000

      // 2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    backClick() {
      this.$refs.scroll.scollTo(0, 0, 500)
    },
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
        default:
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    // 网络请求相关方法
    // 1.请求多个数据
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.data.banner.list
        this.recommends = res.data.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.data.list)
        this.goods[type].page += 1

        this.$refs.scroll.finishPullUp()
      })
    },
  },
}
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */
/* .content {
  height: calc(100% - 93px);
  /* overflow: scroll; 
  overflow: hidden;
  margin-top: 44px;
} */
.tab-control {
  position: relative;
  z-index: 10;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  z-index: 9;
}

</style>
