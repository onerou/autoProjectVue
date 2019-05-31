// import API from '@/api/api'
import axios from 'axios'
import {
	Message,
	Spin
} from 'iview'
import router from '@/router'
import cookie from './cookie'
//1.系统未登录之前的请求
const status = {
	400: '请求出现错误',
	401: '没有提供认证信息',
	403: '没有权限',
	404: '请求内容不存在',
	405: '请求方式错误',
	406: '请求的资源并不符合要求',
	408: '客户端请求超时',
	413: '请求体过大',
	415: '类型不正确',
	416: '请求的区间无效',
	500: '服务器错误',
	501: '请求还没有被实现',
	502: '网关错误',
	503: '服务暂时不可用',
	504: '服务连接失败',
	505: '请求的 HTTP 版本不支持'
}
// 创建axios实例
let cancel,
	promiseArr = {}
let msg = ''
const CancelToken = axios.CancelToken
const service = axios.create()
// service.defaults.withCredentials = true

function destroy(url) {
	delete promiseArr[url]
	if (!Object.keys(promiseArr).length) {
		Spin.hide()
	}
}
// request拦截器
service.interceptors.request.use(
	(config) => {
		// if (config.method == 'get') {
		//     config.data = true
		// }
		// config.headers['H-TOKEN'] = '111'
		// if (promiseArr[config.url]) {
		// 	promiseArr[config.url]('操作取消')
		// 	promiseArr[config.url] = cancel
		// } else {
		// 	promiseArr[config.url] = cancel
		// }
		// 添加全局的loading...
		let token = cookie.get('token')
		if (token) config.headers.Authorization = `${token}`
		if (!Object.keys(promiseArr).length) {
			Spin.show() // 不建议开启，因为界面不友好
		}
		promiseArr[config.url] = true
		return config
	},
	(error) => {
		// Do something with request error
		// router.push({
		// 	path: '/login'
		// })
		console.log('error: ', error)
		return Promise.reject(error)
	}
)

// response 拦截器
service.interceptors.response.use(
	(response) => {
		const {
			data,
			status,
			url
		} = response
		destroy(url)
		/**
		 * code为非20000是抛错 可结合自己业务进行修改
		 */
		Spin.hide() // 不建议开启，因为界面不友好
		const res = response.data
		if (status && status !== 200) {
			console.log('res: ', res)
		}
		return {
			data,
			status
		}
	},
	(error) => {
		Spin.hide() // 不建议开启，因为界面不友好
		console.dir(error)
		Message.error(status[error.response.status])
		console.group(error.config.url)
		console.log(
			'%cdata：' + (error.response == undefined ? error.name : error.response.config.data),
			'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
		)
		console.log(
			'%cerror：' + (error.response ? error.response.data.error : error.message),
			'background-color:#DC5145;color:white;height:16px;border-radius:4px;padding:2px 4px;'
		)
		console.log(
			'%cstatus：' + (error.response ? error.response.status : error.code),
			'background-color:#FDCC41;color:white;height:16px;border-radius:4px;padding:2px 4px;'
		)
		console.log(
			'%cmessage：' + error.message,
			'background-color:#4D8BF2;color:white;height:16px;border-radius:4px;padding:2px 4px;'
		)
		console.log('%c-------------------------------------------------------------------', 'font-weight:700;')
		console.groupEnd()

		return Promise.reject(error)
	}
)
export const req = {
	//get请求
	get(url, param = {}) {
		delete param._rowKey
		delete param._index
		return new Promise((resolve, reject) => {
			service({
					method: 'get',
					url,
					params: param,
					cancelToken: new CancelToken((c) => {
						cancel = c
					})
				})
				.then((res) => {
					console.log('res: ', res)
					if (!res.data) {
						resolve(res)
						return
					}
					if ((res.data.code == 0 && res.status == 200) || res.data instanceof Array) {
						console.groupCollapsed(url + '  %cGET', 'font-weight:900;color:red;')
						if (res.data.result instanceof Array) {
							res.data.result.map((v) => {
								console.log(
									'%cdataObj：' + JSON.stringify(v, null, 2),
									'background-color:#fff;color:black;height:16px;border-radius:4px;padding:2px 4px;'
								)
							})
						} else if (res.data.result instanceof Array) {
							console.log(
								'%cdataObj：' + JSON.stringify(res.data.result, null, 2),
								'background-color:#fff;color:black;height:16px;border-radius:4px;padding:2px 4px;'
							)
						} else if (res.data.result instanceof String) {
							console.log(
								'%cdata：' + res.data.result,
								'background-color:#fff;color:black;height:16px;border-radius:4px;padding:2px 4px;'
							)
						} else {
							console.log(
								'%cdata：' + res.data.result,
								'background-color:#fff;color:black;height:16px;border-radius:4px;padding:2px 4px;'
							)
						}
						console.log(
							'%c-------------------------------------------------------------------',
							'font-weight:700;'
						)
						console.groupEnd()
						if (res.data.result instanceof String) {
							Message.success(res.data.result)
						}
						resolve(res)
					} else {
						Message.error(res.data.msg || '错误')
						reject(res.data.msg)
					}
				})
				.catch((error) => {
					if (process.env.NODE_ENV === 'production') return
					console.dir(error)
					console.group('%c' + url + '  GET', 'font-weight:900;color:red;')
					console.log(
						'%cdata：' + (error.response == undefined ? error.name : error.response.config.data),
						'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cerror：' + (error.response ? error.response.data.error : error.message),
						'background-color:#DC5145;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cstatus：' + (error.response ? error.response.status : error.code),
						'background-color:#FDCC41;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cmessage：' + error.message,
						'background-color:#4D8BF2;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%c-------------------------------------------------------------------',
						'font-weight:700;'
					)
					console.groupEnd()
					if (error.response) {
						msg = status[error.response.status]
					} else {
						msg = error.message
					}
					reject(error)
				})
		})
	},
	//post请求
	post(url, param = {}) {
		delete param._rowKey
		delete param._index
		return new Promise((resolve, reject) => {
			service({
					method: 'post',
					url,
					data: param
				})
				.then((res) => {
					// let urlList = url.split('/')
					// console.log("TCL: post -> url", )
					// if(urlList[urlList.length - 1]=='loginSelect'){

					// }
					console.log('res: ', res)
					if (
						(res.status == 200 && res.data && res.data.code == 0) ||
						(res.status == 200 && res.data == null)
					) {
						console.groupCollapsed('%c' + url + '  POST', 'font-weight:900;')
						if (res.data && res.data.result instanceof Array) {
							res.data.result.map((v) => {
								console.log(
									'%cdataObj：' + JSON.stringify(v, null, 2),
									'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
								)
							})
						} else if (res.data && res.data.result instanceof Object) {
							console.log(
								'%cdataObj：' + JSON.stringify(res.data.result, null, 2),
								'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
							)
						} else if (res.data && res.data.result instanceof String) {
							console.log(
								'%cdata：' + res.data.result,
								'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
							)
						} else if (res.data && res.data.result) {
							console.log(
								'%cdata：' + res.data.result,
								'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
							)
						}
						console.log(
							'%c-------------------------------------------------------------------',
							'font-weight:700;'
						)
						console.groupEnd()
						if ((res.data && typeof res.data.result == 'string') || (res.data && res.data.msg)) {
							Message.success(res.data.result || res.data.msg)
						}
						resolve(res)
					} else {
						Message.error(res.data.msg || '错误')
						resolve(res)
						reject(res.data.msg)
					}
				})
				.catch((error) => {
					if (process.env.NODE_ENV === 'production') return
					console.dir(error)
					console.group('%c' + url + '  POST', 'font-weight:900;color:red;')
					console.log(
						'%cdata：' + (error.response == undefined ? error.name : error.response.config.data),
						'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cerror：' + (error.response ? error.response.data.error : error.message),
						'background-color:#DC5145;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cstatus：' + (error.response ? error.response.status : error.code),
						'background-color:#FDCC41;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cmessage：' + error.message,
						'background-color:#4D8BF2;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%c-------------------------------------------------------------------',
						'font-weight:700;'
					)
					console.groupEnd()
					if (error.response) {
						msg = status[error.response.status]
					} else {
						msg = error.message
					}
					reject(error)
				})
		})
	},
	form(url, param = {}, type = 'post') {
		delete param._rowKey
		delete param._index
		let formData = new FormData()
		let keys = Object.keys(param)
		keys.map((v) => {
			formData.append(v, param[v])
		})
		return new Promise((resolve, reject) => {
			service({
					method: type,
					url,
					params: formData,
					data: formData
				})
				.then((res) => {
					console.log('res: ', res)
					if (
						(res.status == 200 && res.data && res.data.code == 0) ||
						(res.status == 200 && res.data == null)
					) {
						console.groupCollapsed('%c' + url + '  POST', 'font-weight:900;')
						if (res.data && res.data.result instanceof Array) {
							res.data.result.map((v) => {
								console.log(
									'%cdataObj：' + JSON.stringify(v, null, 2),
									'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
								)
							})
						} else if (res.data && res.data.result instanceof Object) {
							console.log(
								'%cdataObj：' + JSON.stringify(res.data.result, null, 2),
								'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
							)
						} else if (res.data && res.data.result instanceof String) {
							console.log(
								'%cdata：' + res.data.result,
								'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
							)
						} else if (res.data && res.data.result) {
							console.log(
								'%cdata：' + res.data.result,
								'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
							)
						}
						console.log(
							'%c-------------------------------------------------------------------',
							'font-weight:700;'
						)
						console.groupEnd()
						if ((res.data && typeof res.data.result == 'string') || (res.data && res.data.msg)) {
							Message.success(res.data.result || res.data.msg)
						}
						resolve(res)
					} else {
						Message.error(res.data.msg || '错误')
						resolve(res)
						reject(res.data.msg)
					}
				})
				.catch((error) => {
					if (process.env.NODE_ENV === 'production') return
					console.dir(error)
					console.group('%c' + url + '  POST', 'font-weight:900;color:red;')
					console.log(
						'%cdata：' + (error.response == undefined ? error.name : error.response.config.data),
						'background-color:#159E5C;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cerror：' + (error.response ? error.response.data.error : error.message),
						'background-color:#DC5145;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cstatus：' + (error.response ? error.response.status : error.code),
						'background-color:#FDCC41;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%cmessage：' + error.message,
						'background-color:#4D8BF2;color:white;height:16px;border-radius:4px;padding:2px 4px;'
					)
					console.log(
						'%c-------------------------------------------------------------------',
						'font-weight:700;'
					)
					console.groupEnd()
					if (error.response) {
						msg = status[error.response.status]
					} else {
						msg = error.message
					}
					reject(error)
				})
		})
	}
}