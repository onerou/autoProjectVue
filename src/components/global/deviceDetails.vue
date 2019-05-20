<template>
  <div class="deviceDetailsWapper" v-show="getDetailsShow">
    <div class="closeBtn" @click="close">
      <Icon type="md-close"/>
    </div>
    <div class="header bgColor">
      <div class="top">
        <span class="License">{{details&&details.licencePlate||''}}</span>
        /
        <span class="number">{{details.id}}号</span>
        <span
          class="status"
          :class="{success:!details.is_warn,warn:details.is_warn,}"
        >{{!details.is_warn?'正常':'预警'}}</span>
      </div>
      <div class="bottom">{{details.station}}</div>
    </div>
    <div class="contain">
      <vue-scroll>
        <img
          class="deviceImg"
          :src="details.imageUrl"
          onerror="this.src='http://placehold.it/200x300'"
        >
        <div class="plan bgColor">
          <div class="place">
            <div class="name">
              <div class="startName nameFont">
                <div
                  class="china"
                >{{details.starting_position?details.starting_position.split('#')[0]:''}}</div>
                <div
                  class="en"
                >{{details.starting_position?details.starting_position.split('#')[1]:''}}</div>
              </div>
              <div class="icon">
                <img src="http://placehold.it/40x40" alt>
              </div>
              <div class="endName nameFont">
                <div class="china">{{details.end_position?details.end_position.split('#')[0]:''}}</div>
                <div class="en">{{details.end_position?details.end_position.split('#')[1]:''}}</div>
              </div>
            </div>
            <div class="progess">
              <Progress
                :percent="nowdetail.distance-nowdetail.diffDistance"
                status="active"
                hide-info
                :stroke-width="5"
              >
                <Icon type="checkmark-circled"></Icon>
              </Progress>
            </div>
          </div>
          <div class="time">
            <div class="planStart">
              <div class="title">计划出发</div>
              <div class="date">
                <div class="hour">{{parseTime(details.starttime,'{h}:{i}')}}</div>
                <div class="dateTime">{{parseTime(details.starttime,'{y}-{m}-{d}')}}</div>
              </div>
            </div>
            <div class="nowTime">
              <div class="title">当前时间</div>
              <div class="date">
                <div class="hour">{{parseTime(nowDate,'{h}:{i}')}}</div>
                <div class="dateTime">{{parseTime(nowDate,'{y}-{m}-{d}')}}</div>
              </div>
            </div>
            <div class="planEnd">
              <div class="title">计划到达</div>
              <div class="date">
                <div class="hour">{{parseTime(details.endtime,'{h}:{i}')}}</div>
                <div class="dateTime">{{parseTime(details.endtime,'{y}-{m}-{d}')}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row bgColor">
          <div class="key">当前速度</div>
          <div class="data">{{nowdetail.speed}}km/h</div>
        </div>
        <div class="row bgColor">
          <div class="key">距离目的地</div>
          <div class="data">{{nowdetail.diffDistance}}km</div>
        </div>
        <div class="row bgColor">
          <div class="key">预计到达时间</div>
          <div class="data">{{nowdetail.overTime}}</div>
        </div>
        <div class="tab bgColor">
          <Tabs value="nowTab">
            <TabPane label="标签一" name="people">标签一的内容</TabPane>
            <TabPane label="标签二" name="load">标签二的内容</TabPane>
            <TabPane label="标签三" name="instruction">标签三的内容</TabPane>
          </Tabs>
        </div>
      </vue-scroll>
    </div>
    <div class="footer bgColor">
      <div class="btn" @click="changeTab('people')">
        <div class="icon">
          <img src="http://placehold.it/40x40" alt srcset>
        </div>
        <div class="label">人员</div>
      </div>
      <div class="btn" @click="changeTab('load')">
        <div class="icon">
          <img src="http://placehold.it/40x40" alt srcset>
        </div>
        <div class="label">载物</div>
      </div>
      <div class="btn" @click="getTrajectory">
        <div class="icon">
          <img src="http://placehold.it/40x40" alt srcset>
        </div>
        <div class="label">轨迹</div>
      </div>
      <div class="btn" @click="setFollowPiont">
        <div class="icon">
          <img src="http://placehold.it/40x40" alt srcset>
        </div>
        <div class="label">追踪</div>
      </div>
      <div class="btn">
        <div class="icon" @click="changeTab('instruction')">
          <img src="http://placehold.it/40x40" alt srcset>
        </div>
        <div class="label">指令</div>
      </div>
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { mapGetters, mapActions } from 'vuex'
import { setInterval, clearInterval } from 'timers'
export default {
  name: 'deviceDetails',
  props: ['details'],
  data() {
    return {
      t: undefined,
      nowDate: new Date(),
      nowdetail: {
        arrivalTime: '正在获取...',
        diffDistance: '正在获取...',
        distance: '正在获取...'
      },
      nowTab: 'people'
    }
  },
  watch: {
    details(nl) {
      this.t && clearInterval(this.t)
      this.getNowDetail()
      this.nowdetail = {
        arrivalTime: '正在获取...',
        diffDistance: '正在获取...',
        distance: '正在获取...'
      }
    },
    getDetailsShow(nl) {
      if (nl) {
        this.getNowDetail()
      } else {
        this.t && clearInterval(this.t)
      }
    }
  },
  computed: {
    ...mapGetters('home', ['getDetailsShow'])
  },
  methods: {
    parseTime(time, el) {
      return parseTime(time, el)
    },
    changeTab(val) {
      this.nowTab = val
    },
    close() {
      this.$store.dispatch('home/changeDetailsShow', false)
    },
    getTrajectory() {
      this.$emit('getTrajectory', this.nowdetail)
    },
    setFollowPiont() {
      this.$emit('setFollowPiont')
    },
    getNowDetail() {
      let that = this
      let path = this.apiPath.deviceList.nowDeviceDetails
      this.t && clearInterval(this.t)
      console.log('TCL: getNowDetail -> this.details', this.details)
      let { licencePlate, route_planning, taskId } = this.details
      this.http
        .get(path, { routePlanningId: route_planning, equipment: licencePlate })
        .then(res => {
          if (!res.data) return
          let data = res.data.data
          data.overTime = parseTime(
            data.arrivalTime + that.details.starttime,
            '{y}-{m}-{d} {h}:{i}'
          )
          that.nowdetail = data
        })
      this.t = setInterval(() => {
        this.http
          .get(path, {
            routePlanningId: route_planning,
            equipment: licencePlate
          })
          .then(res => {
            if (!res.data) return
            let data = res.data.data
            data.overTime = parseTime(
              data.arrivalTime + that.details.starttime,
              '{y}-{m}-{d} {h}:{i}'
            )
            that.nowdetail = data
          })

        that.nowDate = new Date()
      }, 5000)
    }
  },
  created() {}
}
</script>

<style lang="less">
.deviceDetailsWapper {
  display: none;
  position: fixed;
  background-color: rgba(23, 26, 30, 0.7);
  z-index: 99;
  min-width: 21vw;
  height: 90vh;
  left: 1vw;
  bottom: 1vh;
  display: flex;
  flex-direction: column;
  .bgColor {
    background-color: rgba(43, 49, 61, 1);
  }
  .closeBtn {
    position: absolute;
    top: 1%;
    right: 5%;
    color: #ffffff;
    font-size: 18px;
    cursor: pointer;
  }
  .header {
    height: 60px;
    display: flex;
    flex-direction: column;
    padding: 6px 18px;
    color: #cccccc;
    .top {
      color: #ffffff;
      .License {
        font-size: 18px;
        color: rgb(241, 206, 32);
      }
      .status {
        padding: 2px 10px;
        color: black;
        margin-left: 10px;
      }
      .warn {
        background-color: rgb(253, 99, 0);
        cursor: pointer;
      }
      .success {
        background-color: greenyellow;
      }
    }
  }
  .contain {
    flex-grow: 1;
    height: 70%;
    .deviceImg {
      width: 100%;
      height: 220px;
    }
    .plan {
      height: 180px;
      display: flex;
      flex-direction: column;
      .place {
        height: 60%;
        display: flex;
        flex-direction: column;
        .name {
          height: 70%;
          display: flex;
          justify-content: space-around;
          line-height: calc(200px * 0.6 * 0.9);
          font-size: 26px;
          color: #ffffff;
          .icon {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .nameFont {
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 1.5;
            text-align: center;
            .en {
              font-size: 18px;
            }
          }
        }
        .progess {
          padding: 0 10%;
        }
      }
      .time {
        color: #ffffff;
        display: flex;
        justify-content: space-around;
        text-align: center;
        .title {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .hour {
          font-size: 16px;
        }
        .dateTime {
          font-size: 14px;
        }
      }
    }
    .row {
      height: 40px;
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      line-height: 40px;
      box-sizing: border-box;
      padding: 0 20px;
      color: #ffffff;
      .data {
        color: #cccccc;
      }
    }
    .tab {
      margin-top: 5px;
      height: 210px;
    }
    .ivu-tabs-nav-scroll {
      display: none;
    }
  }
  .footer {
    height: 60px;
    display: flex;
    justify-content: space-around;
    padding: 5px;
    text-align: center;
    color: #ffffff;
    .btn {
      display: flex;
      cursor: pointer;
      flex-direction: column;
      justify-content: space-around;
      .icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        img {
          width: 80%;
          margin: auto;
        }
      }
    }
  }
}
</style>
