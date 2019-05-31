import { req } from '@/utils/http'
import apiUrl from '@/api/urlPath.js'
export default {
	namespaced: true,
	state: {
		deviceList: [],
		detailsShow: false,
		positionArr: [] // 设备定位数组
	},
	getters: {
		getDeviceList(state) {
			return state.deviceList
		},
		getDetailsShow(state) {
			return state.detailsShow
		},
		getPositionArr(state) {
			return state.positionArr
		}
	},
	mutations: {
		SET_DEVICE_LIST(state, data) {
			state.deviceList = data
		},
		CHANGE_DETAILS_SHOW(state, data) {
			state.detailsShow = data
		},
		CHANGE_POSITION_ARR(state, data) {
			state.positionArr = data
		}
	},
	actions: {
		updateData({ commit, dispatch }) {
			let path = apiUrl.deviceList.getDeviceList
			req.get(path).then((res) => {
				let data = res.data.data
				data.map((v) => {
					v.children = v.licences
					v.title = v.groupName
					v.children.map((item) => {
						item.title = item.licencePlate
					})
				})
				commit('SET_DEVICE_LIST', data)
				dispatch('getPosition', data)
			})
		},
		changeDetailsShow({ commit }, data) {
			commit('CHANGE_DETAILS_SHOW', data)
		},
		getPosition({ commit }, data) {
			let path = apiUrl.deviceList.getDevicePosition
			let arr = []
			let deviceArr = data.map((v) => {
				arr = [ ...arr, ...v.licences ]
			})
			let promiseArr = []
			arr.map((v) => {
				promiseArr.push(req.get(path, { equipment: v.licencePlate, appid: '21' }))
			})
			let positionArr = []
			Promise.all(promiseArr).then(function(values) {
				values.map((item, index) => {
					let data = item.data.data
					data.device = arr[index]
					positionArr.push(data)
				})
				commit('CHANGE_POSITION_ARR', positionArr)
			})
		}
	}
}
