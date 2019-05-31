// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import './index.less'
import '@/assets/icons/iconfont.css'
import { req } from './utils/http'
import '@/assets/iconfont/iconfont.css'
import vuescroll from 'vuescroll/dist/vuescroll'
import 'vuescroll/dist/vuescroll.css'
import '@/components/global'
// import echarts from 'echarts'
import apiUrl from '@/api/urlPath.js'
Vue.prototype.http = req
Vue.prototype.apiPath = apiUrl
// Vue.prototype.$echarts = echarts

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

// Vue.use(iView, {
// 	i18n: (key, value) => i18n.t(key, value)
// })
// Vue.use(TreeTable)
Vue.use(vuescroll, {
	ops: {
		mode: 'native',
		detectResize: true,
		bar: {
			keepShow: true,
			background: '#cecece',
			opacity: 0.5
		}
	} // 在这里设置全局默认配置
	// name: 'vueScroll' // 在这里自定义组件名字，默认是vueScroll
})
// Vue.use(VOrgTree)
Vue.use(iView)
/**
 * @description 注册admin内置插件
 */
// installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
// Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
// Vue.prototype.$config = config
/**
 * 注册指令
 */
// importDirective(Vue)
// Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	// i18n,
	store,
	render: (h) => h(App)
})
