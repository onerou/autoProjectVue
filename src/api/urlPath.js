var http = ''
const flag = !(process.env.NODE_ENV === 'production')

const defaultIP = 'http://1.119.5.10:18080' //列表地址
// const defaultIP = 'http://172.16.40.70:9000' //列表地址
export default {
	login: {
		loginIn: (flag ? defaultIP : http) + '/operationManage/user/loginSelect',
		loginOut: (flag ? defaultIP : http) + '/operationManage/user/logout'
	},
	deviceList: {
		getDeviceList: (flag ? defaultIP : http) + '/operationManage/truck/findAllLicencePlate',
		getDeviceDetails: (flag ? defaultIP : http) + '/operationManage/truck/findCurrentTaskByLicenceId',
		getTrajectory: (flag ? defaultIP : http) + '/operationManage/truck/findRoutePlanningById', // 获取计划路线
		getTrackByTaskId: (flag ? defaultIP : http) + '/operationManage/truck/findTrackByTaskId', // 获取实际轨迹
		getDevicePosition: (flag ? defaultIP : http) + '/common/v1/position/getforequipment',
		nowDeviceDetails: (flag ? defaultIP : http) + '/operationManage/truck/findCurrentPoint',
		getUserById: (flag ? defaultIP : http) + '/operationManage/user/getUserById',
		findTaskThingByTaskId: (flag ? defaultIP : http) + '/operationManage/truck/findTaskThingByTaskId',
		findAllTaskCommand: (flag ? defaultIP : http) + '/operationManage/truck/findAllTaskCommand' // 获取指令信息
	},
	user: {
		getList: (flag ? defaultIP : http) + '/operationManage/user/findAllUser', //查询表格数据
		findUserType: (flag ? defaultIP : http) + '/operationManage/user/findUserType', //查询用户类型表
		fileUpload: (flag ? defaultIP : http) + '/operationManage/file/fileUpload', //上传头像
		registUser: (flag ? defaultIP : http) + '/operationManage/user/registUser', //添加用户
		updateUser: (flag ? defaultIP : http) + '/operationManage/user/updateUserInfo', //编辑用户
		delete: (flag ? defaultIP : http) + '/operationManage/user/batchDeleteUser' //删除用户
	},
	tool: {
		getList: (flag ? defaultIP : http) + '/operationManage/truck/findAll', //查询表格数据
		insert: (flag ? defaultIP : http) + '/operationManage/truck/insert', //添加工具
		findTrucekType: (flag ? defaultIP : http) + '/operationManage/truck/findTrucekType', //查询工具类型
		findTrucekGroup: (flag ? defaultIP : http) + '/operationManage/truck/findTrucekGroup', //查询工具分组信息
		update: (flag ? defaultIP : http) + '/operationManage/truck/update', //编辑工具
		delete: (flag ? defaultIP : http) + '/operationManage/truck/delete' //删除工具
	},
	route: {
		getList: (flag ? defaultIP : http) + '/operationManage/truck/findTrackByType', //查询表格数据
		findAllTracksType: (flag ? defaultIP : http) + '/operationManage/truck/findAllTracksType', //查询路线类型
		saveTrack: (flag ? defaultIP : http) + '/operationManage/truck/saveTrack', //添加路线
		updateTrackById: (flag ? defaultIP : http) + '/operationManage/truck/updateTrackById', //编辑路线
		delete: (flag ? defaultIP : http) + '/operationManage/truck/deleteTrackById' //删除路线
	},
	plan: {
		getList: (flag ? defaultIP : http) + '/operationManage/truck/findAllTask'
	},
	carrier: {
		getList: (flag ? defaultIP : http) + '/operationManage/truck/findAllThing', //查询表格数据
		saveThingInfo: (flag ? defaultIP : http) + '/operationManage/truck/saveThingInfo', //添加载物
		updateThingById: (flag ? defaultIP : http) + '/operationManage/truck/updateThingById', //编辑载物
		delete: (flag ? defaultIP : http) + '/operationManage/truck/deleteThingById' //删除载物
	},
	webSocket: {
		// path: 'ws:172.16.40.70:9000/ws'
		path: 'ws:1.119.5.10:18080/ws'
	},
	warn: {
		getWarnList: (flag ? defaultIP : http) + '/operationManage/truck/findAllTaskWarn',
		getWarnCount: (flag ? defaultIP : http) + '/operationManage/truck/findAllTaskWarnCount',
		updateWarnState: (flag ? defaultIP : http) + '/operationManage/truck/updateWarnState' // 操作
	},
	message: {
		sendMessage: (flag ? defaultIP : http) + '/common/v1/message/sendmsg'
	},
	search: {
		searchAll: (flag ? defaultIP : http) + '/operationManage/truck/find'
	}
}