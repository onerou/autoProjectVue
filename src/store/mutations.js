export default {
	SET_LOGINS(state, data) {
		state.loginShow = data
	},
	SET_LOGIN(state, data) {
		state.loginHide = data
	},
	SET_DEVICE_FLOATING(state, data = !state.deviceFloating) {
		state.deviceFloating = data
	},
	SET_INSTRUCTION_FLOATING(state, data = !state.instructionFloating) {
		state.instructionFloating = data
	},
	SET_PLAN_FLOATING(state, data = !state.planFloating) {
		state.planFloating = data
	},
	SET_WARN_FLOATING(state, data = !state.warnFloating) {
		state.warnFloating = data
	},
	SET_STATISTICS_FLOATING(state, data = !state.statisticsFloating) {
		state.statisticsFloating = data
	},
	SET_COUNT(state, data) {
		state.count = data
	}
}
