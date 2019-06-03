<template>
  <div class="loginWapper">
    <login-form></login-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'login',
  data() {
    return {}
  },
  components: {},
  computed: {
    ...mapGetters('login', ['getData'])
  },
  methods: {
    ...mapActions('login', ['updateData'])
  },
  beforeCreate() {},
  created() {
    this.$store.dispatch('login/updateData')
  },
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="less">
.loginWapper {
}
</style>
