import axios from 'axios'
import history from './history'
axios.interceptors.response.use(config => {
    debugger
    if (localStorage.token) {
        config.headers.Authorization = localStorage.token
    }
    return config
}, error => {
    return Promise.reject(error)
})
axios.interceptors.response.use(res => {
    if (res.data.code !== 0) {
        return Promise.reject(res)
    }
    return res
}, error => {
    console.log(error)
    debugger
    if (error.response.status === 401) {
        history.push('/')
    }
    return Promise.reject(error.response.data)
})
export function signin(data) {
    return axios({
        url: "http://localhost:8080/signin",
        method: "post",
        data
    }).then(res => {
        console.log(res)
        let result = res.data
        let token = result.data.token
        localStorage.setItem('token', token)
        // console.log(localStorage.getItem('token'))
        return result
    })
}
export function getUser() {
    // console.log(localStorage.getItem('token'))
    return axios({
        url: "http://localhost:8080/user",
        method: "get",
        // headers: {
        //   "Authorization": `${localStorage.getItem('token')}`
        // }
    })
        .then(res => res.data)
}