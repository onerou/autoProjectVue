<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <!-- <Input></Input> -->
      <Input
        class="form-row"
        size="large"
        prefix="ios-contact-outline"
        placeholder="请输入用户名"
        v-model="form.userName"
      />
      <!-- <input type="text" v-model="form.userName" placeholder="请输入用户名"> -->
    </FormItem>
    <FormItem prop="password">
      <Input
        class="form-row"
        size="large"
        type="password"
        prefix="ios-lock-outline"
        placeholder="请输入密码"
        v-model="form.password"
      />
    </FormItem>
  </Form>
</template>
<script>
import { mapActions } from 'vuex'
import cookie from '@/utils/cookie'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'blur' }]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  data() {
    return {
      form: {
        userName: '',
        password: ''
      }
    }
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit() {
      let that = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let username = this.form.userName,
            password = this.form.password
          // this.handleLogin({ userName, password }).then(res => {
          this.getUserInfo().then(res => {
            this.$router.push({
              name: this.$config.homeName
            })
          })
          // })
        }
      })
    }
  },
  created() {
    this.$on('childMethod', function() {
      console.log('监听成功')
    })
  }
}
</script>
<style lang="less">
@import './login-form.less';
</style>

