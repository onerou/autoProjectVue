<template>
  <div class="systemWapper">
    <div class="kong"></div>
    <Layout :style="{minHeight: 'calc(100vh - 64px)'}">
      <!-- <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="1-1">
            <Icon type="ios-navigate"></Icon>
            <span>Option 1</span>
          </MenuItem>
          <MenuItem name="1-2">
            <Icon type="search"></Icon>
            <span>Option 2</span>
          </MenuItem>
          <MenuItem name="1-3">
            <Icon type="settings"></Icon>
            <span>Option 3</span>
          </MenuItem>
        </Menu>
      </Sider>-->
      <Layout>
        <Content :style="{padding: '0 16px 16px'}">
          <Card>
            <div style="height:calc(100vh - 114px)">
              <div class="tab_nav">
                <p
                  v-for="(temp,index) in systemData"
                  :key="index"
                  :class="active==index?'tab_nav_title tab_nav_title_active':'tab_nav_title'"
                  @click="changeActive(index,temp)"
                >{{temp.title}}</p>
              </div>
              <div class="tab_body">
                <tables :columns="columns" :tableType="type"></tables>
              </div>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
    <!--s 表格新增和编辑的弹框 s-->
    <userForm v-if="type=='1'"></userForm>
    <carrierForm v-if="type=='2'"></carrierForm>
    <toolForm v-if="type=='3'"></toolForm>
    <routeForm v-if="type=='4'"></routeForm>
    <!--e 表格新增和编辑的弹框 e-->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import tables from '@/components/private/system/table'
import userForm from '@/components/private/system/userForm'
import carrierForm from '@/components/private/system/carrierForm'
import toolForm from '@/components/private/system/toolForm'
import routeForm from '@/components/private/system/routeForm'

export default {
  name: 'system',
  data() {
    return {
      isCollapsed: false,
      systemData: [
        {
          type: '1',
          title: '人员',
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '姓名',
              key: 'name',
              align: 'center'
            },
            {
              title: '身份证',
              key: 'idCard',
              align: 'center',
              tooltip: true
            },
            {
              title: '电话',
              key: 'cellPhone',
              align: 'center',
              tooltip: true
            },
            {
              title: '用户类型',
              key: 'typeName',
              align: 'center'
            },
            {
              title: '地址',
              key: 'address',
              align: 'center',
              tooltip: true
            },
            {
              title: '邮箱',
              key: 'email',
              align: 'center',
              tooltip: true
            },
            {
              title: '生日',
              key: 'birthday',
              align: 'center',
              render: (h, params) => {
                return h('p', this.getMyDate(params.row.birthday))
              }
            },
            {
              title: '驾驶证编号',
              key: 'drivingLicence',
              align: 'center',
              tooltip: true
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.edit(params.row)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.remove(params.row)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }
            }
          ]
        },
        {
          type: '2',
          title: '载物',
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '数量',
              key: 'number',
              align: 'center'
            },
            {
              title: '重量',
              key: 'weight',
              align: 'center'
            },
            {
              title: '创建时间',
              key: 'createTime',
              align: 'center'
            },
            {
              title: '是否运输',
              key: 'isTransportation',
              align: 'center'
            },
            {
              title: '存放方式',
              key: 'storageLayout',
              align: 'center'
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.edit(params.row)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.remove(params.row)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }
            }
          ]
        },
        {
          type: '3',
          title: '工具',
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '车牌',
              key: 'brand',
              align: 'center'
            },
            {
              title: '组队名称',
              key: 'groupName',
              align: 'center'
            },
            {
              title: '车牌号',
              key: 'licencePlate',
              align: 'center'
            },
            {
              title: '类型',
              key: 'type',
              align: 'center',
              render: (h, params) => {
                if (params.row.type == '0') {
                  return h('p', '汽车')
                } else if (params.row.type == '1') {
                  return h('p', '火车')
                } else if (params.row.type == '2') {
                  return h('p', '货车')
                }
              }
            },
            {
              title: '车站',
              key: 'station',
              align: 'center'
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.edit(params.row)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.remove(params.row)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }
            }
          ]
        },
        {
          type: '4',
          title: '路线',
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '创建名称',
              key: 'createName',
              align: 'center'
            },
            {
              title: '运输路线',
              key: 'trackName',
              align: 'center'
            },
            {
              title: '类型',
              key: 'typeName',
              align: 'center'
            },
            {
              title: '创建时间',
              key: 'createTime',
              align: 'center'
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.edit(params.row)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.remove(params.row)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }
            }
          ]
        },
        {
          type: '5',
          title: '任务',
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '名称',
              key: 'title',
              align: 'center'
            },
            {
              title: '创建时间',
              key: 'createtime',
              align: 'center'
            },
            {
              title: '开始位置',
              key: 'starting_position',
              align: 'center'
            },
            {
              title: '结束位置',
              key: 'end_position',
              align: 'center'
            },
            {
              title: '执行人',
              key: 'executorname',
              align: 'center'
            },
            {
              title: '车牌',
              key: 'licencePlate',
              align: 'center'
            },
            {
              title: '状态',
              key: 'status',
              align: 'center',
              render: (h, params) => {
                if (params.row.status == '0') {
                  return h('p', '拒绝')
                } else if (params.row.status == '1') {
                  return h('p', '接受(进行中)')
                } else if (params.row.status == '2') {
                  return h('p', '完成')
                } else if (params.row.status == '3') {
                  return h('p', '结束')
                } else if (params.row.status == '4') {
                  return h('p', '未处理 ')
                }
              }
            },
            {
              title: '预计开始时间',
              key: 'starttime',
              align: 'center'
            },
            {
              title: '预计结束时间',
              key: 'endtime',
              align: 'center'
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.edit(params.row)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.remove(params.row)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }
            }
          ]
        }
      ],
      active: 0,
      columns: [],
      type: '1',
      temp: {}
    }
  },
  components: {
    tables,
    userForm,
    carrierForm,
    toolForm,
    routeForm
  },
  computed: {
    ...mapGetters('system', ['getUserModal', 'getUserAddEditFlag', 'getTemp']),
    menuitemClasses: function() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  },
  methods: {
    ...mapActions('system', [
      'setUserModal',
      'setUserFlag',
      'setUserTemp',
      'setCarrierModal',
      'setCarrierFlag',
      'setCarrierTemp',
      'setToolModal',
      'setToolFlag',
      'setToolTemp',
      'setRouteModal',
      'setRouteFlag',
      'setRouteTemp'
    ]),
    changeActive(index, temp) {
      this.active = index
      this.columns = temp.columns
      this.type = temp.type
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
    edit(row) {
      //打开编辑弹框
      console.log(row)
      let dataType = this.getTableType(this.type)
      dataType = dataType.slice(0, 1).toUpperCase() + dataType.slice(1)
      this.$store.dispatch('system/set' + dataType + 'Modal', true)
      this.$store.dispatch('system/set' + dataType + 'Flag', false)
      this.$store.dispatch('system/set' + dataType + 'Temp', row)
    },
    remove(row) {
      //删除
      console.log(row)
      var _this = this
      let arrs = []
      this.$Modal.confirm({
        title: '删除',
        content: `不可恢复操作，是否删除`,
        onOk() {
          console.log(_this.type)
          if (_this.type == '3') {
            arrs.push(row.licencePlate)
          } else {
            arrs.push(row.id)
          }
          let dataType = _this.getTableType(_this.type)
          let path = _this.apiPath[dataType].delete
          _this.http.post(path, { ids: arrs.join(',') }).then(res => {
            if (res.data.code == 0) {
              _this.$store.dispatch('system/setIsRefresh', true)
            }
          })
        }
      })
    },
    getMyDate(str) {
      //将毫秒数转换成日期
      var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay)
      return oTime
    },
    addZero(num) {
      //自动补零
      if (parseInt(num) < 10) {
        num = '0' + num
      }
      return num
    }
  },
  beforeCreate() {},
  created() {
    this.$store.dispatch('system/updateData')
  },
  beforeMount() {},
  mounted() {
    this.columns = this.systemData[this.active].columns
    console.log(this.columns)
    this.type = this.systemData[this.active].type
  },
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="less">
.systemWapper {
  .kong {
    height: 64px;
  }
  .layout-con {
    height: 100%;
    width: 100%;
  }
  .menu-item {
    span {
      display: inline-block;
      overflow: hidden;
      width: 69px;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
      transition: width 0.2s ease 0.2s;
    }
    i {
      transform: translateX(0px);
      transition: font-size 0.2s ease, transform 0.2s ease;
      vertical-align: middle;
      font-size: 16px;
    }
  }
  .collapsed-menu {
    span {
      width: 0px;
      transition: width 0.2s ease;
    }
    i {
      transform: translateX(5px);
      transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
      vertical-align: middle;
      font-size: 22px;
    }
  }
  .tab_nav {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #ddd;
    .tab_nav_title {
      margin-right: 0;
      padding: 8px 16px;
      font-size: 15px;
      box-sizing: border-box;
      cursor: pointer;
      text-decoration: none;
      line-height: 1.5;
      color: #515a6e;
      transition: color 0.3s ease-in-out;
    }
    .tab_nav_title_active {
      color: #2d8cf0;
      border-bottom: 2px solid #2d8cf0;
    }
  }
  .tab_body {
    padding: 10px 0;
  }
}
</style>
