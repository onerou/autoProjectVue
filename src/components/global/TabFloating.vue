<template>
  <div class="TabFloatingWapper">
    <Tabs :value="valueName">
      <TabPane :label="item.label" :name="item.name" v-for="(item,index) of option" :key="index">
        <vue-scroll>
          <slot class="wapper" :name="item.name">{{item.label}}</slot>
        </vue-scroll>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  name: 'TabFloating',
  props: ['option'],
  data() {
    return {
      valueName: this.option[0].name
    }
  },
  methods: {},
  created() {}
}
</script>

<style lang="less">
.TabFloatingWapper {
  background-color: rgba(23, 26, 30, 0.7);
  display: flex;
  flex-direction: column;
  color: #ffffff;
  .__vuescroll {
    height: 24vh !important;
  }
  .ivu-tabs-bar {
    height: 36px;
    color: rgb(236, 200, 36);
    padding-left: 1.2vw;
    background-color: rgba(23, 26, 30, 1);
    .ivu-tabs-nav-container {
      font-size: 18px;
      font-weight: 700;
    }
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
