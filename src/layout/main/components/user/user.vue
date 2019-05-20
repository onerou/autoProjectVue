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
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>-->
        <DropdownItem name="logout">退出&nbsp;{{getUserName}}</DropdownItem>
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
  computed: {
    getUserName() {
      return cookie.get('userName')
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
      let that = this
      cookie.delete('userName')
      this.http.get(path).then(res => {
        console.log('TCL: logout -> res', res)
        that.$router.push({ path: '/login' })
      })
    },
    message() {
      this.$router.push({
        name: 'message_page'
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
