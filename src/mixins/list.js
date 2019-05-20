const list = {
    data() {
        return {
            // 这些东西我们在list中处理，就不需要在每个页面再去手动的做这个了。
            loading: false, // 伴随loading状态
            pageNo: 1, // 页码
            pageSize: 15, // 页长
            totalCount: 0, // 总个数
            pageSizes: [15, 20, 25, 30], //页长数
            pageLayout: 'total, sizes, prev, pager, next, jumper', // 分页布局
            list: []
        }
    },
    methods: {
        // 分页回掉事件
        handleSizeChange(val) {
            this.pageSize = val
                // todo
        },
        handleCurrentChange(val) {
            this.pageNo = val
                // todo
        },
        /**
         * 表格数据请求成功的回调 处理完公共的部分（分页，loading取消）之后把控制权交给页面
         * @param {*} apiResult 
         * @returns {*} promise
         */
        listSuccessCb(apiResult = {}) {
            return new Promise((reslove, reject) => {
                let tempList = [] // 临时list
                try {
                    this.loading = false
                        // TODO:
                        // 直接抛出
                    reslove(tempList)
                } catch (error) {
                    reject(error)
                }
            })
        },
        /**
         * 处理异常情况
         * ==> 简单处理  仅仅是对表格处理为空以及取消loading
         */
        listExceptionCb(error) {
            this.loading = false
            console.error(error)
        }
    },
    created() {
        // 这个生命周期是在使用组件的生命周期之前
        this.$nextTick().then(() => {
            // todo
        })
    }
}
export default list