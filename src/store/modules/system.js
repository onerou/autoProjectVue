import { req } from '@/utils/http'
import apiUrl from '@/api/urlPath.js'
export default {
	namespaced: true,
	state: {
		data: [],
		userFormModal: false, //人员弹框
		userAddEditFlag: true, //人员弹框是添加还是编辑
		temp: {}, //人员编辑的数据
		isRefresh: false, //刷新页面
		carrierFormModal: false, //载物弹框
		carrierAddEditFlag: true, //载物弹框是添加还是编辑
		carrierTemp: {}, //载物编辑的数据
		toolFormModal: false, //工具弹框
		toolAddEditFlag: true, //工具弹框是添加还是编辑
		toolTemp: {}, //工具编辑的数据
		routeFormModal: false, //路线弹框
		routeAddEditFlag: true, //路线弹框是添加还是编辑
		routeTemp: {} //路线编辑的数据
	},
	getters: {
		getData(state) {
			return state.data
		},
		getUserModal(state) {
			return state.userFormModal
		},
		getUserAddEditFlag(state) {
			return state.userAddEditFlag
		},
		getTemp(state) {
			return state.temp
		},
		getIsRefresh(state) {
			return state.isRefresh
		},
		getCarrierModal(state) {
			return state.carrierFormModal
		},
		getCarrierFlag(state) {
			return state.carrierAddEditFlag
		},
		getCarrierTemp(state) {
			return state.carrierTemp
		},
		getToolModal(state) {
			return state.toolFormModal
		},
		getToolFlag(state) {
			return state.toolAddEditFlag
		},
		getToolTemp(state) {
			return state.toolTemp
		},
		getRouteModal(state) {
			return state.routeFormModal
		},
		getRouteFlag(state) {
			return state.routeAddEditFlag
		},
		getRouteTemp(state) {
			return state.routeTemp
		}
	},
	mutations: {
		GET_DATA(state, data) {
			state.data = data
		},
		GET_USER_MODAL(state, data) {
			state.userFormModal = data
		},
		GET_USER_ADD_EDIT_FLAG(state, data) {
			state.userAddEditFlag = data
		},
		GET_TEMP(state, data) {
			state.temp = data
		},
		GET_ISREFRESH(state, data) {
			state.isRefresh = data
		},
		GET_CARRIERS_MODAL(state, data) {
			state.carrierFormModal = data
		},
		GET_CARRIERS_FLAG(state, data) {
			state.carrierAddEditFlag = data
		},
		GET_CARRIERS_TEMP(state, data) {
			state.carrierTemp = data
		},
		GET_TOOL_MODAL(state, data) {
			state.toolFormModal = data
		},
		GET_TOOL_FLAG(state, data) {
			state.toolAddEditFlag = data
		},
		GET_TOOL_TEMP(state, data) {
			state.toolTemp = data
		},
		GET_ROUTE_MODAL(state, data) {
			state.routeFormModal = data
		},
		GET_ROUTE_FLAG(state, data) {
			state.routeAddEditFlag = data
		},
		GET_ROUTE_TEMP(state, data) {
			state.routeTemp = data
		}
	},
	actions: {
		updateData({ commit }) {
			console.assert(true, commit, req, apiUrl)
			// let path=apiUrl.system.getData
			// req.get(path).then(res=>{
			//     let data=res.data.data
			//     commit('GET_DATA',data)
			// })
		},
		setUserModal({ commit }, value) {
			commit('GET_USER_MODAL', value)
		},
		setUserFlag({ commit }, value) {
			commit('GET_USER_ADD_EDIT_FLAG', value)
		},
		setUserTemp({ commit }, value) {
			commit('GET_TEMP', value)
		},
		setIsRefresh({ commit }, value) {
			commit('GET_ISREFRESH', value)
		},
		setCarrierModal({ commit }, value) {
			commit('GET_CARRIERS_MODAL', value)
		},
		setCarrierFlag({ commit }, value) {
			commit('GET_CARRIERS_FLAG', value)
		},
		setCarrierTemp({ commit }, value) {
			commit('GET_CARRIERS_TEMP', value)
		},
		setToolModal({ commit }, value) {
			commit('GET_TOOL_MODAL', value)
		},
		setToolFlag({ commit }, value) {
			commit('GET_TOOL_FLAG', value)
		},
		setToolTemp({ commit }, value) {
			commit('GET_TOOL_TEMP', value)
		},
		setRouteModal({ commit }, value) {
			commit('GET_ROUTE_MODAL', value)
		},
		setRouteFlag({ commit }, value) {
			commit('GET_ROUTE_FLAG', value)
		},
		setRouteTemp({ commit }, value) {
			commit('GET_ROUTE_TEMP', value)
		}
	}
}
