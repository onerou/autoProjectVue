<template>
  <div class="routeWapper">
    <Modal
      v-model="routeFormModal"
      :title="routeAddEditFlag? '添加工具' : '编辑工具'"
      @on-cancel="cancel"
      :mask-closable="false"
      :closable="false"
    >
      <div class="form_box">
        <vue-scroll>
          <Form
            :model="formData"
            ref="routeForm"
            label-position="right"
            :label-width="100"
            :rules="ruleValidate"
            class="form_box_er"
          >
            <FormItem prop="name" label="名称">
              <Input type="text" v-model="formData.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem prop="type" label="类型">
              <Select v-model="formData.type" filterable>
                <Option v-for="item in routeTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="points" label="路线位置">
              <!-- <Input type="text" v-model="formData.points" placeholder="请输入路线"/> -->
              <div>
                <Row
                  type="flex"
                  justify="space-between"
                  v-for="(temp,index) in points"
                  :key="index"
                  style="margin-bottom:10px;"
                >
                  <Col span="7">
                    <Input type="number" v-model="temp.lon" placeholder="请输入经度"/>
                  </Col>
                  <Col span="7">
                    <Input type="number" v-model="temp.lat" placeholder="请输入纬度"/>
                  </Col>
                  <Col span="7">
                    <Icon type="md-trash" size="24" @click="delPoint(index)"/>
                  </Col>
                </Row>
                <Button type="primary" icon="md-add" @click="addPoint" long>添加点</Button>
              </div>
            </FormItem>
          </Form>
        </vue-scroll>
      </div>

      <template slot="footer">
        <Button @click="cancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="sure()">确定</Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'carrier',
  props: {
    value: {
      rows: {
        type: Object
      }
    }
  },
  data() {
    return {
      formData: {
        name: '',
        type: '',
        points: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请输入类型',
            trigger: 'blur',
            type: 'number'
          }
        ]
      },
      routeTypes: [],
      id: '',
      points: [
        {
          lon: '',
          lat: ''
        }
      ],
      validate: true
    }
  },
  components: {},
  computed: {
    ...mapGetters('system', ['getRouteModal', 'getRouteFlag', 'getRouteTemp']),
    routeFormModal() {
      return this.$store.getters['system/getRouteModal']
    },
    routeAddEditFlag() {
      return this.$store.getters['system/getRouteFlag']
    },
    temp() {
      return this.$store.getters['system/getRouteTemp']
    }
  },
  methods: {
    ...mapActions('system', [
      'setRouteModal',
      'setRouteFlag',
      'setRouteTemp',
      'setIsRefresh'
    ]),
    sure() {
      let _this = this
      let path = this.routeAddEditFlag
        ? this.apiPath.route.saveTrack
        : this.apiPath.route.updateTrackById
      let arrs = []
      this.validate = true
      this.points.map(v => {
        if (!v.lon || !v.lat) {
          this.$Message.warning('经纬度不能为空！')
          this.validate = false
        } else {
          arrs.push([Number(v.lon), Number(v.lat)])
        }
      })
      if (this.validate) {
        this.formData.points = arrs
        let paramData = {}
        if (this.routeAddEditFlag) {
          paramData = {
            ...this.formData
          }
        } else {
          paramData = {
            ...this.formData,
            id: this.id
          }
        }
        console.log(paramData)
        this.$refs.routeForm.validate(valid => {
          if (valid) {
            this.http.post(path, { ...paramData }).then(res => {
              if (res.data.code == 0) {
                this.$refs.routeForm.resetFields()
                this.$store.dispatch('system/setRouteModal', false)
                this.$store.dispatch('system/setIsRefresh', true)
                this.points = [
                  {
                    lon: '',
                    lat: ''
                  }
                ]
              }
            })
          }
        })
      }
    },
    cancel() {
      //取消操作
      this.$store.dispatch('system/setRouteModal', false)
      this.$refs.routeForm.resetFields()
      this.points = [
        {
          lon: '',
          lat: ''
        }
      ]
    },
    getRouteTypes() {
      //获取路线类型
      let path = this.apiPath.route.findAllTracksType
      let _this = this
      _this.routeTypes = []
      this.http.get(path).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data
          if (!data) {
            _this.routeTypes = []
          } else {
            _this.routeTypes = data
          }
        }
      })
    },
    initEdit() {
      //初始化编辑数据
      if (!this.temp) return
      console.log(this.temp)
      this.points = []
      this.formData.name = this.temp.trackName
      this.formData.type = this.temp.type
      this.id = this.temp.id
      this.temp.points.map(v => {
        this.points.push({
          lon: v[0],
          lat: v[1]
        })
      })
    },
    addPoint() {
      //添加点
      this.points.push({
        lon: '',
        lat: ''
      })
    },
    delPoint(index) {
      this.points.splice(index, 1)
      console.log(this.points)
    }
  },
  watch: {
    temp() {
      this.initEdit()
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.getRouteTypes()
  },
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="scss">
.routeWapper {
}
.form_box {
  height: 400px;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 10px;
  .form_box_er {
    padding-right: 17px;
    .ivu-icon.ivu-icon-md-trash {
      cursor: pointer;
    }
    .ivu-btn-long {
      width: 70%;
      margin-top: 10px;
    }
  }
}
</style>
