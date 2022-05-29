<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar>
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!-- 商品的列表 -->
    <cart-list></cart-list>
    <!-- 底部汇总 -->
    <buttom-bar></buttom-bar>
  </div>
</template>

<script>
import NavBar from "@/components/commom/navbar/NavBar.vue";

import CartList from "@/views/cart/childComps/CartList.vue";
import ButtomBar from "@/views/cart/childComps/BottomBar.vue";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    ButtomBar
  },
  computed: {
    // cartLength() {
    //   return this.$store.getters.cartLength
    // }
    // ...mapGetters(['cartLength'])
    ...mapGetters({
      length: 'cartLength'
    })
  },
  
}
</script>

<style scoped> 
.cart {
  height: 100vh;
}
.nav-bar {
  color: white;
  background-color: var(--color-tint);
  font-weight: 700;
}
</style>

  