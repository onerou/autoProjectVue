export default {
	getLoginS(state) {
		return state.loginShow
	},
	getLoginH(state) {
		return state.loginHide
	},
	getUserType(state) {
		return state.userType
	},
	getDeviceFloating(state) {
		return state.deviceFloating
	},
	getInstructionFloating(state) {
		return state.instructionFloating
	},
	getPlanFloating(state) {
		return state.planFloating
	},
	getWarnFloating(state) {
		return state.warnFloating
	},
	getStatisticsFloating(state) {
		return state.statisticsFloating
	},
	getCount(state) {
		return state.count
	}
}
