<template>
<div class='userDropWapper'>
  <div class="tab-content">
    <div class="tab-pane">
      <div class="loginDetail">
        <div class="title email">账号</div>
        <div class="identity">testEmail@gmail.com</div>
      </div>
      <div class="line-login"></div>
      <div class="account-actions">
        <a class="showChangePasswordDialog" @on-click="changePassword">修改密码</a>
        <a class="signout" @on-click="logout">退出登录</a>
        <div style="clear:both"></div>
      </div>
      <div class="subscriptionDetail">
        <div class="title">主题选择</div>
        <a class="identity" @on-click="changeThemeColor('blue')">Blue</a>
        <a class="identity" @on-click="changeThemeColor('white')" style="margin-left: 8px">White</a>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'userDrop',
  data () {
    return {}
  },
  methods: {
    ...mapActions(['handleLogOut', 'changeTheme']),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    changePassword() {
      console.log('change Password');
    },
    changeThemeColor(theme) {
      this.changeTheme(theme);
    }
  },
  created() {}
}
</script>

<style lang="less">
.tab-content {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: normal;
  width: 288px;
}
.tab-pane {
  overflow: hidden;
  color: #fff;
  padding-bottom: 0px;
  margin-bottom: 0px;
  background-color: #222121;
  padding: 10px 0 5px 0;
}
.tab-pane>div {
  padding: 0 15px;
}
.loginDetail {
  margin: 10px 0 15px 0;
}
.title {
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
}
.identity {
  font-size: 16px;
  font-weight: 400;
  color: #f8c023;
}
.line-login {
  border-bottom: 1px solid #656464;
}
.account-actions a {
  font-size: 16px;
  font-weight: 400;
  color: #64bef1;
  cursor: pointer;
}
.account-actions {
  padding-top: 5px;
  margin-bottom: 20px;
}
.showChangePasswordDialog {
  float: left;
}
.signout {
  float: right;
}
.subscriptionDetail {
  margin-bottom: 20px;
}
</style>
