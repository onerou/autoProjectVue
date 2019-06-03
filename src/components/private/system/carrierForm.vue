<template>
  <div class="carrierWapper">
    <Modal
      v-model="carrierFormModal"
      :title="carrierAddEditFlag? '添加载物' : '编辑载物'"
      @on-cancel="cancel"
      :mask-closable="false"
      :closable="false"
    >
      <div class="form_box">
        <vue-scroll>
          <Form
            :model="formData"
            ref="carrierForm"
            label-position="right"
            :label-width="100"
            :rules="ruleValidate"
            class="form_box_er"
          >
            <FormItem prop="name" label="名称">
              <Input type="text" v-model="formData.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem prop="number" label="数量">
              <Input type="text" v-model="formData.number" placeholder="请输入数量"/>
            </FormItem>
            <FormItem prop="numberUnit" label="数量单位">
              <Input type="text" v-model="formData.numberUnit" placeholder="请输入数量单位"/>
            </FormItem>
            <FormItem prop="weight" label="重量">
              <Input type="text" v-model="formData.weight" placeholder="请输入重量"/>
            </FormItem>
            <FormItem prop="weightUnit" label="重量单位">
              <Input type="text" v-model="formData.weightUnit" placeholder="请输入重量单位"/>
            </FormItem>
            <FormItem prop="storageLayout" label="存放方式">
              <Input type="text" v-model="formData.storageLayout" placeholder="请输入存放方式"/>
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
        number: '',
        weight: '',
        numberUnit: '',
        weightUnit: '',
        storageLayout: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        number: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          }
        ],
        weight: [
          {
            required: true,
            message: '请输入重量',
            trigger: 'blur'
          }
        ],
        numberUnit: [
          {
            required: true,
            message: '请输入数量单位',
            trigger: 'blur'
          }
        ],
        weightUnit: [
          {
            required: true,
            message: '请输入重量单位',
            trigger: 'blur'
          }
        ],
        storageLayout: [
          {
            required: true,
            message: '请输入存放方式',
            trigger: 'blur'
          }
        ]
      },
      id: ''
    }
  },
  components: {},
  computed: {
    ...mapGetters('system', [
      'getCarrierModal',
      'getCarrierFlag',
      'getCarrierTemp'
    ]),
    carrierFormModal() {
      return this.$store.getters['system/getCarrierModal']
    },
    carrierAddEditFlag() {
      return this.$store.getters['system/getCarrierFlag']
    },
    temp() {
      return this.$store.getters['system/getCarrierTemp']
    }
  },
  methods: {
    ...mapActions('system', [
      'setCarrierModal',
      'setCarrierFlag',
      'setCarrierTemp',
      'setIsRefresh'
    ]),
    sure() {
      let _this = this
      let path = this.carrierAddEditFlag
        ? this.apiPath.carrier.saveThingInfo
        : this.apiPath.carrier.updateThingById
      let paramData = {}
      if (this.carrierAddEditFlag) {
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
      this.$refs.carrierForm.validate(valid => {
        if (valid) {
          this.http.post(path, { ...paramData }).then(res => {
            if (res.data.code == 0) {
              this.$refs.carrierForm.resetFields()
              this.$store.dispatch('system/setCarrierModal', false)
              this.$store.dispatch('system/setIsRefresh', true)
            }
          })
        }
      })
    },
    cancel() {
      //取消操作
      this.$store.dispatch('system/setCarrierModal', false)
      this.$refs.carrierForm.resetFields()
    },
    initEdit() {
      //初始化编辑数据
      if (!this.temp) return
      console.log(this.temp)
      this.formData.name = this.temp.name
      this.formData.number = this.temp.editNumber.toString()
      this.formData.weight = this.temp.editWeight.toString()
      this.formData.numberUnit = this.temp.editNumberUnit
      this.formData.weightUnit = this.temp.editWeightUnit
      this.formData.storageLayout = this.temp.storageLayout
      this.id = this.temp.id
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
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="scss">
.carrierWapper {
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
