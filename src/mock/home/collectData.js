import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
let arr = [
	{
		name: '激光拉曼光谱仪',
		varColor: {
			background: '#f2c245'
		}
	},
	{
		name: '地震仪',
		varColor: {
			background: '#f4797a'
		}
	},
	{
		name: 'ADV',
		varColor: {
			background: '#8771BF'
		}
	},
	{
		name: 'ADCP',
		varColor: {
			background: '#68BEE0'
		}
	},
	{
		name: '磁力计',
		varColor: {
			background: '#f79756'
		}
	},
	{
		name: 'KPA',
		varColor: {
			background: '#3f4f61'
		}
	},
	{
		name: '流速仪',
		varColor: {
			background: '#7c5ba5'
		}
	},
	{
		name: 'CTD',
		varColor: {
			background: '#68C6A6'
		}
	}
]
const Random = Mock.Random

export const getCollectData = (req) => {
	let tableData = {
		code: 0,
		data: []
	}
	arr.map((v) => {
		tableData.data.push(
			Mock.mock({
				name: v.name,
				'numbers|1-10000': 1,
				varColor: {
					background: v.varColor.background
				}
			})
		)
	})
	return tableData
}
