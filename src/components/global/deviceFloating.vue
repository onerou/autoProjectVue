<template>
  <div class="deviceFloatingWapper">
    <div class="title">{{title}}</div>
    <vue-scroll>
      <slot></slot>
    </vue-scroll>
  </div>
</template>
<script>
export default {
  name: 'deviceFloating',
  props: ['title'],
  data() {
    return {}
  },
  methods: {},
  created() {}
}
</script>

<style lang="less">
.deviceFloatingWapper {
  background-color: rgba(23, 26, 30, 0.7);
  display: flex;
  flex-direction: column;
  color: #ffffff;
  .title {
    height: 36px;
    color: rgb(236, 200, 36);
    font-size: 18px;
    padding-left: 1.2vw;
    background-color: rgba(23, 26, 30, 1);
    line-height: 2;
  }
  .ivu-tree-title {
    color: #ffffff;
  }
}
</style>
