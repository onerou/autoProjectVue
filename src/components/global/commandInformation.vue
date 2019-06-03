<template>
  <div class="commandInformationWapper">
    <Tabs type="card" :animated="false">
      <vue-scroll>
        <Tab-pane label="预警信息" style="max-height: 300px;">
          <cmdInfContent url :goods="goods" :cars="cars" :peoples="peoples"></cmdInfContent>
        </Tab-pane>
      </vue-scroll>
      <vue-scroll>
        <Tab-pane label="调度指令" style="max-height: 300px;">
          <cmdInfContent url :goods="goods" :cars="cars" :peoples="peoples"></cmdInfContent>
        </Tab-pane>
      </vue-scroll>
    </Tabs>
  </div>
</template>
<script>
import cmdInfContent from '../private/operationButtons/cmdInfContent.vue'

export default {
  name: 'commandInformation',
  components: {
    cmdInfContent
  },
  data() {
    return {
      goods: [{ label: '粮食', value: '1' }, { label: '汽油', value: '2' }],
      cars: [{ label: '汽车', value: '1' }, { label: '摩托', value: '2' }],
      peoples: [{ label: '张三', value: '1' }, { label: '李四', value: '2' }]
    }
  },
  methods: {
    handleFormSubmit: function() {}
  },
  created() {}
}
</script>

<style lang="less">
.commandInformationWapper {
  position: absolute;
  right: 40px;
  top: 0;
  min-width: 20vw;
  .ivu-tabs {
    overflow: initial;
  }
  .ivu-tabs-bar {
    background: #000;
    margin-bottom: 0;
  }
  .ivu-tabs-bar .ivu-tabs-tab {
    background: #000 !important;
    border: none;
  }
  .ivu-tabs-content {
    background: rgba(0, 0, 0, 0.7);
  }

  .ivu-tabs-content .ivu-tabs-tabpane {
    padding: 0.5rem;
  }
  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    color: #f8c023 !important;
    border: none;
    height: 31px;
  }
  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    color: #ccc;
    border: none;
    height: 31px;
  }
  .ivu-row {
    margin: 0.5rem 0;
  }
  .m-row .title {
    display: inline-block;
    color: #fff;
    width: 25%;
    text-align: right;
  }
  .m-row .content {
    display: inline-flex;
    width: 70%;
    margin-left: 2%;
  }
}
</style>
