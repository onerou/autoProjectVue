<template>
  <div class="headerTimeWapper">
    <div class="second">{{second}}</div>
    <div class="date">{{date}}</div>
  </div>
</template>
<script>
export default {
  name: 'headerTime',
  props: ['second', 'date'],
  data() {
    return {}
  },
  methods: {},
  created() {}
}
</script>

<style lang="less">
.headerTimeWapper {
  padding-right: 20px;
  height: 64px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .second {
    font-size: 20px;
    text-align: right;
  }
  .date {
    font-size: 16px;
  }
}
</style>
