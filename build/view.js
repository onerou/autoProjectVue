const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const reslove = (file) => path.resolve(__dirname, '../src', file)
var inquirer = require('inquirer')
// symbol const
const RouterSymbol = Symbol('router'),
	ViewsSymbol = Symbol('views'),
	StoreSymbol = Symbol('store/modules')
// root path
const rootPath = {
	[StoreSymbol]: reslove('store/modules'),
	[RouterSymbol]: reslove('router/modules'),
	[ViewsSymbol]: reslove('views')
}
//loggs
const errorLog = (error) => console.log(chalk.red(`Error:${error}`))
const defaultLog = (log) => console.log(chalk.green(`Success:${log}`))
// const files = ['router']
const files = [ 'view', 'js', 'router', 'store' ]
// module name
let moduleName = new String()
// let fileType = new String()
async function logQuestion(parms) {
	let obj = {}
	await inquirer.prompt([ parms ]).then((answers) => {
		obj = answers
	})
	return obj
}
//const string
const vueFile = (module) => `<template>
<div class='${module}Wapper'>
	${module}
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: '${module}',
  data () {
    return {}
  },
  components:{},
  computed: {
    ...mapGetters('${module}', ['getData'])
  },
  methods: {
    ...mapActions('${module}', ['updateData'])
  },
  beforeCreate() {},
  created() {
    this.$store.dispatch('${module}/updateData')
  },
  beforeMount() {},
  mounted () {},
  beforeDestroy() {},
  destroyed () {},
  beforeUpdate() {},
  updated () {}
}
</script>
<style lang="less">
.${module}Wapper{}
</style>
`

// js file
const jsFile = (module) => `
import ${module} from './${module}.vue'
export default ${module}
`
// store file
const storeFile = (module) => `import { req } from '@/utils/http'
import apiUrl from '@/api/urlPath.js'
export default {
    namespaced:true,
    state: {
        data:[]
    },
    getters: {
        getData(state){
            return state.data
        }
    },
    mutations: {
        GET_DATA(state,data){
            state.data=data
        }
    },
    actions: {
        updateData({commit}){
            console.assert(true, commit, req, apiUrl)
                // let path=apiUrl.${module}.getData
                // req.get(path).then(res=>{
                //     let data=res.data.data
                //     commit('GET_DATA',data)
                // })
        }
    }
}`

// route file
const routerFile = (module) => {
	let name = module.module
	let arr = getRouterJs(module.fatherRouter).then((res) => {
		// console.log('res: ', JSON.parse(res).path);
	})
	return `
export default [
  {
    path: '',
		name: '${name}Name',
		meta:{
			"title": "${module.title}",
			"hideInMenu": ${module.hideInMenu},
			"access":[${module.access}],
			"icon": "${module.icon}",
			"hideInBread": ${module.hideInBread},
			"notCache": ${module.notCache}
		},
    component: () => import('@/layout/${module.component}'),
    children: [
      {
        path: '/${name}',
				name: '${name}',
				meta:{
					"title": "${module.title}",
					"hideInMenu": ${module.hideInMenu},
					"access":[${module.access}],
					"icon": "${module.icon}",
					"hideInBread": ${module.hideInBread},
					"notCache": ${module.notCache}
				},
        component: () => import('@/views/${name}/${name}.vue')
      }
    ]
  }
]
`
}

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
	[
		'store',
		async (module) => {
			let modelName = module.module
			const routerPath = path.join(rootPath[StoreSymbol], `/${modelName}.js`)
			await generateFile(routerPath, storeFile(modelName))
		}
	],
	[
		'js',
		// js is not need new folder
		async (module) => {
			let modelName = module.module
			const jsPath = path.join(rootPath[ViewsSymbol], `/${modelName}/index.js`)
			await generateFile(jsPath, jsFile(modelName), rootPath[ViewsSymbol])
		}
	],
	[
		'view',
		async (module) => {
			// module file
			let modelName = module.module
			const filePath = path.join(rootPath[ViewsSymbol], modelName)
			const vuePath = path.join(filePath, `/${modelName}.vue`)
			await generateFile(vuePath, vueFile(modelName), filePath)
		}
	],
	// router is not need new folder
	[
		'router',
		async (module) => {
			let modelName = module.module
			const routerPath = path.join(rootPath[RouterSymbol], `/${modelName}.js`)
			await generateFile(routerPath, routerFile(module))
		}
	]
])

const getRouterJs = async (name) => {
	if (!name) return
	try {
		var routerPath = path.join(rootPath[RouterSymbol], `/${name}.js`)
		var res = fs.existsSync(routerPath)
		if (!res) {
			errorLog('路由不存在!!!')
			return
		}
		let data = fs.readFileSync(routerPath, 'utf8')
		con = JSON.stringify(data.slice(data.match(/\[/)).replace(/\s+/g, '').replace(/[\r\n]/g, '').replace(/\\/g, ''))
		return con
	} catch (err) {
		console.log('err: ', err)
	}
}

function moudelNameValidate(params) {
	var routerPath = path.join(rootPath[RouterSymbol], `/${params}.js`)
	var router = fs.existsSync(routerPath)
	var viewPath = path.join(rootPath[ViewsSymbol], `${params}/${params}.vue`)
	var vue = fs.existsSync(viewPath)
	var storePath = path.join(rootPath[StoreSymbol], `/${params}.js`)
	var store = fs.existsSync(storePath)
	if (params == '') {
		return '请输入模块名'
	} else if (!/^[a-zA-Z0-9_-]{3,56}$/.test(params)) {
		return '模块名不合法'
	} else if (vue && router && store) {
		return '页面已存在'
	}
	return true
}
async function init() {
	let module = await logQuestion({
		type: 'input',
		name: 'module',
		message: '请输入模块名称(3-6位英文)',
		validate: (val) => moudelNameValidate(val)
	})
	let hideInMenu = await logQuestion({
		type: 'confirm',
		name: 'hideInMenu',
		default: true,
		message: '左侧菜单是否显示'
	})
	let title = '',
		icon = ''
	if (hideInMenu.hideInMenu) {
		title = await logQuestion({
			type: 'String',
			name: 'title',
			message: '请输入左侧菜单显示文字'
		})
		icon = await logQuestion({
			type: 'String',
			name: 'icon',
			default: null,
			message: '请输入左侧菜单icon名称'
		})
	}
	let access = await logQuestion({
		type: 'checkbox',
		name: 'access',
		default: null,
		message: '请选择用户权限等级',
		choices: [
			{
				name: 'super_admin',
				value: "'super_admin'",
				key: 's'
			},
			{
				name: 'admin',
				value: "'admin'",
				key: 'a'
			},
			{
				name: 'user',
				value: "'user'",
				key: 'u'
			}
		]
	})
	let componentList = fs.readdirSync('./src/layout')
	let layout = await logQuestion({
		type: 'rawlist',
		name: 'component',
		default: null,
		message: '请选择布局组件',
		choices: componentList
	})
	// let fatherRouter = await logQuestion({
	// 	type: 'String',
	// 	name: 'fatherRouter',
	// 	default: null,
	// 	message: '请输入父组件名称',
	// })
	let config = {
		...module,
		...title,
		...hideInMenu,
		...layout,
		...access,
		// ...fatherRouter,
		...icon,
		hideInBread: true,
		notCache: true
	}
	config.hideInMenu = !config.hideInMenu
	setFile(config)
}
init()

// files
var fatherPath = false

function setFile(config) {
	try {
		if (!moduleName) {
			moduleName = config.module
		} else {
			if (config.module.length == 0) {
				return
			}
			if (!fatherPath) {
				moduleName = config.module
				defaultLog(`new module name is ${config.module}`)
				files.forEach(async (el, index) => {
					// 执行创建语句
					await generates.get(`${el}`).call(null, config)
					if (index === 0) {
						fatherPath = true
						return
					}
				})
			} else {
				defaultLog('success')
				return
			}
		}
	} catch (error) {
		errorLog(error)
	}
}
