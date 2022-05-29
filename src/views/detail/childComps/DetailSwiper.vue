<template>
  <div class="detail-swiper">
    <swiper>
      <swiper-item class="swiper-item" v-for="(item, index) in topImages" :key="index">
        <img :src="item" alt="">
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "@/components/commom/swiper";
export default {
  name: 'DetailSwiper.vue',
  props: {
    topImages: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  }
}
</script>

<style scoped>
  .swiper-item {
    height: 300px;
    overflow: hidden;
  }
</style>