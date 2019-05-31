<template>
  <div class="deviceFloatingWapper">
    <div class="title">{{title}}</div>
    <div class="content">
      <vue-scroll>
        <slot></slot>
      </vue-scroll>
    </div>
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
    font-size: 16px;
    padding-left: 1.2vw;
    background-color: rgba(23, 26, 30, 1);
    line-height: 2;
  }
  .content {
    height: calc(30vh - 36px);
  }
  .ivu-tree-title {
    color: #ffffff;
  }
  .ivu-table-wrapper {
    border: transparent;
  }
  .ivu-table {
    color: #ffffff;
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
    background-color: transparent;
    td {
      background-color: transparent;
      border-bottom: transparent;
    }
    th {
      background-color: transparent;
      border-bottom: transparent;
    }
  }
}
</style>
