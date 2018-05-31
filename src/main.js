import Vue from 'vue'
import DwbCity from './City'

new Vue({
  el: '#app',
  components: {
    DwbCity
  },
  data () {
    return {
      city: null,
      show: false,
      result: null,
      valA: '黑龙江省,佳木斯市,向阳区',
      valB: '110000,110100,110112'
    }
  },
  methods: {
    open () {
      this.show = true
    },
    getData (data) {
      this.result = data
    },
    openA () {
      this.$refs.city.setCurr(this.valA ? this.valA.split(',') : '')
      this.open()
    },
    openB () {
      this.$refs.city.setCurr(this.valB ? this.valB.split(',') : '')
      this.open()
    }
  }
})