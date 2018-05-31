<!--
  省市区插件 author dengwb
  value 展示隐藏
  data 省市区json
  city 默认参数 支持code 、name
  另提供setCurr 二次修改
 -->
<template>
  <div>
    <div :class="['area_mask', areaMashShow]"></div>
    <div :class="['area_ctrl', areaCtrlShow]">
      <div class="area_btn_box">
        <div class="area_btn larea_cancel" @click="close">取消</div>
        <div class="area_btn larea_finish" @click="finish">确定</div>
      </div>
      <div class="area_roll_mask">
        <div class="area_roll">
          <div v-for="(arrs, index) in currArr" :key="index">
            <div @touchstart.stop.prevent="gearTouchStart($event, index)"
                 @touchmove.stop.prevent="gearTouchMove($event, index)"
                 @touchend.stop.prevent="gearTouchEnd($event, index)"
                 :style="{'-webkit-transform': 'translate3d(0, '+ arrs.y +'em, 0)'}"
                 class="gear">
              <div class="tooth" v-for="(item, index) in arrs.data" :key="index">{{item.n}}</div>
            </div>
            <div class="area_grid"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dwbCity',
  props: {
    value: Boolean,
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    city: Array
  },
  data () {
    return {
      cityData: this.data,
      isLoad: false,            // 是否展示
      vals: this.city,          // 参数
      index: 0,
      transY: [0, 0, 0],        // 记录滑动位置距离
      startTop: [0, 0, 0],      // 记录开始滑动位置
      endTop: [0, 0, 0],        // 记录开始滑动位置
      valIndex: [0, 0, 0],      // 记录数组下标
      startScreenY: [0, 0, 0],  // 记录开始屏幕距离
      endScreenY: [0, 0, 0],    // 记录结束屏幕距离
      startTime: [0, 0, 0],     // 记录开始时间戳
      endTime: [0, 0, 0],       // 记录结束时间戳
      speed: [0, 0, 0],         // 记录速度
      interval: [],
      currArr: []
    }
  },
  computed: {
    areaMashShow () {
      return this.value ? 'area_mask_show' : ''
    },
    areaCtrlShow () {
      return this.value ? 'area_ctrl_show' : ''
    }
  },
  methods: {
    gearTouchStart (event, index) {
      this.startScreenY[index] = event.targetTouches[0].screenY
      this.startTime[index] = Date.now()
      this.startTop[index] = this.endTop[index]
    },
    gearTouchMove (event, index) {
      this.endScreenY[index] = event.targetTouches[0].screenY
      this.endTime[index] = Date.now()
      const moveY = (this.endScreenY[index] - this.startScreenY[index]) * 18 / 370
      this.transY[index] = this.startTop[index] + moveY
      this.currArr[index].y = this.endTop[index] = this.transY[index]
    },
    gearTouchEnd (event, index) {
      const flag = (this.startScreenY[index] - this.endScreenY[index]) / (this.startTime[index] - this.endTime[index])
      if (Math.abs(flag) <= 0.2) {
        this.speed[index] = flag < 0 ? -0.08 : 0.08
      } else if (Math.abs(flag) <= 0.5) {
        this.speed[index] = flag < 0 ? -0.16 : 0.16
      } else {
        this.speed[index] = flag / 2
      }
      if (!this.transY[index]) {
        this.transY[index] = 0
      }
      this.rollGear(index)
    },
    rollGear (index) {
      let d = 0
      let stopGear = false
      clearInterval(this.interval[index])
      this.interval[index] = setInterval(() => {
        let pos = this.transY[index]
        let speed = this.speed[index] * Math.exp(-0.03 * d++)
        pos += speed
        if (Math.abs(speed) <= 0.1) {
          speed = 0.1
          let b = Math.round(pos / 2) * 2
          if (Math.abs(pos - b) < 0.02) {
            stopGear = true
          } else if (pos > b) {
            pos -= speed
          } else {
            pos += speed
          }
        }
        if (pos > 0) {
          pos = 0
          stopGear = true
        }
        let minTop = -(this.currArr[index].data.length - 1) * 2
        if (pos < minTop) {
          pos = minTop
          stopGear = true
        }
        if (stopGear) {
          let gearVal = Math.abs(pos) / 2
          this.valIndex[index] = Math.round(gearVal)
          this.init(this.cityData, index, true)
          clearInterval(this.interval[index])
        }
        this.currArr[index].y = this.transY[index] = this.endTop[index] = pos
      }, 30)
    },
    /**
     * 关闭
     */
    close (event) {
      event.preventDefault()
      this.$emit('input', false)
    },
    setCurr (data) {
      this.isLoad = false
      this.vals = data
      this.init(this.cityData, undefined, true)
    },
    /**
     * 确定
     */
    finish () {
      const data = this.currArr.reduce((prev, curr, index) => {
        const city = curr.data[this.valIndex[index]]
        prev.push({ id: city.id, n: city.n })
        return prev
      }, [])
      this.$emit('change', data)
      this.$emit('input', false)
    },
    /**
     * 初始化参数
     * data[JSON] 省市区
     * index[Number] 下标
     * isReset[Boolean]
     */
    init (data, index, isReset) {
      this.currArr = isReset ? [] : this.currArr
      const dataLen = data ? data.length : 0
      // 下级重置
      if (index !== undefined && Math.round(this.startTop[index]) !== Math.round(this.endTop[index])) {
        for (let i = index + 1, len = 3; i < len; i++) {
          this.valIndex[i] = this.endTop[i] = this.transY[i] = 0
        }
      }
      if (dataLen > 0) {
        let childData = null
        // 插入值
        if (this.vals && !this.isLoad) {
          for (let i = 0, len = data.length; i < len; i++) {
            const param = /^[\u4e00-\u9fa5]/.test(this.vals[this.index]) ? data[i].n : +data[i].id
            if (String(param) === String(this.vals[this.index])) {
              childData = data[i].s
              this.valIndex[this.index] = i
              this.transY[this.index] = this.endTop[this.index] = -(2 * i)
              break
            }
          }
        } else {
          childData = data[this.valIndex[this.index]].s
        }

        this.currArr.push({
          data: data,
          y: this.transY[this.index]
        })
        this.index++
        if (this.index > this.valIndex.length - 1) {
          this.index = 0
          this.isLoad = true
          return
        }
        this.init(childData)
      }
    }
  },
  mounted () {
    if (this.data && this.data.length > 0) {
      this.init(this.data)
    } else {
      import('../assets/json/city.json').then(data => {
        this.cityData = data
        this.init(this.cityData)
      })
    }
    
  }
}
</script>

<style lang="less" scpoed>
.area_mask {
  position: fixed;
  width: 100%;
  opacity: 0;
  height: 100%;
  background-color: #000;
  top: 0;
  left: 0;
  z-index: -1;
}
div.area_mask_show {
  opacity: 0.7;
  z-index: 100;
}
.gearArea {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 18/75rem;
  background-color: rgba(0,0,0,0.2);
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow: hidden;
  -webkit-animation-fill-mode: both;
}
.area_ctrl {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 18/75rem;
  vertical-align: middle;
  background-color: white;
  color: #363837;
  margin: 0;
  height: auto;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  overflow: hidden;
  -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
  transition: transform 0.2s cubic-bezier(0, 0, 0.25, 1);
}
.area_ctrl_show {
  // display: none;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
// .slideInUp {
//   animation: slideInUp .3s ease-in;
//   -webkit-animation: slideInUp .3s ease-in
// }
// @-webkit-keyframes slideInUp {
//   from {
//     -webkit-transform: translate3d(0, 100%, 0);
//     transform:translate3d(0, 100%, 0);
//   }
//   to {
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0)
//   }
// }
.area_roll {
  display: -webkit-box;
  width: 100%;
  height: auto;
  overflow: hidden;
  font-weight: bold;
  background-color: transparent;
  -webkit-mask: -webkit-gradient(linear, 0% 50%, 0% 100%, from(#debb47), to(rgba(36,142,36,0)));
  -webkit-mask: -webkit-linear-gradient(top, #debb47 50%, rgba(36,142,36,0));
}
.area_roll > div {
  font-size: 1.6em;
  // height: 6em;
  height: 10em;
  float: left;
  background-color: transparent;
  position: relative;
  overflow: hidden;
  -webkit-box-flex: 1
}
.area_roll_mask {
  -webkit-mask: -webkit-gradient(linear, 0% 30%, 0% 0%, from(#debb47), to(rgba(36,142,36,0)));
  // -webkit-mask: -webkit-linear-gradient(bottom, #debb47 50%, rgba(36,142,36,0));
  padding: 0 0 3em 0
}
.area_grid {
  position: relative;
  // top: 2em;
  top: 4em;
  width: 100%;
  height: 2em;
  margin: 0;
  box-sizing: border-box;
  z-index: 0;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}
.area_roll > div:nth-child(3) .area_grid > div {
  left: 42%
}
.area_btn {
  color: #000;
  font-size: 1.6em;
  line-height: 1em;
  text-align: center;
  padding: .8em 1em;
}
.area_btn_box {
  display: -webkit-box;
  -webkit-box-pack: justify;
  -webkit-box-align: stretch
}
.gear {
  float: left;
  position: absolute;
  z-index: 9902;
  width: 5.5em;
  // margin-top: 2em;
  margin-top: 4em;
}
.area_roll > div .gear {
  width: 100%
}
.tooth {
  height: 2em;
  line-height: 2em;
  text-align: center;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
