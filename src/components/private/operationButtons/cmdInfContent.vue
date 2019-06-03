<template>
    <div>
        <Row class="m-row">
            <Col span="12">
            <div class="title" style="width: 25%">时间</div>
                <div class="content">
                <Date-picker type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker>
                </div>
            </Col>
            <Col span="12">
            <div class="title" style="width: 25%">载物</div>
                <div class="content">
                <i-select :model.sync="selectGood">
                    <i-option v-for="(item, index) in goods" :value="item.value" :key="index">{{ item.label }}</i-option>
                </i-select>
                </div>
            </Col>
        </Row>
        <Row class="m-row">
            <Col span="12">
            <div class="title" style="width: 25%">牌照</div>
            <div class="content">
                <i-select :model.sync="selectCar" style="width: 150px">
                <i-option v-for="(item, index) in cars" :value="item.value" :key="index">{{ item.label }}</i-option>
                </i-select>
            </div>
            </Col>
            <Col span="12">
            <div class="title" style="width: 25%">执行人</div>
            <div class="content">
                <i-select :model.sync="selectPeople" style="width: 150px">
                <i-option v-for="(item, index) in peoples" :value="item.value" :key="index">{{ item.label }}</i-option>
                </i-select>
            </div>
            </Col>
        </Row>
        <div class="pane-item" style="text-align: center">
            <i-button type="warning" size="small" @click="handleFormSubmit" style="width:25%;">筛选</i-button>
        </div>
        <Table :columns="warningColumns" :data="warningData" width="400"></Table>
    </div>
</template>
<script>
export default {
  name: 'cmdInfContent',
  props: {
      url: String,
      goods: Array, //载物
      cars: Array,  // 牌照
      peoples: Array,
  },
  data () {
    return {
       warningColumns: [
        { title: '标题', key: 'title',width: 100 },
        { title: '事项', key: 'thingName',width: 100 },
        { title: '指令信息', key: 'commandInfo',width: 100 },
        { title: '牌照', key: 'licencePlate',width: 100 },
        { title: '执行人', key: 'executorname',width: 100 },
        { title: '任务状态', key: 'taskStatus',width: 100 },
        { title: '预警状态', key: 'warnStatus',width: 100 },
      ],
      warningData: [
        {
          title: '测试',
          thingName: '测试',
          commandInfo: '测试',
          licencePlate: '测试',
          executorname: '测试',
          taskStatus: '测试',
          warnStatus: '测试',
        },
        {
          title: '测试',
          thingName: '测试',
          commandInfo: '测试',
          licencePlate: '测试',
          executorname: '测试',
          taskStatus: '测试',
          warnStatus: '测试',
        },
        {
          title: '测试',
          thingName: '测试',
          commandInfo: '测试',
          licencePlate: '测试',
          executorname: '测试',
          taskStatus: '测试',
          warnStatus: '测试',
        },
        {
          title: '测试',
          thingName: '测试',
          commandInfo: '测试',
          licencePlate: '测试',
          executorname: '测试',
          taskStatus: '测试',
          warnStatus: '测试',
        },
        {
          title: '测试',
          thingName: '测试',
          commandInfo: '测试',
          licencePlate: '测试',
          executorname: '测试',
          taskStatus: '测试',
          warnStatus: '测试',
        },
      ],
      selectGood: '',
      selectCar: '',
      selectPeople: '',
    }
  },
  methods: {
    handleFormSubmit: function() {
      
    }
  },
  created() {}
}
</script>

<style lang="less">

</style>
