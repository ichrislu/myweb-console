/**
 * 这个封装需要研究一下:
 * 1,官方文档的一些概念
 * 2,封装要考虑:可默认统一处理错误或异常,但调用者也可以自定义;可自定义header/认证等;
 * 3,关于发送相同请求的原理
 * 4,Promise和qs的应用
 *
 * 可参考如下页面:
 * 官方:https://github.com/axios/axios
 * 主要参考的这个:https://segmentfault.com/a/1190000012332982
 * https://blog.csdn.net/qq_30669833/article/details/81701588
 * https://www.jianshu.com/p/0229211ea679
 * https://www.cnblogs.com/fantasy-zxf/p/7551333.html
 * https://blog.csdn.net/qq_28027903/article/details/77648482
 */

//引入axios
import axios from 'axios'

let cancel ,promiseArr = {}
const CancelToken = axios.CancelToken;

//请求拦截器
axios.interceptors.request.use(config => {
	//发起请求时，取消掉当前正在进行的相同请求
	if (promiseArr[config.url]) {
		promiseArr[config.url]('操作取消')
		promiseArr[config.url] = cancel
	} else {
		promiseArr[config.url] = cancel
	}
	return config
}, error => {
	return Promise.reject(error)
})

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
	return response
}, error => {
	if (error && error.response) {
		switch (error.response.status) {
		case 400:
			error.message = '错误请求'
			break;
		case 401:
			error.message = '未授权，请重新登录'
			break;
		case 403:
			error.message = '拒绝访问'
			break;
		case 404:
			error.message = '请求错误,未找到该资源'
			break;
		case 405:
			error.message = '请求方法未允许'
			break;
		case 408:
			error.message = '请求超时'
			break;
		case 500:
			error.message = '服务器端出错'
			break;
		case 501:
			error.message = '网络未实现'
			break;
		case 502:
			error.message = '网络错误'
			break;
		case 503:
			error.message = '服务不可用'
			break;
		case 504:
			error.message = '网络超时'
			break;
		case 505:
			error.message = 'http版本不支持该请求'
			break;
		default:
			error.message = `连接错误${error.response.status}`
		}
	} else {
		// 这里不一定就是连接服务器失败吧?
		error.message = "连接到服务器失败"
	}
	message.error(error.message) // 这是做什么?
	return Promise.resolve(error.response)
})

axios.defaults.baseURL = process.env.BASE_URL
//设置默认请求头
axios.defaults.headers = {
	'X-Requested-With': 'XMLHttpRequest'
}
axios.defaults.timeout = 10000

export default {
	//get请求
	get (url, params) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url,
				headers: {'X-Requested-With': 'XMLHttpRequest'},
				params: params,
				cancelToken: new CancelToken(c => {
					cancel = c
				})
			}).then(res => {
				resolve(res)
			})
		})
	},
	//post请求
	post (url, param) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'post',
				url,
				data: param,
				cancelToken: new CancelToken(c => {
					cancel = c
				})
			}).then(res => {
				resolve(res)
			})
		})
	}
}
