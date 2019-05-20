var http = ''
const flag = !(process.env.NODE_ENV === 'production')

const defaultIP = 'http://172.16.40.70:9000' //列表地址
export default {
	login: {
		loginIn: (flag ? defaultIP : http) + '/oceanview/login',
		loginOut: (flag ? defaultIP : http) + '/oceanview/logout'
	},
	deviceList: {
		getDeviceList: (flag ? defaultIP : http) + '/operationManage/truck/findAllLicencePlate',
		getDeviceDetails: (flag ? defaultIP : http) + '/operationManage/truck/findCurrentTaskByLicenceId',
		getTrajectory: (flag ? defaultIP : http) + '/operationManage/truck/findRoutePlanningById',
		getDevicePosition: (flag ? defaultIP : http) + '/common/v1/position/getforequipment',
		nowDeviceDetails: (flag ? defaultIP : http) + '/operationManage/truck/findCurrentPoint'
	},
	webSocket: {
		path: 'ws:cloud.piesat.cn/ws'
	}
}
