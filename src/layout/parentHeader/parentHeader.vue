<template>
  <Layout style="height: 100%" class="main">
    <Header class="header-con">
      <header-bar :collapsed="collapsed">
        <user :user-avator="userAvator"/>
      </header-bar>
    </Header>
    <Layout>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <!-- <vue-scroll> -->
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
            <!-- </vue-scroll> -->
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'

import './main.less'
export default {
  name: 'Main',
  components: {
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    }
  },
  computed: {
    ...mapGetters(['errorCount']),
    tagNavList() {
      return this.$store.state.app.tagNavList
    },
    tagRouter() {
      return this.$store.state.app.tagRouter
    },
    userAvator() {
      return this.$store.state.user.avatorImgPath
    },
    cacheList() {
      const list = [
        'ParentView',
        ...(this.tagNavList.length
          ? this.tagNavList
              .filter(item => !(item.meta && item.meta.notCache))
              .map(item => item.name)
          : [])
      ]
      return list
    },
    menuList() {
      return this.$store.getters.menuList
    },
    local() {
      return this.$store.state.app.local
    },
    hasReadErrorPage() {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    // ...mapActions(['handleLogin', 'getUnreadMessageCount']),
    ...mapActions(['handleLogin']),
    turnToPage(route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange(state) {
      this.collapsed = state
    },
    handleCloseTag(res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick(item) {
      this.turnToPage(item)
    }
  },
  // watch: {
  //   $route(newRoute) {
  //     const { name, query, params, meta } = newRoute
  //     this.addTag({
  //       route: { name, query, params, meta },
  //       type: 'push'
  //     })
  //     this.setBreadCrumb(newRoute)
  //     this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
  //     this.$refs.sideMenu.updateOpenName(newRoute.name)
  //   }
  // },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    // this.setTagNavList()
    // this.setHomeRoute(routers)
    // this.addTag({
    //   route: this.$store.state.app.homeRoute
    // })
    // this.setBreadCrumb(this.$route)
    // 设置初始语言
    // this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   })
    // }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
