export default {
	data() {
		return {
			// 这些东西我们在list中处理，就不需要在每个页面再去手动的做这个了。
			loading: false, // 伴随loading状态
			currentPage: 1, // 页码
			pageSize: 5, // 页长
			total: 0, // 总个数
			pageSizes: [5, 10, 20, 25, 30], //页长数
			list: [],
			delModal: false,
			delApi: {
				url: '/del',
				data: 'id'
			},
			addModal: false
		}
	},
	methods: {
		open(name) {
			//打开录入的弹框
			this.selectDictionaryOfType()
			this[`${name}Modal`] = true
			if (this.$refs[name]) this.$refs[name].resetFields()
		},
		changePage(name = 'getList') {
			this.getList()
		},
		remove(row) {
			let obj = {}
			obj[this.delApi.data] = row[this.delApi.data]
			this.http.post(this.delApi.url, ...obj)
			this.delModal = false
			this.getList()
		},
		getList() {
			console.log('查询所有')
		},
		pageSizeChange(val) {
			this.pageSize = val
			this.getList()
		}
	},
	created() {
		this.getList()
	}
}