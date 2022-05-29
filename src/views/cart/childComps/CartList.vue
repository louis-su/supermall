<template>
  <scroll class="content">
    <div class="cart-list">
      <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item"></cart-list-item>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/components/commom/scroll/Scroll.vue'
import CartListItem from './CartListItem'

import { mapGetters } from "vuex";

export default {
  name: 'CartList',
  components: {
    Scroll,
    CartListItem,
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  created() {
    // console.log(this.cartList);
  },
}
</script>

<style scoped>
  .content {
    height: calc(100% - 2.2rem - 2.45rem);
    overflow: hidden;
  }
</style>
