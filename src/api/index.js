// 导入axios
import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
import JSONBIG from 'json-bigint'

// 配置axios
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// if (local.getUser()) {
//   axios.defaults.headers.Authorization = `Bearer ${local.getUser().token}`
// }

// 解决js的最大安全数值问题
axios.defaults.transformResponse = [ (data) => {
  // 对 data 进行任意转换处理
  // 理想情况转换,不理想情况下显示原数据
  // 如后台可能没有任何的响应内容 让data的内容为null
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]

// 添加请求拦截器，在每一次发请求之前，获取本地的token

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器，
// token是有有效期的，2小时后失效
// 当token的值错误或者token的值为空时，会报401错误，此时应该跳转到登录页面，重新登录获取信息
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response.status === 401) {
    // window.location.href = 'http://localhost:8080/#/login'
    // window.location.hash = '#/login'
    return router.push('/login')
  }
  return Promise.reject(error)
})
// 导出axios
export default axios
