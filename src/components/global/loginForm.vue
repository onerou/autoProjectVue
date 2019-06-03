<template>
  <div class="loginFormWapper" :style="{backgroundImage:`url(${loginBg})`}">
    <div class="headerTop">
      <div class="logo">
        <div class="imgBox">
          <img src="@/assets/images/logo.png" alt>
        </div>
        <div class="text">
          <span>运输实时监控系统</span>
        </div>
      </div>
    </div>
    <device-floating title="账号登录" class="loginFloating" v-show="getLoginFloating">
      <div class="formCon">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="user">
            <Input type="text" v-model="formInline.user" placeholder="用户名"/>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" placeholder="密码"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formInline')" long>登录</Button>
          </FormItem>
        </Form>
      </div>
    </device-floating>
  </div>
</template>
<script>
import md5 from 'md5'
import cookie from '@/utils/cookie'
import loginBg from '@/assets/images/loginBg.png'
export default {
  name: 'loginForm',
  data() {
    return {
      loginBg,
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 5,
            message: '请输入至少5位密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getLoginFloating() {
      return true
    }
  },
  methods: {
    handleSubmit(name) {
      let that = this
      this.$refs[name].validate(valid => {
        if (valid) {
          let pass = that.formInline.password
          let path = that.apiPath.login.loginIn
          that.http
            .post(path, {
              name: that.formInline.user,
              password: md5(pass),
              type: 1
            })
            .then(res => {
              console.log('TCL: handleSubmit -> res', res)
              cookie.set('token', res.data.data.token)
              cookie.set('user', JSON.stringify(res.data.data))
              that.$router.push({ path: '/home' })
            })
        }
      })
    }
  },
  created() {}
}
</script>

<style lang="less">
.loginFormWapper {
  position: relative;
  height: 100vh;
  width: 100vw;

  // background-color: rgba(0, 0, 0, 0.5);
  .headerTop {
    padding-left: 26px;
    height: 64px;
    padding-top: 7px;
    .logo {
      height: 64px;
      display: flex;
      .imgBox {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    span {
      font-size: 22px;
      transform: translateY(50%);
      font-weight: 550;
      color: white;
      line-height: 57px;
      margin: 17px;
    }
  }
  .loginFloating {
    height: 30vh;
    width: 30vw;
    max-width: 385px;
    min-width: 300px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    .formCon {
      padding: 2.6vh 50px 0;
      box-sizing: border-box;
    }
    .__view {
      min-height: 0 !important;
    }
  }
}
</style>
