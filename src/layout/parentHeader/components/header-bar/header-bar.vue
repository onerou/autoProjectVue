<template>
  <div class="header-bar">
    <!-- <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger> -->
    <!-- <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb> -->
    <div class="logo">
      <i>
        <span>
          <img src="@/assets/images/logo.png" alt>
        </span>
        <span>运输实时监控系统</span>
      </i>
    </div>
    <div class="custom-content-con">
      <slot></slot>
      <header-time :second="second" :date="date"></header-time>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import { parseTime } from '@/utils'
import './header-bar.less'
// import { clearInterval } from 'timers'
export default {
  name: 'HeaderBar',
  data() {
    return {
      second: '',
      date: '',
      t: {}
    }
  },
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    }
  },
  mounted() {
    let that = this
    that.getTime()
  },
  beforeDestroy() {
    clearInterval(this.t)
  },
  methods: {
    handleCollpasedChange(state) {
      this.$emit('on-coll-change', state)
    },
    getTime() {
      this.t = setInterval(() => {
        let time = new Date().getTime()
        this.date = parseTime(time, '{y}-{m}-{d}')
        this.second = parseTime(time, '{h}:{i}')
      }, 1000)
    }
  }
}
</script>
