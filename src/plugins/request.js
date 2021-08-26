import axios from 'axios'
export function request(config, success, failure) {
    //创建axios实例
    const instance = axios.creat({
        baseURL: 'http://localhost:3000',
        timeout: 50000
    })
    //发送真正的网络请求
    instance(config.baseconfig)
        .then(res => {
            // console.log(res) //要回调出去
            success(res) //回调
        })
        .catch(err => {
            // console.log(err) //要回调出去
            failure(err) //回调
        })
}

//调用方法
// import {request} from "./plugins/request"
// request({ //config
//   url: '',
// }, res => { //success
//   console.log(res)
// }, err => { //failure
//   console.log(err)
// })