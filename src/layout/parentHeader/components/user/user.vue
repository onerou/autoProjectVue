<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator"/>
      </Badge>-->
      <Badge>
        <Avatar :src="userAvator"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          系统配置
          <!-- <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge> -->
        </DropdownItem>
        <!-- <userDrop></userDrop> -->
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import cookie from '@/utils/cookie'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions(['handleLogOut']),
    logout() {
      // this.handleLogOut().then(() => {
      //   this.$router.push({
      //     name: 'login'
      //   })
      // })
      let path = this.apiPath.login.loginOut
      this.http.post(path)
      cookie.delete('token')
      this.$router.push({ path: '/login' })
    },
    message() {
      this.$router.push({
        name: 'system'
      })
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'message':
          this.message()
          break
      }
    }
  }
}
</script>
