'use strict'
/*
 * @Author: hecheng
 * @Date: 2019-01-11 09:08:42
 * @LastEditors: hecheng
 * @LastEditTime: 2019-01-14 00:06:27
 */
import localStorage from './localStorage.js'
const windowdDB =
  window.indexedDB ||
  window.webkitIndexedDB ||
  window.mozIndexedDB ||
  window.msIndexedDB
export default class IndexedDB {
  constructor(IndexedDBName = 'test') {
    console.groupCollapsed('indexedDB方法')
    this.name = IndexedDBName
    this.dataBase = {}
    this.version = this.getVersion()
    this.result = {}
    this.table = {}
    this.tableStore = {}
    this.openIndexDB()
    this.onUpgradeNeeded()
    this.onSuccess(() => {})
    this.onError()
    console.groupEnd()
  }
  openIndexDB() {
    this.dataBase = windowdDB.open(this.name, this.version)
  }
  getVersion() {
    let version = localStorage.get('indexedDBversion') || 0
    version++
    localStorage.set('indexedDBversion', version)
    return version
  }
  onError() {
    // 打开或创建数据库失败
    this.dataBase.onerror = function(e) {
      console.log('e: ', e)
    }
  }
  onSuccess(callback) {
    // 打开或创建数据库成功
    let that = this
    this.dataBase.onsuccess = function(e) {
      that.dataBase = e.target.result
      callback(that)
      let tableStore = that.dataBase.transaction('psersonStore', 'readwrite')
      let store = tableStore.objectStore('psersonStore')
      store.getAll()
    }
  }
  async onUpgradeNeeded() {
    // 我们请求打开的数据库的版本号和已经存在的数据库版本号不一致的时候调用
    // 更新数据库时执行
    let that = this
    this.dataBase.onupgradeneeded = function(e) {
      that.dataBase = e.target.result
      if (!that.dataBase.objectStoreNames.contains('psersonStore')) {
        that.table = that.dataBase.createObjectStore('psersonStore', {
          keyPath: 'id'
        })
      }
    }
  }
  async deleteDataBase(name = this.name) {
    let that = this
    await that.dataBase.deleteDatabase(name)
    setTimeout(() => {
      that.dataBase.close()
      that.onClose()
    })
  }
  onClose() {
    this.dataBase.onerror = function() {
      console.log(this.name + '已关闭')
    }
  }

  storeAdd(data, storeName = 'psersonStore') {
    let that = this
    if (that.dataBase.transaction) {
      setTimeout(() => {
        let tableStore = that.dataBase.transaction([storeName], 'readwrite')
        let store = tableStore.objectStore(storeName)
        store.add(data)
      })
      return
    } else {
      this.dataBase.onsuccess = function() {
        let tableStore = that.dataBase.transaction([storeName], 'readwrite')
        let store = tableStore.objectStore(storeName)
        store.add(data)
      }
    }
  }
  storePut(storeName, data) {
    let store = this.tableStore.objectStore(storeName)
    store.add(data)
  }
  getTable() {
    this.store = this.dataBase.objectStore('oceaName')
    return this.dataBase.objectStore('students')
  }
  getData(callback, key, storeName = 'psersonStore') {
    let that = this
    if (that.dataBase.transaction) {
      setTimeout(() => {
        let tableStore = that.dataBase.transaction([storeName], 'readwrite')
        let store = tableStore.objectStore(storeName)
        let data = {}
        if (key) data = store.select(key)
        else data = store.getAll() //#endregion
        data.onsuccess = function() {
          callback(data.result)
        }
      })
    } else {
      this.dataBase.onsuccess = function() {
        let tableStore = that.dataBase.transaction([storeName], 'readwrite')
        let store = tableStore.objectStore(storeName)
        let data = {}
        if (key) data = store.select(key)
        else data = store.getAll() //#endregion
        data.onsuccess = function() {
          callback(data.result)
        }
      }
    }
  }
}
