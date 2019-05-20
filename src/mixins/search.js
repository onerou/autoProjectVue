export default {
    data() {
        return {
            search: {
                search1: ''
            }
        }
    },
    methods: {
        reset() {
            this.currentPage = 1
            this.pageSize = 5
            this.resetSearch()
            this.getList()
        },
        resetSearch() {
            let keys = Object.keys(this.search)
            keys.map(v => {
                this.search[v] = ''
            })
        },

    }
}