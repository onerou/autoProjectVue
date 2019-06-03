<template>
<div class='settingsWapper'>
  <Tabs type="card" :animated="false">
      <Tab-pane label="人员">
        <person></person>
      </Tab-pane>
      <Tab-pane label="工具">
        <tools></tools>
      </Tab-pane>
      <Tab-pane label="路线">
        <routes></routes>
      </Tab-pane>
      <Tab-pane label="计划">
        <plans></plans>
      </Tab-pane>
  </Tabs>
</div>
</template>
<script>
import person from '../private/operationButtons/person.vue';
import plans from '../private/operationButtons/plans.vue';
import routes from '../private/operationButtons/routes.vue';
import tools from '../private/operationButtons/tools.vue';

export default {
  name: 'settings',
  data () {
    return {
    }
  },
  components: {
    person,
    plans,
    routes,
    tools
  },
  methods: {
    
  },
  created() {}
}
</script>

<style lang="less">
.settingsWapper{
  position: absolute;
  right: 40px;
  top: 0;
  min-width: 20vw;
  .ivu-tabs {
    overflow: initial;
  }
  .ivu-tabs-bar{
    background: #000;
    margin-bottom: 0;
  }
  .ivu-tabs-bar .ivu-tabs-tab {
    background: #000!important;
    border: none;
  }

  .ivu-tabs-content {
    background: rgba(0,0,0,0.7)
  }
  .ivu-tabs-content .ivu-tabs-tabpane {
  }
  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    color: #f8c023!important;
    border: none;
    height: 31px;
  }
  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    color: #ccc;
    border: none;
    height: 31px;
  }
  .pane-item {
    padding: .5rem 0;
  }
  .pane-item .title {
    display: inline-block;
    color: #fff;
    width: 20%;
    text-align: right;
  }
  .pane-item .content {
    display: inline-flex;
    margin-left: 1rem;
    position: relative;
  }
}


</style>
