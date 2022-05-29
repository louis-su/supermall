<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probeType="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>

<script>
import DetailNavBar from '@/views/detail/childComps/DetailNavBar.vue'
import DetailSwiper from '@/views/detail/childComps/DetailSwiper.vue'
import DetailBaseInfo from '@/views/detail/childComps/DetailBaseInfo.vue'
import DetailShopInfo from '@/views/detail/childComps/DetailShopInfo.vue'
import DetailGoodsInfo from '@/views/detail/childComps/DetailGoodsInfo.vue'
import DetailParamInfo from '@/views/detail/childComps/DetailParamInfo.vue'
import DetailCommentInfo from '@/views/detail/childComps/DetailCommendInfo.vue'
import DetailBottomBar from '@/views/detail/childComps/DetailBottomBar.vue'

import Scroll from '@/components/commom/scroll/Scroll.vue'
import GoodsList from '@/components/content/goods/GoodsList.vue'
// import Toast from "@/components/commom/toast/Toast.vue";

import { getDetail, Goods, Shop, GoodsParam, getRecommned } from '@/network/detail'
import { itemListenerMixin } from '@/common/mixin'
import { debounce } from '@/common/utils'

import { mapActions } from "vuex";



export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: function() {},
      currentIndex: 0,
      // message: '',
      // show: false
    }
  },
  activated() {},
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid
    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // 1.获取顶部的图片轮播数据
      // console.log(res.data)
      const data = res.data.result
      this.topImages = res.data.result.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 3.创建店铺信息
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 6.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      // 给getThemeTopY赋值（对给this.getathemeTopY赋值的操作进行防抖）
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs)
      }, 200)
    })
    // 3.请求推荐数据
    getRecommned().then((res) => {
      this.recommends = res.data.data.list
    })
  },
  mounted() {},
  updated() {
    this.getThemeTopY()
  },
  destroyed() {
    // console.log('destroyed');
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },

  methods: {
    ...mapActions(['addCart']),
    titleClick(index) {
      // console.log(index)
      this.$refs.scroll.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y
      // 2.positionY和主题中值进行对比
      // for(let i in this.themeTopYs) {
      //   // console.log(i);
      //   i = parseInt(i)
      //   // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
      //   //   console.log(i);
      //   // }
      //   let length = this.themeTopYs.length

      //   // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i == length - 1 && positionY >= this.themeTopYs[i]))) {
      //   //   this.currentIndex = i
      //   //   // console.log(this.currentIndex);
      //   //   this.$refs.nav.currentIndex = this.currentIndex
      //   // }
      // }
      let length = this.themeTopYs.length
      for (let i = 0; i < length - 1; i++) {
        if (this.currentIndex !== i && i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
          // console.log(this.currentIndex)
        }
      }
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.nowPrice
      product.iid = this.iid

      // 2.将商品添加到购物车里(1.Promise 2.mapActions)
      // this.$store.commit('addCart', product)
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })
      this.addCart(product).then(res => {
      //   this.show = true
      //   this.message = res
      //   setTimeout(() => {
      //     this.show = false
      //     this.message = ''
      //   }, 1000);
      // console.log(res);
      // this.$toast.show(res, 200)
      // 3.添加到购物车成功
        console.log(this.$toast);
        this.$toast.show(res)
      })
    },
  }
  
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 49px);
  overflow: hidden;
}
.detail-nav {
  position: relative;
  z-index: 9;
}
/* .back-top {
    position: fixed;
    right: 10px;
    bottom: 65px;
} */
</style>
