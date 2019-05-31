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
      <!-- <div class="tab bgColor"> -->
      <Tabs :value="nowTab">
        <TabPane label="详情" name="details">
          <img
            class="deviceImg"
            :src="details&&details.imageUrl"
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
                  <img src="@/assets/images/details/centerDevice.png" alt>
                </div>
                <div class="endName nameFont">
                  <div class="china">{{details.end_position?details.end_position.split('#')[0]:''}}</div>
                  <div class="en">{{details.end_position?details.end_position.split('#')[1]:''}}</div>
                </div>
              </div>
              <div class="progess">
                <Progress
                  :percent="nowdetail.distance-nowdetail.diffDistance>100?100:nowdetail.distance-nowdetail.diffDistance"
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
        </TabPane>
        <TabPane label="人员" name="people">
          <img
            class="deviceImg"
            :src="peopleDetails&&peopleDetails.icon"
            onerror="this.src='http://placehold.it/200x300'"
          >
          <div class="row bgColor">
            <div class="key">姓名</div>
            <div class="data">{{peopleDetails.name}}</div>
          </div>
          <div class="row bgColor">
            <div class="key">生日</div>
            <div class="data">{{parseTime(peopleDetails.birthday,'{y}-{m}-{d}')}}</div>
          </div>
          <div class="row bgColor">
            <div class="key">性别</div>
            <div class="data">{{peopleDetails.sex=='1'?'男':'女'}}</div>
          </div>
          <div class="row bgColor">
            <div class="key">邮箱</div>
            <div class="data">{{peopleDetails.email||' '}}</div>
          </div>
          <div class="row bgColor">
            <div class="key">电话</div>
            <div class="data">{{peopleDetails.cellPhone||' '}}</div>
          </div>
          <div class="row bgColor">
            <div class="key">身份证</div>
            <div class="data">{{peopleDetails.idCard||' '}}</div>
          </div>
          <div class="row bgColor">
            <div class="key">驾驶证</div>
            <div class="data">{{peopleDetails.drivingLicence||' '}}</div>
          </div>
          <div class="row bgColor">
            <div class="key">现住址</div>
            <div class="data">{{peopleDetails.address||' '}}</div>
          </div>
        </TabPane>
        <TabPane label="载物" name="load">
          <vue-scroll>
            <p v-if="!TaskThing" style="text-align:center;">暂无数据</p>
            <div class="TaskThing" v-if="TaskThing">
              <img
                class="deviceImg"
                :src="TaskThing&&TaskThing.imageUrl"
                onerror="this.src='http://placehold.it/200x300'"
              >
              <div class="row bgColor">
                <div class="key">名称</div>
                <div class="data">{{TaskThing.name||' '}}</div>
              </div>
              <div class="row bgColor">
                <div class="key">数量</div>
                <div class="data">{{TaskThing.number||' '}}</div>
              </div>
              <div class="row bgColor">
                <div class="key">重量</div>
                <div class="data">{{TaskThing.weight||' '}}</div>
              </div>
              <div class="row bgColor">
                <div class="key">存放方法</div>
                <div class="data">{{TaskThing.storageLayout||' '}}</div>
              </div>
              <div class="row bgColor" v-for=" (item,index) of TaskThing.other" :key="index">
                <div class="key">{{index}}</div>
                <div class="data">{{item||' '}}</div>
              </div>
            </div>
          </vue-scroll>
        </TabPane>
        <TabPane label="指令" name="instruction">
          <vue-scroll style="height:73vh;">
            <!-- <div class="messageRow" v-for="(item,index) of messageList" :key="index">
              <div class="time">{{parseTime(item.time,'{h}:{i}:{s}')}}</div>
              <div class="name">{{item.from==1087?'已发送给':'收到来自'}} {{item.name}}：</div>
              <div class="message">{{item.msg}}</div>
            </div>-->
            <div class="message" v-for="(item,index) of messageList" :key="index">
              <div class="time rowMessage">{{parseTime(item.time,'{h}:{i}:{s}')}}</div>
              <div class="cont rowMessage" :class="{meCont:item.from==1087}">{{item.msg}}</div>
              <div class="status rowMessage"></div>
            </div>
          </vue-scroll>
          <div class="send">
            <Input v-model="sendMessage" icon="ios-time-outline" placeholder="请输入" style/>
            <Button type="primary" @click="sendMessageFn">发送</Button>
          </div>
        </TabPane>
      </Tabs>
      <!-- </div> -->
    </div>
    <div class="footer bgColor">
      <div class="btn" :class="{active:nowTab=='details'}" @click="changeTab('details')">
        <div class="icon" @click="changeTab('details')">
          <img src="@/assets/images/menu/device.png" alt srcset>
        </div>
        <div class="label">运输</div>
      </div>
      <div class="btn" :class="{active:nowTab=='people'}" @click="changeTab('people')">
        <div class="icon" @click="changeTab('people')">
          <img src="@/assets/images/detailsFooter/people.png" alt srcset>
        </div>
        <div class="label">人员</div>
      </div>
      <div class="btn" :class="{active:nowTab=='load'}" @click="changeTab('load')">
        <div class="icon" @click="changeTab('load')">
          <img src="@/assets/images/detailsFooter/taskThing.png" alt srcset>
        </div>
        <div class="label">载物</div>
      </div>
      <div class="btn" @click="getTrajectory">
        <div class="icon">
          <img src="@/assets/images/detailsFooter/trajectory.png" alt srcset>
        </div>
        <div class="label">轨迹</div>
      </div>
      <div class="btn" @click="setFollowPiont">
        <div class="icon">
          <img src="@/assets/images/detailsFooter/foollow.png" alt srcset>
        </div>
        <div class="label">追踪</div>
      </div>
      <div class="btn" :class="{active:nowTab=='instruction'}" @click="changeTab('instruction')">
        <div class="icon" @click="changeTab('instruction')">
          <img src="@/assets/images/detailsFooter/instructions.png" alt srcset>
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
      nowTab: 'details',
      peopleDetails: {},
      TaskThing: {},
      messageList: [],
      sendMessage: ''
    }
  },
  watch: {
    details(nl) {
      this.t && clearInterval(this.t)
      this.getDetailsShow == true && this.getNowDetail()
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
    sendMessageFn() {
      // this.details
      let message = this.sendMessage
      let path = this.apiPath.message.sendMessage
      this.http
        .post(path, {
          appid: 21,
          content:
            `taskId:${this.details.id};name:${this.peopleDetails.name};msg:` +
            message,
          from: 1087,
          to: this.details.executorid / 1,
          type: 2
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success('发送成功')
            this.sendMessage = ''
            this.messageList.unshift({
              appid: 21,
              from: 1087,
              msg: message,
              name: this.peopleDetails.name,
              status: 0,
              taskId: this.details.id,
              time: new Date().getTime(),
              to: this.details.executorid / 1,
              type: 2
            })
          }
        })
    },
    getPeopleDetail() {
      let userId = this.details.executorid
      let path = this.apiPath.deviceList.getUserById
      let that = this
      this.http
        .get(path, {
          userId
        })
        .then(res => {
          if (!res.data) return
          let data = res.data.data
          that.peopleDetails = data
        })
    },
    findTaskThingByTaskId() {
      let { taskId } = this.details
      let path = this.apiPath.deviceList.findTaskThingByTaskId
      let that = this
      this.http
        .get(path, {
          taskId
        })
        .then(
          res => {
            if (!res.data || !res.data.data) return
            let data = res.data.data
            that.TaskThing = data
          },
          rej => {
            that.TaskThing = undefined
          }
        )
    },
    changeTab(val) {
      this.nowTab = val
    },
    close() {
      this.$emit('clearTrajectory')
      this.$store.dispatch('home/changeDetailsShow', false)
    },
    getTrajectory() {
      this.$emit('getTrajectory', this.nowdetail)
    },
    setFollowPiont() {
      this.$emit('setFollowPiont')
    },
    findAllTaskCommand() {
      let path = this.apiPath.deviceList.findAllTaskCommand
      let nowDate = new Date().getTime()
      let that = this
      this.http
        .get(path, {
          endTime: nowDate,
          limit: 5,
          startTime: nowDate - 5000,
          taskId: this.details.taskId
        })
        .then(res => {
          let data = res.data
          if (!data || (data && data.data.data.length === 0)) return
          that.messageList = [...data.data.data, ...that.messageList]
          if (that.messageList.length > 20) {
            while (that.messageList.length > 20) {
              that.messageList.shift()
            }
          }
        })
    },
    getNowDetail() {
      let that = this
      let path = this.apiPath.deviceList.nowDeviceDetails
      this.t && clearInterval(this.t)
      this.getPeopleDetail()
      this.findTaskThingByTaskId()
      this.messageList = []
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
          that.$emit('getTrajectory', data)
        })
      this.t = setInterval(() => {
        that.findAllTaskCommand()
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
  mounted() {},
  created() {}
}
</script>

<style lang="less">
.deviceDetailsWapper {
  display: none;
  position: fixed;
  background-color: rgba(23, 26, 30, 0.7);
  z-index: 99;
  width: 380px;
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
        font-size: 16px;
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
      height: 240px;
    }
    .plan {
      height: 200px;
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
          font-size: 24px;
          color: #ffffff;
          .icon {
            display: flex;
            flex-direction: column;
            justify-content: center;
            img {
              border-radius: 50%;
              background-color: #ffffff;
              overflow: hidden;
            }
          }
          .nameFont {
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 1.5;
            text-align: center;
            .en {
              font-size: 14px;
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
          font-size: 14px;
        }
        .dateTime {
          font-size: 12px;
          transform: scale(0.9);
        }
      }
    }
    .row {
      height: 45px;
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      line-height: 45px;
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
      overflow: hidden;
    }
    .message {
      display: flex;
      flex-direction: column;
      padding: 0px 50px;
      .rowMessage {
        margin-bottom: 5px;
      }
      .time {
        text-align: center;
        font-size: 14px;
      }
      .cont {
        background-color: rgb(238, 238, 238);
        color: black;
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 14px;
      }
      .meCont {
        background-color: rgb(255, 238, 166);
        color: #aaaaaa;
      }
      .status {
        text-align: right;
        color: red;
        font-weight: bold;
        font-size: 14px;
      }
    }
    .ivu-tabs {
      height: 100%;
      width: 380px;
      color: #ffffff;
      // .tabRow {
      //   font-size: 14px;
      //   margin: 10px 0;
      //   box-sizing: border-box;
      //   & > div {
      //     width: 50%;
      //   }
      // }
      .ivu-tabs-tabpane {
        // height: 200px;
        .send {
          display: flex;
          justify-content: space-around;
          padding: 0 10px;
          & > div {
            margin-right: 10px;
          }
        }
      }
      .imageRow {
        display: flex;
        justify-content: space-around;
        overflow: hidden;
        .image {
          width: 50%;
        }
        .title {
          flex-grow: 1;
        }
        .imagetabRow {
          display: flex;
          justify-content: space-around;
        }
        img {
          height: 60px;
          width: 100px;
          margin-left: 20px;
          margin-top: 10px;
        }
      }
      .ivu-tabs-bar {
        border-bottom: 0;
        margin-bottom: 5px;
        height: 0;
        overflow: hidden;
      }
      .twoLay {
        display: flex;
        justify-content: space-around;
      }
      .key {
        text-align: left;
        // width: 40px;
        font-size: 14px;
        // margin-left: 0px;
      }
      .data {
        font-size: 14px;
      }
      .val {
        flex-grow: 1;
      }
    }
  }
  .footer {
    height: 60px;
    display: flex;
    justify-content: space-around;
    text-align: center;
    color: #ffffff;
    .active {
      background-color: rgb(82, 79, 79);
    }
    .btn {
      padding: 5px 15px;
      display: flex;
      cursor: pointer;
      flex-direction: column;
      justify-content: space-around;
      .label {
        font-size: 12px;
        transform: scale(0.8);
        color: #cccccc;
      }
      .icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        img {
          width: 32px;
          height: 32px;
          margin: auto;
        }
      }
    }
  }
}
</style>
