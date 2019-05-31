import { req } from '@/utils/http'
import apiUrl from '@/api/urlPath.js'
export default {
	setLoginS({ commit }, value) {
		commit('SET_LOGINS', value)
	},
	setLoginH({ commit }, value) {
		commit('SET_LOGIN', value)
	},
	setDeviceFloating({ commit }, value) {
		commit('SET_DEVICE_FLOATING', value)
	},
	setInstructionFloating({ commit }, value) {
		commit('SET_INSTRUCTION_FLOATING', value)
	},
	setPlanFloating({ commit }, value) {
		commit('SET_PLAN_FLOATING', value)
	},
	setWarnFloating({ commit }, value) {
		commit('SET_WARN_FLOATING', value)
	},
	setStatisticsFloating({ commit }, value) {
		commit('SET_STATISTICS_FLOATING', value)
	},
	setCount({ commit }) {
		let path = apiUrl.warn.getWarnCount
		req.get(path).then((res) => {
			let data = res.data.data
			if (!data) return
			commit('SET_COUNT', data.count)
		})
	}
}
