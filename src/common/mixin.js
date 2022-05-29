import { debounce } from '@/common/utils'
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted: function () {
    const refresh = debounce(this.$refs.scroll.refresh, 500)
    this.itemImgListener = () => {
      // this.$refs.scroll.refresh()
      refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    // console.log('我是混入中的内容');
  },
}

import { POP, NEW, SELL } from './const'

export const backTopMixin = {
  data: function () {
    return {
      showBackTop: false,
    }
  },
  methods: {
    backTop: function () {
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
  },
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP,
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType)
    },
  },
}