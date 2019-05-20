const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const reslove = file => path.resolve(__dirname, '../src', file)
const view = "views"
const RouterSymbol = Symbol('router'),
    ViewsSymbol = Symbol(view),
    StoreSymbol = Symbol('store/modules'),
    globalSymbol = Symbol('global')

const rootPath = {
    [StoreSymbol]: reslove('store/modules'),
    [RouterSymbol]: reslove('router/modules'),
    [ViewsSymbol]: reslove(view),
    [globalSymbol]: reslove('components/global')

}
const errorLog = error => console.log(chalk.red(`Error:${error}`))
const defaultLog = log => console.log(chalk.green(`Success:${log}`))
let moduleName = new String()
var inquirer = require('inquirer')
async function logQuestion(parms) {
    let obj = {}
    await inquirer.prompt([parms]).then(answers => {
        obj = answers
    })
    return obj
}

const delFile = async (filePath, dirPath = '') => {
    try {
        // create file if file not exit
        if ((await fs.existsSync(filePath))) {
            // create file
            await fs.unlink(filePath, function (err) {
                if (err) return errorLog(err);
                defaultLog(`delete ${filePath}`)
            })
        }
        if (dirPath !== '' && dirPath != rootPath[ViewsSymbol] && !fs.existsSync(filePath)) {
            await fs.rmdir(dirPath, function (err) {
                if (err) return errorLog(err);
                defaultLog(`delete ${dirPath}`)
            })
        }
    } catch (error) {
        errorLog(error)
    }
}
const generates = new Map([
    [
        'store',
        async module => {
            const routerPath = path.join(rootPath[StoreSymbol], `/${module}.js`)
            await delFile(routerPath)
        }
    ],
    [
        'js',
        // js is not need new folder
        async module => {
            const jsPath = path.join(rootPath[ViewsSymbol], `/${module}/index.js`)
            await delFile(jsPath, rootPath[ViewsSymbol])
        }
    ],
    [
        'global',
        async module => {
            const globalPath = path.join(rootPath[globalSymbol], `/${module}.vue`)
            await delFile(globalPath)
        }
    ],
    [
        'view',
        async module => {
            // module file
            const filePath = path.join(rootPath[ViewsSymbol], module)
            const vuePath = path.join(filePath, `/${module}.vue`)
            await delFile(vuePath, filePath)
        }
    ],
    [
        'router',
        async module => {
            const routerPath = path.join(rootPath[RouterSymbol], `/${module}.js`)
            await delFile(routerPath)
        }
    ]
])

const files = ['router', 'store', 'view', 'js']
var fatherPath = false

const viewValidate = chunk => {
    var routerPath = path.join(rootPath[RouterSymbol], `/${chunk}.js`)
    var router = fs.existsSync(routerPath)
    var viewPath = path.join(rootPath[ViewsSymbol], `${chunk}/${chunk}.vue`)
    var vue = fs.existsSync(viewPath)
    var storePath = path.join(rootPath[StoreSymbol], `/${chunk}.js`)
    var store = fs.existsSync(storePath)
    return (!vue && !router && !store) ? "页面不存在" : true && delView(chunk)
}
const globalValidate = chunk => {
    var globalPath = path.join(rootPath[globalSymbol], `/${chunk}.vue`)
    var global = fs.existsSync(globalPath)
    return (!global) ? "页面不存在" : true && delGlobal(chunk)
}

function delView(chunk) {
    try {
        if (!moduleName) {
            moduleName = chunk
        } else {
            if (chunk.length == 0) {
                return
            }
            moduleName = chunk
            files.forEach(async (el, index) => {
                // 执行创建语句
                await generates.get(`${el}`)(chunk.toString())
                if (index === files.length - 1) {
                    await fs.rmdir(path.join(rootPath[ViewsSymbol], moduleName), function (err) {
                        if (err) return errorLog(err);
                        defaultLog(`delete ${path.join(rootPath[ViewsSymbol], moduleName)}`)
                        defaultLog(`delete module name is ${chunk}`)
                    })
                }
            })
        }
    } catch (error) {
        errorLog(error)
    }
    return true
}

function delGlobal(chunk) {
    try {
        if (!moduleName) {
            moduleName = chunk
        } else {
            if (chunk.length == 0) {
                return
            }
            moduleName = chunk
            defaultLog(`delete module name is ${chunk}`);
            ["global"].forEach(async (el, index) => {
                // 执行创建语句
                await generates.get(`${el}`)(chunk.toString())
                if (index === files.length - 1) {
                    setTimeout(() => {
                        fs.rmdir(path.join(rootPath[ViewsSymbol], moduleName), function (err) {
                            if (err) return errorLog(err);
                            defaultLog(`delete ${path.join(rootPath[ViewsSymbol], moduleName)}`)
                            defaultLog(`delete module name is ${chunk}`)
                        })
                    })
                }
            })
        }
    } catch (error) {
        errorLog(error)
    }
    return true
}
init()
async function init() {
    let type = await logQuestion({
        type: 'rawlist',
        name: 'type',
        default: null,
        message: '请选择删除类型',
        choices: ["view", "global"],
    })
    let module = await logQuestion({
        type: 'String',
        name: 'name',
        message: '请输入模块名称(3-6位英文)',
        validate: name => type.type == "view" ? viewValidate(name) : globalValidate(module.name)
    })

}