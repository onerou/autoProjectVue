const storage = window.localStorage
/**
 *获取键值
 * @param {*} name
 */
export function get(name) {
	return JSON.parse(storage.getItem(name))
}
/**
 *
 * 设置
 * @param {*} key
 * @param {*} val
 */
export function set(key, val) {
	storage.setItem(key, JSON.stringify(val))
}
/**
 *删除
 * @param {*} key
 * @param {*} val
 */
export function remove(key, val) {
	storage.removeItem(key, val)
}
/**
 *
 */
export function clear() {
	storage.clear()
}
/**
 *
 * @param {*} name
 */
export function getIndex(name) {
	return storage.key(name)
}
/**
 *
 */
export function getLength() {
	return storage.length
}

export default {
	set(key, val) {
		storage.setItem(key, JSON.stringify(val))
	},
	get(name) {
		return JSON.parse(storage.getItem(name))
	},
	remove(key, val) {
		storage.removeItem(key, val)
	},
	clear() {
		storage.clear()
	},
	getIndex(name) {
		return storage.key(name)
	},
	getLength() {
		return storage.length
	}
}
