import { req } from '@/utils/http'
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
                // let path=apiUrl.login.getData
                // req.get(path).then(res=>{
                //     let data=res.data.data
                //     commit('GET_DATA',data)
                // })
        }
    }
}