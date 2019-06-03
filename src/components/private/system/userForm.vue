<template>
  <div class="userWapper">
    <Modal
      v-model="userFormModal"
      :title="userAddEditFlag? '添加用户' : '编辑用户'"
      @on-cancel="cancel"
      :mask-closable="false"
      :closable="false"
    >
      <div class="form_box">
        <vue-scroll>
          <Form
            :model="formData"
            ref="form"
            label-position="right"
            :label-width="100"
            :rules="ruleValidate"
            class="form_box_er"
          >
            <FormItem prop="name" label="姓名">
              <Input type="text" v-model="formData.name" placeholder="请输入姓名"/>
            </FormItem>
            <FormItem prop="alias" label="昵称">
              <Input type="text" v-model="formData.alias" placeholder="请输入昵称"/>
            </FormItem>
            <FormItem prop="icon" label="头像">
              <div>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                  type="drag"
                  :action="apiPath.user.fileUpload"
                  style="display: inline-block;width:58px;"
                >
                  <div style="width: 58px;height:58px;line-height: 58px;" v-if="!formData.icon">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                  <div v-else style="width: 58px;height:58px;">
                    <img :src="formData.icon" alt style="width:100%;height:100%;">
                  </div>
                </Upload>
              </div>
            </FormItem>
            <FormItem prop="type" label="用户类型">
              <Select v-model="formData.type" filterable>
                <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="password" label="密码" v-if="userAddEditFlag">
              <Input type="password" v-model="formData.password" placeholder="请输入密码"/>
            </FormItem>
            <FormItem prop="idCard" label="身份证号">
              <Input type="text" v-model="formData.idCard" placeholder="请输入身份证号"/>
            </FormItem>
            <FormItem prop="drivingLicence" label="驾驶证编号">
              <Input type="text" v-model="formData.drivingLicence" placeholder="请输入驾驶证编号"/>
            </FormItem>
            <FormItem prop="cellPhone" label="电话">
              <Input type="text" v-model="formData.cellPhone" placeholder="请输入电话"/>
            </FormItem>
            <FormItem prop="email" label="邮箱">
              <Input type="email" v-model="formData.email" placeholder="请输入邮箱"/>
            </FormItem>
            <FormItem prop="birthday" label="生日">
              <DatePicker
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                v-model="formData.birthday"
              ></DatePicker>
            </FormItem>
            <FormItem prop="address" label="地址">
              <Input type="text" v-model="formData.address" placeholder="请输入地址"/>
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
  name: 'user',
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
        alias: '',
        password: '',
        idCard: '',
        drivingLicence: '',
        cellPhone: '',
        email: '',
        birthday: '',
        address: '',
        type: '',
        icon: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        cellPhone: [
          {
            pattern: /^1[34578]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        drivingLicence: [
          {
            required: true,
            message: '请输入驾驶证编号',
            trigger: 'blur'
          }
        ]
      },
      roleList: [],
      uploadList: [],
      id: ''
    }
  },
  components: {},
  computed: {
    ...mapGetters('system', ['getUserModal', 'getUserAddEditFlag', 'getTemp']),
    userFormModal() {
      return this.$store.getters['system/getUserModal']
    },
    userAddEditFlag() {
      return this.$store.getters['system/getUserAddEditFlag']
    },
    temp() {
      return this.$store.getters['system/getTemp']
    }
  },
  methods: {
    ...mapActions('system', [
      'setUserModal',
      'setIsRefresh'
    ]),
    sure() {
      let _this = this
      let path = this.userAddEditFlag
        ? this.apiPath.user.registUser
        : this.apiPath.user.updateUser
      this.formData.birthday = new Date(this.formData.birthday).Format(
        'yyyy-MM-dd'
      )
      let paramData = {}
      if (this.userAddEditFlag) {
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.http.post(path, { ...paramData }).then(res => {
            if (res.data.code == 0) {
              this.$refs.form.resetFields()
              this.$store.dispatch('system/setUserModal', false)
              this.$store.dispatch('system/setIsRefresh', true)
            }
          })
        }
      })
    },
    cancel() {
      //取消操作
      this.$store.dispatch('system/setUserModal', false)
      this.$refs.form.resetFields()
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: 'Up to one pictures can be uploaded.'
        })
      }
      return check
    },
    handleSuccess(res, file) {
      this.formData.icon = 'http://1.119.5.10:18080' + res.data
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc:
          'File format of ' +
          file.name +
          ' is incorrect, please select jpg or png.'
      })
    },
    getUserTypes() {
      //获取用户类型
      let path = this.apiPath.user.findUserType
      let _this = this
      _this.roleList = []
      this.http.get(path).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data
          if (!data) {
            _this.roleList = []
          } else {
            _this.roleList = data
          }
        }
      })
    },
    initEdit() {
      //初始化编辑数据
      if (!this.temp) return
      console.log(this.temp)
      this.formData.name = this.temp.name
      this.formData.alias = this.temp.alias
      this.formData.password = null
      this.formData.idCard = this.temp.idCard
      this.formData.drivingLicence = this.temp.drivingLicence
      this.formData.cellPhone = this.temp.cellPhone
      this.formData.email = this.temp.email
      this.formData.birthday = this.getMyDate(this.temp.birthday)
      this.formData.address = this.temp.address
      this.formData.type = this.temp.type
      this.formData.icon = this.temp.icon
      this.id = this.temp.id
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
    },
    initFormatter() {
      Date.prototype.Format = function(fmt) {
        //
        let o = {
          'M+': this.getMonth() + 1, //月份
          'd+': this.getDate(), //日
          'h+': this.getHours(), //小时
          'm+': this.getMinutes(), //分
          's+': this.getSeconds(), //秒
          'q+': Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
          )
        for (var k in o)
          if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ('00' + o[k]).substr(('' + o[k]).length)
            )
        return fmt
      }
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
    this.uploadList = this.$refs.upload.fileList
    this.getUserTypes()
    this.initFormatter()
  },
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="scss">
.userWapper {
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
