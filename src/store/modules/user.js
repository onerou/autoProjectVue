import { req } from '@/utils/http'
import apiUrl from '@/api/urlPath.js'
export default {
	namespaced: true,
	state: {
		data: [],
		avatorImgPath: 'https://placehold.it/40x40'
	},
	getters: {
		getData(state) {
			return state.data
		}
	},
	mutations: {
		GET_DATA(state, data) {
			state.data = data
		}
	},
	actions: {
		updateData({ commit }) {
			console.assert(true, commit, req, apiUrl)
			// let path=apiUrl.user.getData
			// req.get(path).then(res=>{
			//     let data=res.data.data
			//     commit('GET_DATA',data)
			// })
		}
	}
}
