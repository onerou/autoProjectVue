<template>
  <div class="operationButtonsWapper">
    <div class="row search" title="搜索">
      <div class="overHidden" ref="overHidden" :class="{openSearch:isSearch}">
        <div class="reach">
          <div class="topIcon icon" @click="menuClick('secher')">
            <img src="@/assets/images/menu/search.png" alt>
          </div>
          <div class="input">
            <AutoComplete
              v-model="value"
              :data="data"
              @on-search="handleSearch1"
              @on-select="selectData"
              placeholder="请输入搜索条件"
              style="flex-grow: 1;height:100%;"
            >
              <div class="selectTitle">
                <span class="licencePlate">车牌号</span>
                <span>起始点</span>
                <span>终止点</span>
                <span>载物</span>
              </div>
              <Option v-for="(item,index) in data" :value="item.licencePlate" :key="index">
                <div class="selectRow">
                  <div class="optionRow licencePlate">{{item.licencePlate}}</div>
                  <div class="optionRow">{{item.starting_position.split('#')[0]}}</div>
                  <div class="optionRow">{{item.end_position.split('#')[0]}}</div>
                  <div class="optionRow">{{item.name || '未载货'}}</div>
                </div>
              </Option>
            </AutoComplete>
          </div>
          <div class="bottomIcon icon" @click="secherFn(false)">
            <img src="@/assets/images/menu/close.png" alt>
          </div>
        </div>
      </div>
    </div>
    <div class="row" title="数据" @click="menuClick('data')">
      <img src="@/assets/images/menu/data.png" alt>
    </div>
    <div class="row" title="设备运输" @click="menuClick('device')">
      <img src="@/assets/images/menu/device.png" alt>
    </div>
    <div class="row" title="预警" @click="menuClick('warn')">
      <Badge :count="getCount" class-name="warnBadge" overflow-count="999">
        <img src="@/assets/images/menu/warn.png" alt>
      </Badge>
    </div>
    <div class="row" title="指令" @click="menuClick('instruction')">
      <img src="@/assets/images/menu/instruction.png" alt>
    </div>
    <!-- <div class="row" title="计划" @click="menuClick('allList')">
      <img src="@/assets/images/menu/allList.png" alt>
    </div>-->
    <div class="row" title="切换视角">
      <img src="@/assets/images/menu/3D.png" alt>
    </div>
    <div class="row" title="全屏" @click="isFullFn">
      <img :src="isFull?full:exitFull">
    </div>
    <div class="row" title="指南针" @click="angleDefault">
      <img src="@/assets/images/menu/Compass.png" ref="compass" alt>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import full from '@/assets/images/menu/full.png'
import exitFull from '@/assets/images/menu/exitFull.png'
import { setInterval, clearInterval } from 'timers'
export default {
  name: 'operationButtons',
  props: ['map'],
  data() {
    return {
      menuList: [],
      isFull: true,
      full,
      exitFull,
      isSearch: false,
      value: '',
      data: [],
      t: {},
      selectColumns: [
        {
          title: '车牌',
          key: 'licencePlate',
          align: 'center'
        },
        {
          title: '起点',
          slot: 'starting_position'
        },
        {
          title: '终点',
          slot: 'end_position'
        },
        {
          title: '载物',
          slot: 'name'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCount'])
  },
  methods: {
    ...mapActions([
      'setDeviceFloating',
      'setInstructionFloating',
      'setPlanFloating',
      'setWarnFloating',
      'setStatisticsFloating',
      'setCount'
    ]),
    menuClick(val) {
      this.init(val)
      this.menuList[val]()
    },
    init(val) {
      let key = Object.keys(this.menuList)
      let that = this
      key.map(v => {
        if (v == val) return
        that.menuList[v](false)
      })
    },
    secherFn(flag = true) {
      this.$refs.overHidden.addEventListener('transitionend', function(e) {
        e.target.classList.toggle('overInherit')
      })
      this.value = ''
      this.isSearch = flag
    },
    setDeviceFloating(val) {
      this.$store.dispatch('setDeviceFloating', val)
    },
    setInstructionFloating(val) {
      this.$store.dispatch('setInstructionFloating', val)
    },
    setPlanFloating(val) {
      this.$store.dispatch('setPlanFloating', val)
    },
    angleDefault() {
      this.map.setPitch(0)
      this.map.easeTo({
        bearing: 0
      })
    },
    selectData(val) {
      this.$emit('searchData', this.data.filter(v => v.licencePlate == val)[0])
      this.secherFn(false)
    },
    handleSearch1(value) {
      let path = this.apiPath.search.searchAll
      let that = this
      this.http.get(path, { search: value }).then(res => {
        console.log('TCL: res', res)
        if (!res.data) return
        let data = res.data.data
        data.data.map(v => {
          v.id += ''
        })
        that.data = data.data
      })
    },
    isFullFn() {
      this.isFull ? this.fullScreen() : this.exitFullScreen()
      this.isFull = !this.isFull
    },
    fullScreen() {
      // 全屏
      var el = document.documentElement
      var rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen
      if (typeof rfs != 'undefined' && rfs) {
        rfs.call(el)
      } else if (typeof window.ActiveXObject != 'undefined') {
        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
        var wscript = new ActiveXObject('WScript.Shell')
        if (wscript != null) {
          wscript.SendKeys('{F11}')
        }
      }
    },
    exitFullScreen() {
      var el = document
      var cfs =
        el.cancelFullScreen ||
        el.webkitCancelFullScreen ||
        el.mozCancelFullScreen ||
        el.exitFullScreen
      if (typeof cfs != 'undefined' && cfs) {
        cfs.call(el)
      } else if (typeof window.ActiveXObject != 'undefined') {
        //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
        var wscript = new ActiveXObject('WScript.Shell')
        if (wscript != null) {
          wscript.SendKeys('{F11}')
        }
      }
    }
  },
  mounted() {
    this.menuList = {
      device: this.setDeviceFloating,
      instruction: this.setInstructionFloating,
      allList: this.setPlanFloating,
      warn: this.setWarnFloating,
      data: this.setStatisticsFloating,
      secher: this.secherFn
    }
    this.$store.dispatch('setCount')
    let that = this
    this.t = setInterval(function() {
      that.$store.dispatch('setCount')
    }, 2000)
    this.$nextTick(() => {
      let map = that.map
      map.on('rotate', function() {
        that.$refs.compass.style.transform = `rotate(${360 -
          map.getBearing()}deg)`
      })
    })
  },
  beforeDestroy() {
    this.init()
    clearInterval(this.t)
  },
  created() {}
}
</script>

<style lang="less">
.operationButtonsWapper {
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 60vh;
  position: fixed;
  top: 10vh;
  right: 36px;
  z-index: 99;
  overflow: visible;
  .operationButtonsWapper > div {
    position: relative;
  }
  .row {
    background: rgba(41, 43, 46, 0.8);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 50%;
    margin-bottom: 2vh;
    text-align: center;
    img {
      height: 80%;
      width: 80%;
      margin: auto;
    }
    &:nth-child(4) {
      img {
        transform: translateY(3px);
      }
    }
    &:nth-child(5) {
      img {
        transform: translateX(2px);
      }
    }
    // overflow: hidden;
    // padding: 5px;
    height: 32px;
    width: 32px;
  }
  .warnBadge {
    font-size: 12px;
    transform: translateX(50%) scale(0.8);
  }
  .search {
    width: 32px;
    height: 32px;
    overflow: inherit;
    position: relative;
    .selectTitle {
      display: flex;
      justify-content: space-around;
      padding: 7px 16px;
      font-weight: 900;
      .licencePlate {
        text-align: center;
      }
    }
    .licencePlate {
      min-width: 80px;
    }
    .selectRow {
      display: flex;
      justify-content: space-around;
      .licencePlate {
        min-width: 80px;
      }
    }
    .icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 32px;
    }
    .ivu-select-dropdown-list {
      min-width: 400px;
    }
    .overHidden {
      height: 100%;
      width: 100%;
      transition: all 0.5s;
      border-radius: 32px;
      position: absolute;
      overflow: hidden;
      right: 0;
      .reach {
        height: 100%;
        // padding: 5px;
        width: 200px;
        background: rgba(41, 43, 46, 0.8);
        display: flex;
        border-radius: 32px;
        overflow: hidden;
        justify-content: space-between;
        .icon {
          width: 32px;
          margin-left: 1px;
          img {
            width: 100%;
            height: 96%;
          }
        }
        input {
          .ivu-input-wrapper {
            height: 100%;
          }
          height: 32px;
          background: transparent;
          box-shadow: none;
          border: none;
          color: white;
        }
      }
    }
    .openSearch {
      width: 200px;
    }
    .overInherit {
      overflow: inherit;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
