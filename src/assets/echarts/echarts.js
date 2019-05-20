let echarts = require('echarts/lib/echarts')
//首页
export function chart1(id, xData, dataVal) {
	//首页中的用户访问统计图表
	var option = {
		color: '#87babc',
		animate: true,
		title: {
			text: '用户访问统计',
			textStyle: {
				color: '#0099cc',
				fontSize: 16,
				fontWeight: 'normal'
			},
			padding: [ 15, 20, 30, 35 ]
		},
		tooltip: {
			trigger: 'axis',
			formatter: '统计次数 : {c}'
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: xData
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				data: dataVal,
				type: 'line',
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: '#88dae5'
							},
							{
								offset: 0.5,
								color: '#c0ecf2'
							},
							{
								offset: 1,
								color: '#f0fbfd'
							}
						])
					}
				}
			}
		]
	}
	id.setOption(option)
}
export function chart2(id, xData, dataVal) {
	//首页下载数据总量
	var option = {
		color: [ '#3398DB' ],
		grid: {
			left: '10px',
			right: '20px',
			bottom: '40px',
			top: '50px',
			containLabel: true
		},
		xAxis: [
			{
				//就是一月份这个显示为一个线段，而不是数轴那种一个点点
				show: true,
				boundaryGap: true,
				type: 'category',

				data: xData,
				axisLine: {
					//y轴
					show: false
				},
				axisTick: {
					//y轴刻度线
					show: false
				},
				splitLine: {
					//网格线
					show: false
				},
				axisLabel: {
					show: true,
					// formatter: '{value} 月',
					formatter: function(value) {
						return value + '月'
					},
					textStyle: {
						color: '#333'
					}
				}
			}
		],
		yAxis: [
			{
				show: false,
				type: 'value',
				name: '销量(kg)',
				splitLine: {
					show: false
				}
			}
		],
		series: [
			{
				name: '直接访问',
				type: 'bar',
				barWidth: '60%',
				data: dataVal,
				label: {
					normal: {
						show: true,
						position: 'top',
						color: '#333'
					}
				},
				itemStyle: {
					normal: {
						barBorderRadius: [ 50, 50, 50, 50 ],
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: '#83d7ee'
							},
							{
								offset: 0.5,
								color: '#8dbae0'
							},
							{
								offset: 1,
								color: '#949dd1'
							}
						])
					}
				},

				barMaxWidth: '15'
			}
		]
	}
	id.setOption(option)
}
export function chart3(id, dataVal) {
	//首页中最近五年成果总量统计
	let timeArr = []
	dataVal.map((v) => {
		timeArr.push(v.name)
	})
	var option = {
		color: [ '#9860ec', '#39a1ff', '#4ecc73', '#f9d536', '#ef4a65' ],
		tooltip: {
			trigger: 'item',
			formatter: '{b}: {c} ({d}%)'
		},
		title: {
			text: '最近五年成果总量统计',
			textStyle: {
				color: '#0099cc',
				fontSize: 16,
				fontWeight: 'normal'
			},
			padding: [ 15, 20, 30, 35 ]
		},
		legend: {
			orient: 'vertical',
			x: '35px',
			y: '45px',
			data: timeArr
		},
		series: [
			{
				// name: '2018年',
				type: 'pie',
				radius: [ '50%', '70%' ],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				},
				itemStyle: {
					borderWidth: 3, //设置border的宽度有多大
					borderColor: '#fff'
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: dataVal
			}
		]
	}
	id.setOption(option)
}
//业务监控
export function mointorCharts(id, data) {
	console.log('TCL: mointorCharts -> data', data)

	function randomData() {
		now = new Date(+now + oneDay)
		value = value + Math.random() * 21 - 10
		return {
			name: now.toString(),
			value: [ [ now.getFullYear(), now.getMonth() + 1, now.getDate() ].join('/'), Math.round(value) ]
		}
	}

	var now = +new Date(1997, 9, 3)
	var oneDay = 24 * 3600 * 1000
	var value = Math.random() * 1000
	for (var i = 0; i < 1000; i++) {
		data.push(randomData())
	}

	console.log(data)

	var option = {
		color: '#356787',
		tooltip: {
			trigger: 'axis',
			formatter: function(params) {
				params = params[0]
				var date = new Date(params.name)
				return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1]
			},
			axisPointer: {
				animation: false
			}
		},
		xAxis: {
			type: 'time',
			splitLine: {
				show: false
			}
		},
		yAxis: {
			type: 'value',
			boundaryGap: [ 0, '100%' ],
			splitLine: {
				show: false
			}
		},
		series: [
			{
				name: '模拟数据',
				type: 'line',
				showSymbol: false,
				hoverAnimation: false,
				data: data
			}
		]
	}

	id.setOption(option)
	setInterval(function() {
		for (var i = 0; i < 5; i++) {
			data.shift()
			data.push(randomData())
		}

		id.setOption({
			series: [
				{
					data: data
				}
			]
		})
	}, 1000)
}
export function barCharts(id, data) {
	var option = {
		// title: {
		// 	text: '某站点用户访问来源',
		// 	subtext: '纯属虚构',
		// 	x: 'center'
		// },
		color: [ '#F79756', '#8771BF' ],
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)'
		},
		legend: {
			orient: 'horizontal',
			right: '5%',
			top: '20%',
			data: [ '已使用', '未使用' ]
		},
		series: [
			{
				type: 'pie',
				radius: '90%',
				center: [ '45%', '50%' ],
				data: data,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	}
	console.log(option)
	id.setOption(option)
}
