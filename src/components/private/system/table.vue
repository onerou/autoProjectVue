<template>
  <div class="table_box">
    <!--s 操作组 s-->
    <div class="search-con search-con-top">
      <div class="search_box">
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary" icon="md-search">搜索</Button>
      </div>
      <div class="btn_group">
        <Button type="primary" icon="md-add" @click="openAddModel">添加</Button>
        <Button type="error" icon="md-trash" @click="del">删除</Button>
      </div>
    </div>
    <!--e 操作组 e-->
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="columns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-selection-change="selChange"
    ></Table>
    <Page :total="total" :page-size="pageSize" :current="page" @on-change="pageChange"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Tables',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default() {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 表格类型
     */
    tableType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: '',
      total: 0,
      page: 1,
      pageSize: 13,
      idArrs: []
    }
  },
  computed: {
    ...mapGetters('system', ['getIsRefresh']),
    isRefresh() {
      return this.$store.getters['system/getIsRefresh']
    }
  },
  methods: {
    ...mapActions('system', [
      'setUserModal',
      'setUserFlag',
      'setIsRefresh',
      'setCarrierModal',
      'setCarrierFlag',
      'setToolModal',
      'setToolFlag',
      'setRouteModal',
      'setRouteFlag'
    ]),
    handleSearch() {
      //搜索
      this.getTableData()
    },
    getTableType(tableType) {
      //获取表格类型
      switch (tableType) {
        case '1':
          return 'user'
        case '2':
          return 'carrier'
        case '3':
          return 'tool'
        case '4':
          return 'route'
        case '5':
          return 'plan'
        default:
          return ''
      }
    },
    getTableData() {
      //获取表格数据
      let dataType = this.getTableType(this.tableType)
      let path = this.apiPath[dataType].getList
      let _this = this
      this.http
        .get(path, {
          page: _this.page,
          size: _this.pageSize,
          search: _this.searchValue
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.data
            if (!data) {
              _this.insideTableData = []
              _this.total = 0
            } else {
              _this.insideTableData = data.data
              _this.total = data.count
            }
          }
        })
    },
    pageChange(page) {
      //页码改变
      this.page = page
      this.getTableData()
    },
    initData() {
      //初始化数据
      this.page = 1
      this.searchValue = ''
    },
    openAddModel() {
      //打开新增的弹框
      let dataType = this.getTableType(this.tableType)
      dataType = dataType.slice(0, 1).toUpperCase() + dataType.slice(1)
      this.$store.dispatch('system/set' + dataType + 'Modal', true)
      this.$store.dispatch('system/set' + dataType + 'Flag', true)
    },
    selChange(sel) {
      //只要选中项发生变化时就会触发
      console.log(sel)
      if (this.tableType == '3') {
        sel.map(v => {
          this.idArrs.push(v.licencePlate)
        })
      } else {
        sel.map(v => {
          this.idArrs.push(v.id)
        })
      }
    },
    del() {
      //批量删除
      var _this = this
      this.$Modal.confirm({
        title: '删除',
        content: `不可恢复操作，是否删除`,
        onOk() {
          console.log(_this.tableType)
          let dataType = _this.getTableType(_this.tableType)
          let path = _this.apiPath[dataType].delete
          _this.http.post(path, { ids: _this.idArrs.join(',') }).then(res => {
            if (res.data.code == 0) {
              _this.$store.dispatch('system/setIsRefresh', true)
            }
          })
        }
      })
    }
  },
  watch: {
    tableType(tableType) {
      this.initData()
      this.getTableData()
    },
    isRefresh(newsVul) {
      console.log(newsVul)
      if (newsVul) {
        this.initData()
        this.getTableData()
        this.$store.dispatch('system/setIsRefresh', false)
      }
    }
  },
  mounted() {
    this.getTableData()
  }
}
</script>
<style lang="less">
.table_box {
  .search-con {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search_box {
      .search {
        &-col {
          display: inline-block;
          width: 200px;
        }
        &-input {
          display: inline-block;
          width: 200px;
          margin-left: 2px;
        }
        &-btn {
          margin-left: 2px;
        }
      }
    }
  }
  .ivu-page {
    text-align: right;
    margin: 15px 0;
  }
}
</style>