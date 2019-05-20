const files = require.context('.', true, /\.js$/)
let configRouters = {}
/**
 * inject routers
 */
files.keys().forEach(key => {
    if (key === './index.js') return
    let name = key.slice(2, -3)
    // configRouters = configRouters.concat(files(key).default) // 读取出文件中的default模块
    configRouters[name] = files(key).default
})
export default configRouters // 抛出一个Vue-router期待的结构的数组