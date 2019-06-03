<template>
  <div class="toolWapper">
    <Modal
      v-model="toolFormModal"
      :title="toolAddEditFlag? '添加工具' : '编辑工具'"
      @on-cancel="cancel"
      :mask-closable="false"
      :closable="false"
    >
      <div class="form_box">
        <vue-scroll>
          <Form
            :model="formData"
            ref="toolForm"
            label-position="right"
            :label-width="100"
            :rules="ruleValidate"
            class="form_box_er"
          >
            <FormItem prop="name" label="名称">
              <Input type="text" v-model="formData.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem prop="brand" label="车牌">
              <Input type="text" v-model="formData.brand" placeholder="请输入车牌"/>
            </FormItem>
            <FormItem prop="licencePlate" label="车牌号">
              <Input
                type="text"
                v-model="formData.licencePlate"
                placeholder="请输入车牌号"
                :disabled="!toolAddEditFlag"
              />
            </FormItem>
            <FormItem prop="type" label="类型">
              <Select v-model="formData.type" filterable>
                <Option v-for="item in toolTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="groupId" label="组队名称">
              <Select v-model="formData.groupId" filterable>
                <Option v-for="item in groups" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="station" label="车站">
              <Input type="text" v-model="formData.station" placeholder="请输入车站"/>
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
        brand: '',
        licencePlate: '',
        type: '',
        groupId: '',
        station: ''
      },
      ruleValidate: {
        licencePlate: [
          {
            required: true,
            message: '请输入车牌号',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请输入类型',
            trigger: 'blur'
          }
        ],
        groupId: [
          {
            required: true,
            type: 'number',
            message: '请输入组队名称',
            trigger: 'blur'
          }
        ]
      },
      toolTypes: [],
      groups: []
    }
  },
  components: {},
  computed: {
    ...mapGetters('system', ['getToolModal', 'getToolFlag', 'getToolTemp']),
    toolFormModal() {
      return this.$store.getters['system/getToolModal']
    },
    toolAddEditFlag() {
      return this.$store.getters['system/getToolFlag']
    },
    temp() {
      return this.$store.getters['system/getToolTemp']
    }
  },
  methods: {
    ...mapActions('system', [
      'setToolModal',
      'setToolFlag',
      'setToolTemp',
      'setIsRefresh'
    ]),
    sure() {
      let _this = this
      let path = this.toolAddEditFlag
        ? this.apiPath.tool.insert
        : this.apiPath.tool.update
      console.log(this.formData)
      this.$refs.toolForm.validate(valid => {
        if (valid) {
          this.http.post(path, { ...this.formData }).then(res => {
            if (res.data.code == 0) {
              this.$refs.toolForm.resetFields()
              this.$store.dispatch('system/setToolModal', false)
              this.$store.dispatch('system/setIsRefresh', true)
            }
          })
        }
      })
    },
    cancel() {
      //取消操作
      this.$store.dispatch('system/setToolModal', false)
      this.$refs.toolForm.resetFields()
    },
    getToolTypes() {
      //获取工具类型
      let path = this.apiPath.tool.findTrucekType
      let _this = this
      _this.toolTypes = []
      this.http.get(path).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data
          if (!data) {
            _this.toolTypes = []
          } else {
            _this.toolTypes = data
          }
        }
      })
    },
    getGroup() {
      //获取工具类型
      let path = this.apiPath.tool.findTrucekGroup
      let _this = this
      _this.groups = []
      this.http.get(path).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data
          if (!data) {
            _this.groups = []
          } else {
            _this.groups = data
          }
        }
      })
    },
    initEdit() {
      //初始化编辑数据
      if (!this.temp) return
      console.log(this.temp)
      this.formData.name = this.temp.name
      this.formData.brand = this.temp.brand
      this.formData.licencePlate = this.temp.licencePlate
      this.formData.type = this.temp.type
      this.formData.groupId = this.temp.groupId
      this.formData.station = this.temp.station
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
    this.getToolTypes()
    this.getGroup()
  },
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="scss">
.toolWapper {
}
.form_box {
  height: 400px;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 10px;
  .form_box_er {
    padding-right: 17px;
  }
}
</style>
