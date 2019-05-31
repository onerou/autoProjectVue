<template>
  <div class="homeWapper">
    <div :id="getId" style="height:100vh;" @mousedown="initObj" @mousewheel="initObj"></div>
    <device-floating title="运输工具" class="floatingWindow" v-show="getDeviceFloating">
      <Tree
        :data="getDeviceList"
        @on-select-change="getDetail"
        @on-check-change="makerHeightLight"
        show-checkbox
      ></Tree>
    </device-floating>
    <device-floating title="统计数据" class="statisticsFloating" v-show="getStatisticsFloating"></device-floating>
    <device-floating title="预警查询" class="warnFloating" v-show="getWarnFloating">
      <!-- <Table :columns="warnColumns" :data="warnData" size="small">
        <template slot-scope="{ row }" slot="action">
          <Button shape="circle" icon="ios-send" size="small" ghost @click="FlyWarnpoint(row)"></Button>
        </template>
      </Table>-->
      <div class="warnRow" v-for="(item,index) of warnData" :key="index">
        <div class="top" @click="FlyWarnpoint(item)">
          <div class="licencePlate">
            <div class="number">{{item.equipment}}</div>
            <div class="warn">预警</div>
          </div>
          <div class="time">{{item.timestamp}}</div>
        </div>
        <div class="bottom">
          <div class="cont" @click="FlyWarnpoint(item)">{{item.content}}</div>
          <div class="update">
            <div class="pass" @click="warnPass(item)">忽略</div>
            <div class="do" @click="warnDo(item)">已处理</div>
          </div>
        </div>
      </div>
    </device-floating>
    <device-floating title="指令查询" class="instructionFloating" v-show="getInstructionFloating">
      <Table :columns="instructionColumns" :data="instructionData">
        <template slot-scope="{ row }" slot="time">{{parseTime(row.time,'{y}-{m}-{d}')}}</template>
      </Table>
    </device-floating>
    <!-- <Tab-floating class="planFloating" :option="planOption" v-show="getPlanFloating">
      <div slot="people">
        <Table :columns="peopleColumns" :data="peopleData"></Table>
      </div>
      <div slot="gongju">
        <Table :columns="toolColumns" :data="toolData"></Table>
      </div>
      <div slot="luxian">
        <Table :columns="routeColumns" :data="routeData">
          <template slot-scope="{ row }" slot="type">{{row.type==1?'计划轨迹':'电子围栏'}}</template>
        </Table>
      </div>
      <div slot="plan">
        <Table :columns="planColumns" :data="planData">
          <template
            slot-scope="{ row }"
            slot="starting_position"
          >{{row.end_position&&row.starting_position.split('#')[0]}}</template>
          <template
            slot-scope="{ row }"
            slot="end_position"
          >{{row.end_position&&row.end_position.split('#')[0]}}</template>
        </Table>
      </div>
    </Tab-floating>-->
    <device-details
      :details="deviceDetail"
      @setFollowPiont="setFollowPiont"
      @getTrajectory="getTrajectory"
      @clearTrajectory="clearTrajectory"
    ></device-details>
    <operationButtons :map="map" @searchData="searchData"></operationButtons>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { parseTime } from '@/utils'
import cookie from '@/utils/cookie.js'
import webSocket from '@/utils/webSocket.js'
export default {
  name: 'home',
  data() {
    return {
      map: {},
      deviceDetail: {},
      markerArr: [],
      warnPoint: undefined,
      warnTitle: undefined,
      peopleColumns: [
        {
          title: '姓名',
          key: 'name',
          align: 'center'
        },
        {
          title: '电话',
          key: 'cellPhone'
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      peopleData: [],
      toolColumns: [
        {
          title: '车牌号',
          key: 'licencePlate',
          align: 'center'
        },
        {
          title: '分组',
          key: 'groupName'
        },
        {
          title: '车型',
          key: 'brand'
        }
      ],
      toolData: [],
      routeColumns: [
        {
          title: '名称',
          key: 'trackName',
          align: 'center'
        },
        {
          title: '创建人',
          key: 'createName'
        },
        {
          title: '类型',
          slot: 'type'
        }
      ],
      routeData: [],
      planColumns: [
        {
          title: '车牌号',
          key: 'licencePlate',
          width: '100',
          align: 'center'
        },
        {
          title: '始发',
          slot: 'starting_position'
        },
        {
          title: '起始时间',
          key: 'starttime',
          width: '110'
        },
        {
          title: '到达',
          slot: 'end_position'
        },
        {
          title: '终止时间',
          width: '110',
          key: 'endtime'
        }
      ],
      planData: [],
      warnColumns: [
        {
          title: '车牌号',
          key: 'equipment',
          align: 'center'
        },
        {
          title: '内容',
          key: 'content',
          tooltip: true
        },
        {
          title: '时间',
          key: 'timestamp',
          tooltip: true
        },
        {
          title: '查看',
          slot: 'action',
          width: 80
        }
      ],
      warnData: [],
      instructionColumns: [
        {
          title: '姓名',
          key: 'name',
          align: 'center'
        },
        {
          title: '调度信息',
          key: 'msg'
        },
        {
          title: '发送时间',
          slot: 'time'
        }
      ],
      instructionData: [],
      followPiont: undefined,
      titlePiont: undefined,
      startPoint: undefined,
      endPoint: undefined,
      instructionOption: [
        {
          label: '预警信息',
          name: 'instruction'
        },
        {
          label: '调度指令',
          name: 'diaodu'
        }
      ],
      planOption: [
        {
          label: '人员',
          name: 'people'
        },
        {
          label: '工具',
          name: 'gongju'
        },
        {
          label: '路线',
          name: 'luxian'
        },
        {
          label: '计划',
          name: 'plan'
        }
      ],
      threemap: undefined
    }
  },
  components: {},
  computed: {
    ...mapGetters([
      'getDeviceFloating',
      'getInstructionFloating',
      'getPlanFloating',
      'getWarnFloating',
      'getStatisticsFloating'
    ]),
    ...mapGetters('home', [
      'getDeviceList',
      'getPositionArr', //所有设备信息
      'getDetailsShow'
    ]),
    getId() {
      return `MapContain${this._uid}`
    }
  },
  watch: {
    getPositionArr(nl) {
      this.setMapPoint(nl)
    },
    getInstructionFloating(nl) {
      if (!nl) return
      this.getInstructionList()
    },
    getWarnFloating(nl) {
      if (!nl) {
        this.warnPoint && this.warnPoint.remove()
        this.warnTitle && this.warnTitle.remove()
        return
      }
      this.getWarnList()
    },
    getPlanFloating(nl) {
      if (!nl) return
      this.getUserList()
      this.getToolList()
      this.getRouteList()
      this.getPlanList()
    }
  },
  methods: {
    ...mapActions('home', ['updateData']),
    ...mapActions(['setCount']),
    initMap() {
      this.map = new mapboxgl.Map({
        container: this.getId, // container id
        style: 'http://1.119.5.10:10002/styles/china_route.json',
        center: [112, 37.94], // starting position
        zoom: 1 // starting zoom
      })
      let map = this.map
      let that = this
      let properties = {}
      let geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: properties,
            geometry: {
              type: 'Point',
              coordinates: [109.840405, 40.658168]
            }
          },
          {
            type: 'Feature',
            properties: properties,
            geometry: {
              type: 'Point',
              coordinates: [120.750865, 30.762653]
            }
          },
          {
            type: 'Feature',
            properties: properties,
            geometry: {
              type: 'Point',
              coordinates: [98.224194, 39.803698]
            }
          },
          {
            type: 'Feature',
            properties: properties,
            geometry: {
              type: 'Point',
              coordinates: [114.679364, 22.77608]
            }
          },
          {
            type: 'Feature',
            properties: properties,
            geometry: {
              type: 'Point',
              coordinates: [104.630825, 28.760189]
            }
          },
          {
            type: 'Feature',
            properties: properties,
            geometry: {
              type: 'Point',
              coordinates: [112.144146, 32.042426]
            }
          },
          {
            type: 'Feature',
            properties: properties,
            geometry: {
              type: 'Point',
              coordinates: [112.607693, 26.900358]
            }
          }
        ]
      }

      geojson.features.forEach(function(marker) {
        // create a DOM element for the marker
        var el = document.createElement('div')
        el.className = 'markerCity'
        // add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map)
      })

      // 加载3D模型
      // this.map.on('style.load', function() {
      //   that.threemodel(map.painter.context.gl)
      // })
    },
    parseTime(val, con) {
      return parseTime(val, con)
    },
    warnPass(item) {
      let path = this.apiPath.warn.updateWarnState
      let that = this
      this.http
        .post(path, {
          id: item._id,
          state: 2
        })
        .then(res => {
          that.$store.dispatch('setCount')
          that.getWarnList()
        })
    },
    warnDo(item) {
      let path = this.apiPath.warn.updateWarnState
      let that = this
      this.http
        .post(path, {
          id: item._id,
          state: 3
        })
        .then(res => {
          that.$store.dispatch('setCount')
          that.getWarnList()
        })
    },
    searchData(data) {
      this.getDetail([data], data)
    },
    setMapPoint(arr) {
      let map = this.map
      let that = this
      map.flyTo({
        center: [arr[0].point.lon, arr[0].point.lat],
        zoom: 5
      })
      arr.map(v => {
        let point = [v.point.lon, v.point.lat]
        let e2 = document.createElement('div')
        e2.className = v.state == 1 ? 'warnMarker' : 'marker'
        e2.setAttribute('data', JSON.stringify(v))
        e2.onclick = that.makerClick
        let marker1 = new mapboxgl.Marker(e2).setLngLat(point).addTo(map)
        marker1.id = v.equipment
        marker1.data = v
        that.markerArr.push(marker1)
      })
    },

    FlyWarnpoint(row) {
      let point = [row.point.lon, row.point.lat]
      let map = this.map
      this.map.flyTo({
        center: point, // starting position
        zoom: 15
      })
      var divNode = document.createElement('div')
      divNode.innerHTML = row.content
      divNode.className = 'makerTitle'
      let e2 = document.createElement('div')
      e2.className = 'warnMarker'
      if (this.warnPoint != undefined) {
        this.warnPoint.remove()
      }
      if (this.warnTitle != undefined) {
        this.warnTitle.remove()
      }
      this.warnPoint = new mapboxgl.Marker(e2).setLngLat(point).addTo(map)
      this.warnTitle = new mapboxgl.Marker(divNode, { offset: [0, -30] })
        .setLngLat(point)
        .addTo(this.map)
    },
    makerClick(v) {
      let data = JSON.parse(v.target.getAttribute('data'))
      this.getDetail([data.device], data.device)
      this.getDeviceList.map(v => {
        let arr = v.licences.findIndex(item => {
          return item.licencePlate == data.equipment
        })
        if (arr >= 0) {
          v.expand = true
          v.licences[arr].selected = true
        }
      })
    },

    getDetail(arr, item) {
      if (!item.id) return
      let that = this
      let path = this.apiPath.deviceList.getDeviceDetails
      this.http
        .get(path, {
          id: item.id
        })
        .then(res => {
          if (!res.data) return
          let data = res.data.data
          that.deviceDetail = data
          that.$store.dispatch('home/changeDetailsShow', true)
        })
        .catch(err => {})

      let positionItem = this.markerArr.filter(
        v => v.data.equipment == item.licencePlate || item.equipment
      )[0]
      let point = [positionItem.data.point.lon, positionItem.data.point.lat]
      // this.map.flyTo({
      //   center: point, // starting position
      //   zoom: 9
      // })
      var divNode = document.createElement('div')
      divNode.innerHTML = item.licencePlate
      divNode.className = 'makerTitle'
      if (this.titlePiont != undefined) {
        this.titlePiont.remove()
      }
      this.titlePiont = new mapboxgl.Marker(divNode, { offset: [0, -30] })
        .setLngLat(point)
        .addTo(this.map)
    },
    initObj() {
      this.followPiont = undefined
    },
    getUserList() {
      let path = this.apiPath.user.getUserList
      let that = this
      this.http.get(path).then(res => {
        if (!res.data) return
        let data = res.data.data
        that.peopleData = data.data
      })
    },
    getToolList() {
      let path = this.apiPath.tool.getToolList
      let that = this
      this.http.get(path).then(res => {
        if (!res.data) return
        let data = res.data.data
        that.toolData = data
      })
    },
    getRouteList() {
      let path = this.apiPath.route.getRouteList
      let that = this
      this.http.get(path).then(res => {
        if (!res.data) return
        let data = res.data.data
        that.routeData = data
      })
    },
    getPlanList() {
      let path = this.apiPath.plan.getPlanList
      let that = this
      this.http.get(path).then(res => {
        if (!res.data) return
        let data = res.data.data
        that.planData = data
      })
    },
    getInstructionList() {
      let path = this.apiPath.deviceList.findAllTaskCommand
      let that = this
      this.http.get(path).then(res => {
        let data = res.data
        if (!data || data.length == 0) return
        that.instructionData = data.data.data
      })
    },
    getWarnList() {
      let path = this.apiPath.warn.getWarnList
      let that = this
      this.http
        .get(path, {
          limit: 5
        })
        .then(res => {
          let data = res.data.data
          if (!data || data.length == 0) return
          this.warnData = data.data
        })
    },
    makerHeightLight(makerList, item) {
      let device = item
      let maker = this.markerArr.findIndex(v => v.id == device.licencePlate)
      if (
        makerList.length == 0 ||
        makerList.findIndex(v => v.licencePlate == item.licencePlate) < 0
      ) {
        this.unHightLight(this.markerArr[maker], maker)
      } else {
        this.hightLight(this.markerArr[maker], maker)
      }
    },
    unHightLight(maker, index) {
      if (!maker) return
      let makerData = maker.data
      let that = this
      let map = this.map
      let point = [makerData.point.lon, makerData.point.lat]
      maker.remove()
      this.markerArr.splice(index, 1)
      let e2 = document.createElement('div')
      e2.className = 'marker'
      let p = document.createElement('p')
      e2.appendChild(p)
      e2.setAttribute('data', JSON.stringify(makerData))
      e2.onclick = that.makerClick
      let marker1 = new mapboxgl.Marker(e2).setLngLat(point).addTo(map)
      marker1.id = makerData.equipment
      marker1.data = makerData
      that.markerArr.push(marker1)
    },
    hightLight(maker, index) {
      if (!maker) return
      let makerData = maker.data
      let that = this
      let map = this.map
      let point = [makerData.point.lon, makerData.point.lat]
      maker.remove()
      this.markerArr.splice(index, 1)
      let e2 = document.createElement('div')
      e2.className = 'heightLight'
      let p = document.createElement('p')
      e2.appendChild(p)
      e2.setAttribute('data', JSON.stringify(makerData))
      e2.onclick = that.makerClick
      let marker1 = new mapboxgl.Marker(e2).setLngLat(point).addTo(map)
      marker1.id = makerData.equipment
      marker1.data = makerData
      that.markerArr.push(marker1)
    },
    getTrajectory(item) {
      // 获取轨迹
      let path = this.apiPath.deviceList.getTrackByTaskId
      let that = this
      this.http
        .get(path, {
          taskId: this.deviceDetail.taskId
        })
        .then(res => {
          if (!res.data) return
          let data = res.data.data
          let { lon, lat } = item.point
          that.map.flyTo({
            center: [lon, lat],
            zoom: 12
          })
          that.changeTrajectory(data)
        })
    },
    clearTrajectory() {
      // 清空轨迹
      let map = this.map
      map.removeLayer('trajectoryLine')
      map.removeSource('trajectoryLine')
      this.startPoint.remove()
      this.endPoint.remove()
    },
    changeTrajectory(data) {
      // 绘制轨迹
      let geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: data
            }
          }
        ]
      }
      // let point = data.origin
      // let endPoint = data.destination
      // let lon = point[0]
      // let lat = point[1]
      this.drawTrajectory(
        geojson
        // { lon, lat },
        // { endLon: endPoint[0], endLat: endPoint[1] }
      )
    },
    setFollowPiont() {
      // 设置跟踪点对象
      this.followPiont = this.markerArr.filter(
        v => v.data.equipment == this.deviceDetail.licencePlate
      )[0]
      this.map.flyTo({
        center: [
          this.followPiont.data.point.lon,
          this.followPiont.data.point.lat
        ],
        zoom: 16
      })
    },
    drawTrajectory(geojson) {
      // drawTrajectory(geojson, { lon, lat }, { endLon, endLat }) {
      let map = this.map

      if (map.getLayer('trajectoryLine') == null) {
        // let point = [lon, lat]
        // var divNode = document.createElement('div')
        // divNode.className = 'start'
        // this.startPoint = new mapboxgl.Marker(divNode, { offset: [0, -15] })
        //   .setLngLat(point)
        //   .addTo(this.map)
        // let endPoint = [lon, lat]
        // var endDivNode = document.createElement('div')
        // endDivNode.className = 'end'
        // this.endPoint = new mapboxgl.Marker(endDivNode, { offset: [0, -15] })
        //   .setLngLat([endLon, endLat])
        //   .addTo(this.map)
        map.addLayer({
          id: 'trajectoryLine',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': 'rgb(65,90,222)',
            'line-width': 3,
            'line-opacity': 1
          }
        })
      } else {
        map.getSource('trajectoryLine').setData(geojson)
        // map.getSource('point').setData(this.pointOnCircle(lon, lat))
        // this.startPoint.setLngLat([lon, lat])
        // this.endPoint.setLngLat([endLon, endLat])
      }
      // var xy = new mapboxgl.LngLat(lon.toString(), lat.toString())
    },
    pointOnCircle(lon, lat) {
      return {
        type: 'Point',
        coordinates: [lon, lat]
      }
    },
    initWebSocket() {
      let user = JSON.parse(cookie.get('user'))
      this.webSocket = new webSocket(
        this.apiPath.webSocket.path,
        this.socketMessage,
        'wsSocket'
      )
      let data = `{ "Type":101,"Appid": 21,"From":2,"To":0, "Connid":0,"ConnServerid":0, "content": "{\\"uid\\":${
        user.id
      },\\"user\\":\\"u\\",\\"passwd\\":\\"\\",\\"key\\":\\"\\",\\"platform\\":2,\\"lastmsgid\\":0}","time": 145546489,"Platform":1,"Payload": null}`
      this.webSocket.connect(data) // 连接服务器
    },
    socketMessage(message) {
      let data = JSON.parse(JSON.parse(JSON.stringify(message)))
      let map = this.map
      data.Content = JSON.parse(data.Content)
      let content = data.Content
      if (!content.Content) {
        return
      }
      let device = this.markerArr.filter(v => v.id == content.Content.equipment)
      let index = this.markerArr.findIndex(v => {
        return v.data.equipment == content.Content.equipment
      })
      index >= 0 &&
        (this.markerArr[index].data.point = {
          lon: content.Content.point.lon,
          lat: content.Content.point.lat
        })

      if (
        this.followPiont &&
        this.followPiont.data.equipment == content.Content.equipment
      ) {
        this.map.flyTo({
          center: [content.Content.point.lon, content.Content.point.lat],
          zoom: 16
        })
      }
      if (
        this.deviceDetail &&
        this.deviceDetail.licencePlate == content.Content.equipment &&
        this.titlePiont
      ) {
        this.titlePiont.setLngLat([
          content.Content.point.lon,
          content.Content.point.lat
        ])
      }
      if (!device[0]) {
        return
      }
      let deviceItem = device[0]
      content.Content.state = content.Content.state ? content.Content.state : 0
      let point = [content.Content.point.lon, content.Content.point.lat]
      if (deviceItem.data.state != content.Content.state) {
        let v = content.Content
        deviceItem.remove()
        this.markerArr.splice(index, 1)
        v.device = device[0].data.device
        v.state = content.Content.state
        this.creatMaker(v, point)
        return
      }
      deviceItem.setLngLat(point)
    },
    creatMaker(item) {
      let map = this.map
      let point = [item.point.lon, item.point.lat]
      let e2 = document.createElement('div')
      e2.className = item.state == 1 ? 'warnMarker' : 'marker'
      e2.setAttribute('data', JSON.stringify(item))
      e2.onclick = this.makerClick
      let marker1 = new mapboxgl.Marker(e2).setLngLat(point).addTo(map)
      marker1.id = item.equipment
      marker1.data = item
      this.markerArr.push(marker1)
    },
    threemodel(mbxContext) {
      let map = this.map
      this.threemap = new ThreeMap.ThreeMap(map, mbxContext)
      let threemap = this.threemap
      var layerGroup = threemap.layerGroup3D
      //var sceneLayer = new ThreeMap.EffectLayer(threemap)
      // sceneLayer.composer = new ThreeMap.EffectLayerComposer(
      //   threemap,
      //   sceneLayer
      // )

      var sceneLayer = new ThreeMap.RenderLayer(threemap)
      layerGroup.addLayer(sceneLayer)
      // var geometry = new Three.BoxBufferGeometry(20000, 20000, 20000)
      // var material = new Three.MeshBasicMaterial({ color: 0x00ff00 })
      // let mesh = new Three.Mesh(geometry, material)
      // mesh.frustumCulled = false
      // var origin = [116.39078972717584, 39.91545554293933]
      // this.map.flyTo({
      //   center: [116.39078972717584, 39.91545554293933],
      //   zoom: 18
      // })
      // sceneLayer.addObject(mesh, origin, {
      //   preScale: 1,
      //   scaleToLatitude: false
      // })
      var origin = [116.39078972717584, 39.91545554293933]
      new Three.MTLLoader()
        .setPath('./')
        .load('static/model/DAF.mtl', function(materials) {
          materials.preload()
          new Three.OBJLoader()
            .setMaterials(materials)
            .setPath('./')
            .load('static/model/DAF.obj', function(object) {
              object.scale.x = 0.001
              object.scale.y = 0.001
              object.scale.z = 0.001
              object.rotation.x = 3.1415926 / 2
              sceneLayer.addObject(object, origin, {
                preScale: 1,
                scaleToLatitude: false
              })

              //var originMove = [117.39078972717584, 39.91545554293933]
              //var pnt = threemap.projectToWorld(originMove)
              // object.parent.position.copy(pnt)
            })
        })
    }
  },
  beforeCreate() {},
  created() {
    this.$store.dispatch('home/updateData')
  },
  beforeMount() {},
  mounted() {
    this.initMap()
    this.initWebSocket()
  },
  beforeDestroy() {
    this.$store.dispatch('home/changeDetailsShow', false)
  },
  destroyed() {},
  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="less">
@rowColor: #2b313d;
.marker {
  display: block;
  border: none;
  cursor: pointer;
  padding: 0;
  background: url(../../../static/images/loc.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  // border-radius: 50%;
  overflow: hidden;
  width: 30px;
  height: 30px;
}
.markerCity {
  display: block;
  border: none;
  cursor: pointer;
  padding: 0;
  background: url(../../../static/images/city.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom right;
  // border-radius: 50%;
  overflow: hidden;
  width: 45px;
  height: 45px;
}
.warnMarker {
  display: block;
  border: none;
  cursor: pointer;
  padding: 0;
  background: url(../../../static/images/warnLoc.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  // border-radius: 50%;
  overflow: hidden;
  width: 30px;
  height: 30px;
}
@keyframes myfirst {
  20% {
    transform: scale(2);
  }
  40% {
    transform: scale(4);
  }
  60% {
    transform: scale(6);
  }
  80% {
    transform: scale(8);
  }
  100% {
    transform: scale(10);
  }
}
.heightLight {
  display: block;
  border: none;
  cursor: pointer;
  padding: 0;
  background: url(../../../static/images/loc.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom center;
  // border-radius: 50%;
  width: 30px;
  position: relative;
  height: 30px;
  p {
    position: absolute;
    width: 6px;
    height: 6px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    animation: myfirst 1.5s infinite;
    box-shadow: 0px 0px 2px #00bbff;
  }
}
.makerTitle {
  padding: 0px 5px;
  background-color: antiquewhite;
  border: 1px solid #cccccc;
  &::before {
    display: block;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #555555;
    width: 0;
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}
.start {
  display: block;
  border: none;
  cursor: pointer;
  padding: 0;
  background: url(../../../static/images/start.png);
  background-size: contain;
  width: 40px;
  height: 40px;
}
.end {
  display: block;
  border: none;
  cursor: pointer;
  padding: 0;
  background: url(../../../static/images/end.png);
  background-size: contain;
  width: 40px;
  height: 40px;
}

.homeWapper {
  height: 100vh;
  .instructionFloating {
    position: fixed;
    top: 30.5vh;
    width: 330px;
    height: 30vh;
    right: 70px;
    z-index: 888;
    text-align: center;
    .title {
      text-align: left;
    }
    img {
      margin: 0 auto;
      width: 90%;
    }
  }
  .statisticsFloating {
    position: fixed;
    top: 15vh;
    width: 330px;
    height: 30vh;
    right: 70px;
    z-index: 888;
    text-align: center;
    .title {
      text-align: left;
    }
    img {
      margin: 0 auto;
      width: 90%;
    }
  }
  .warnFloating {
    position: fixed;
    top: 25.5vh;
    width: 330px;
    height: 30vh;
    right: 70px;
    z-index: 888;
    text-align: center;
    .title {
      text-align: left;
    }
    img {
      margin: 0 auto;
      width: 90%;
    }
    .warnRow {
      cursor: pointer;
      background-color: @rowColor;
      display: flex;
      flex-direction: column;
      padding: 10px 20px;
      margin-top: 5px;
      font-size: 12px;
      .top {
        display: flex;
        padding: 4px 0;
        .licencePlate {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          .number {
            width: 40%;
          }
          .warn {
            padding: 0 10px;
            background-color: #fd0200;
          }
        }
        .time {
          padding: 0 20px;
        }
      }
      .bottom {
        display: flex;
        .cont {
          flex-grow: 1;
        }
        .update {
          display: flex;
          justify-content: center;
          padding: 0 10px;
          div {
            cursor: pointer;
            padding: 0px 5px;
            color: #eec843;
          }
        }
      }
    }
  }
  .floatingWindow {
    height: 30vh;
    width: 330px;
    position: fixed;
    top: 20vh;
    right: 70px;
    z-index: 99;
    .ivu-tree-title-selected,
    .ivu-tree-title-selected:hover {
      background-color: #d5e8fc;
      color: black;
    }
    .ivu-tree {
      padding-left: 18px;
    }
  }
  .planFloating {
    position: fixed;
    top: 28vh;
    width: 444px;
    height: 30vh;
    right: 70px;
    z-index: 888;
    img {
      width: 90%;
    }
  }
}
</style>
