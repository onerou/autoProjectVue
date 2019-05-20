import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
let arr = [
	{
		title: '地球物理#1',
		status: '正常',
		time: '2018.01.01'
	},
	{
		title: '地球物理#2',
		status: '正常',
		time: '2018.01.01'
	},
	{
		title: '海底动力',
		status: '正常',
		time: '2018.01.01'
	},
	{
		title: '激光拉曼#1',
		status: '正常',
		time: '2018.01.01'
	},
	{
		title: '激光拉曼#2',
		status: '正常',
		time: '2018.01.01'
	}
]
const Random = Mock.Random

export const getMointorData = (req) => {
	let tableData = {
		code: 0,
		data: []
	}
	arr.map((v) => {
		tableData.data.push(
			Mock.mock({
				title: v.title,
				status: v.status,
				time: v.time
			})
		)
	})
	return tableData
}
