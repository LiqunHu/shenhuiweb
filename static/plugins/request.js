import axios from 'axios'

// axios
let axiosConfig = {
  // baseURL: 'http://localhost:9090',
  // baseURL: 'http://119.3.22.172/',
  timeout: 20000 // request timeout
}

// if (process.env.NODE_ENV !== 'production') {
//   axiosConfig.baseURL = process.env.BASE_API
// }

const request = axios.create(axiosConfig)
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // let token = common.getStoreData('token')
  // if (typeof (token) === 'string') {
  //   config.headers['authorization'] = token
  // }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default request
