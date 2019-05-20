/*
 * fast add new view script
 */
const path = require('path')
var inquirer = require('inquirer')
const fs = require('fs')
const chalk = require('chalk')
const reslove = (file) => path.resolve(__dirname, '../src', file)
// symbol const
const globalSymbol = Symbol('global')
// root path
const rootPath = {
	[globalSymbol]: reslove('components/global')
}
async function logQuestion(parms) {
	let obj = {}
	await inquirer.prompt([ parms ]).then((answers) => {
		obj = answers
	})
	return obj
}
//loggs
const errorLog = (error) => console.log(chalk.red(`${error}`))
const defaultLog = (log) => console.log(chalk.green(`${log}`))
// module name
let moduleName = new String()
// let fileType = new String()
//const string

// route file
const globalFile = (module) => `<template>
<div class='${module}Wapper'></div>
</template>
<script>
export default {
  name: '${module}',
  data () {
    return {}
  },
  methods: {},
  created() {}
}
</script>

<style lang="less">
.${module}Wapper{}
</style>
`
/**
 * generate file
 * @param {*} filePath
 * @param {*} content
 * @param {*} dirPath
 */
const generateFile = async (filePath, content, dirPath = '') => {
	try {
		// create file if file not exit
		if (dirPath !== '' && !await fs.existsSync(dirPath)) {
			await fs.mkdirSync(dirPath)
			defaultLog(`created ${dirPath}`)
		}
		if (!await fs.existsSync(filePath)) {
			// create file
			await fs.openSync(filePath, 'w')
			defaultLog(`created ${filePath}`)
		}
		await fs.writeFileSync(filePath, content, 'utf8')
	} catch (error) {
		errorLog(error)
	}
}
// module-method map
const generates = new Map([
	// global is not need new folder
	[
		'global',
		async (module) => {
			const globalPath = path.join(rootPath[globalSymbol], `/${module}.vue`)
			await generateFile(globalPath, globalFile(module))
		}
	]
])
init()
async function init() {
	let module = await logQuestion({
		type: 'String',
		name: 'module',
		message: '请输入组件名称（驼峰命名）'
	})
	setGlobal(module.module)
}

function setGlobal(chunk) {
	try {
		if (!moduleName) {
			moduleName = chunk
		} else {
			defaultLog(`new module name is ${chunk}`)
			files.forEach(async (el, index) => {
				// 执行创建语句
				await generates.get(`${el}`).call(null, chunk.toString())
				if (index === files.length - 1) {
					defaultLog('create module success')
				}
			})
		}
	} catch (error) {
		errorLog(error)
	}
}

// process.stdout.write('请输入全局模块名称(英文)：')
// // files
const files = [ 'global' ]
// // 和命令行进行交互 获取的创建的模块名称
// process.stdin.on('data', chunk => {
//     try {
//         if (!moduleName) {
//             moduleName = chunk
//         } else {
//             chunk = chunk.slice(0, -2) // delete /n
//             defaultLog(`new module name is ${chunk}`)
//             files.forEach(async (el, index) => {
//                 // 执行创建语句
//                 await generates.get(`${el}`).call(null, chunk.toString())
//                 if (index === files.length - 1) {
//                     process.stdin.emit('end')
//                 }
//             })
//         }
//     } catch (error) {
//         errorLog(error)
//     }
// })
// process.stdin.on('end', () => {
//     defaultLog('create module success')
// })
