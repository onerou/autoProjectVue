<template>
  <div class="homeWapper">
    <div :id="getId" style="height:100vh;" @mousedown="initObj" @mousewheel="initObj"></div>
    <device-floating title="运输工具信息" class="floatingWindow">
      <Tree :data="getDeviceList" @on-select-change="getDetail"></Tree>
    </device-floating>
    <device-details
      :details="deviceDetail"
      @setFollowPiont="setFollowPiont"
      @getTrajectory="getTrajectory"
    ></device-details>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import cookie from '@/utils/cookie.js'
import webSocket from '@/utils/webSocket.js'
export default {
  name: 'home',
  data() {
    return {
      map: {},
      data2: [],
      deviceDetail: {},
      markerArr: [],
      followPiont: undefined,
      titlePiont: undefined
    }
  },
  components: {},
  computed: {
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
    }
  },
  methods: {
    ...mapActions('home', ['updateData']),
    initMap() {
      this.map = new mapboxgl.Map({
        container: this.getId, // container id
        style: 'http://service.piesat.cn:10002/styles/basic.json',
        center: [112, 37.94], // starting position
        zoom: 2 // starting zoom
      })
    },
    setMapPoint(arr) {
      let map = this.map
      let that = this
      map.flyTo({
        center: [arr[0].point.lon, arr[0].point.lat],
        zoom: 9
      })
      arr.map(v => {
        let point = [v.point.lon, v.point.lat]
        var e2 = document.createElement('div')
        e2.className = 'marker'
        var marker1 = new mapboxgl.Marker(e2).setLngLat(point).addTo(map)
        marker1.id = v.equipment
        marker1.data = v
        that.markerArr.push(marker1)
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
      let positionItem = this.markerArr.filter(
        v => v.data.equipment == item.licencePlate
      )[0]
      let point = [positionItem.data.point.lon, positionItem.data.point.lat]
      var divNode = document.createElement('div')
      divNode.innerHTML = item.licencePlate
      console.log('TCL: getDetail -> divNode.innerHTML', divNode.innerHTML)
      if (this.titlePiont) {
        console.log('TCL: getDetail -> this.titlePiont', this.titlePiont)
        this.titlePiont.setLngLat(point).setHTML(divNode)
        return
      }
      this.titlePiont = new mapboxgl.Marker(divNode, { offset: [0, -20] })
        .setLngLat(point)
        .addTo(this.map)
    },
    initObj() {
      this.followPiont = undefined
    },
    getTrajectory(item) {
      // 获取轨迹
      let path = this.apiPath.deviceList.getTrajectory
      let that = this
      this.http
        .get(path, {
          routePlanningId: this.deviceDetail.route_planning
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
    changeTrajectory(data) {
      // 绘制轨迹
      let geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: data.tracks
            }
          }
        ]
      }
      let point = data.origin.split(',')
      let lon = point[0]
      let lat = point[1]

      this.drawTrajectory(geojson, { lon, lat })
    },
    setFollowPiont() {
      // 设置跟踪点对象
      console.log(
        'TCL: setFollowPiont -> this.deviceDetail.equipment',
        this.deviceDetail
      )
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
    drawTrajectory(geojson, { lon, lat }) {
      let map = this.map
      if (map.getLayer('line') == null) {
        map.addLayer({
          id: 'line',
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
            'line-color': '#0090FA ',
            'line-width': 3,
            'line-opacity': 1
          }
        })
      } else {
        map.getSource('line').setData(geojson)
        // map.getSource('point').setData(this.pointOnCircle(lon, lat))
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
      this.webSocket = new webSocket(
        this.apiPath.webSocket.path,
        this.socketMessage,
        'wsSocket'
      )
      let data =
        '{ "Type":101,"Appid": 21,"From":1762,"To":0, "Connid":0,"ConnServerid":0, "content": "{\\"uid\\":1768,\\"user\\":\\"u\\",\\"passwd\\":\\"\\",\\"key\\":\\"\\",\\"platform\\":2,\\"lastmsgid\\":0}","time": 145546489,"Platform":1,"Payload": null}'
      this.webSocket.connect(data) // 连接服务器
    },
    socketMessage(message) {
      let data = JSON.parse(JSON.parse(JSON.stringify(message)))
      data.Content = JSON.parse(data.Content)
      let content = data.Content
      if (!content.Content) {
        return
      }
      let device = this.markerArr.filter(v => v.id == content.Content.equipment)
      let index = this.markerArr.indexOf(v => v.id == content.Content.equipment)
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
        this.titlePiont.setLngLat([
          content.Content.point.lon,
          content.Content.point.lat
        ])
      }
      if (!device[0]) {
        return
      }
      device[0].setLngLat([
        content.Content.point.lon,
        content.Content.point.lat
      ])
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
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="less">
.marker {
  display: block;
  border: none;
  cursor: pointer;
  padding: 0;
  background: url(../../../static/images/loc.png);
  width: 20px;
  height: 20px;
}
.homeWapper {
  height: 100vh;
  .floatingWindow {
    height: 30vh;
    min-width: 20vw;
    position: fixed;
    top: 20vh;
    right: 5vw;
    z-index: 99;
    .ivu-tree-title-selected,
    .ivu-tree-title-selected:hover {
      background-color: #d5e8fc;
      color: black;
    }
    .ivu-tree {
      padding-left: 2vw;
    }
  }
}
</style>
