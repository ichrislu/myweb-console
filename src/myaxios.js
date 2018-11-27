/**
 * 这个封装需要研究一下:
 * 		1,官方文档的一些概念
 * 		2,封装要考虑:可默认统一处理错误或异常,但调用者也可以自定义
 * 		3,可自定义params/data等;
 * 		4,封装get/post/put/delete等，尝试统一处理第2点和第3点
 * 5,关于发送相同请求的原理
 * 		6,Promise和qs的应用
 * 		7,研究关于response.status的处理
 *		 8,外部参数调用传到拦截器中，关于统一的错误处理在拦截器中完成
 *
 */

import axios from 'axios'
import { Message, Loading } from 'element-ui';

// let cancel ,promiseArr = {}
// const CancelToken = axios.CancelToken;

// 以下为除标准config外的自定义字段
////////////////////////////////////////
// boolean，是否统一处理错误
let $handleError = undefined;
// boolean，是否显示loading
let $loading = true;
// json，当显示loading的时候，loading配置
// let $loadingConfig = null;

// object，vue页面的vue对象。这个对象可以考虑删除了
// let $vue = undefined;
////////////////////////////////////////

// loading对象存储相关，主要解决设置loading.target的时候，loading对象非单实例问题。但是还不是很懂为什么！
let loadingCounter = 0;
let loadingAry = [];

let xhr = axios.create({
	baseURL: process.env.BASE_URL,
	timeout: 10000,
	headers: {
		'X-Requested-With': 'XMLHttpRequest'
	}
})

if (sessionStorage.getItem("key")) {
	xhr.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem("key");
}

function showLoading(config) {
	if ($loading === undefined || $loading) {
		loadingCounter++
		let loadingObj = Loading.service(config)
		loadingAry.push(loadingObj)
	}
}

function hideLoading() {
	if ($loading === undefined || $loading) {
		loadingCounter--
		if (!loadingCounter) {
			loadingAry.forEach(item=>item.close())
		}
	}
}

// xhr.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 默认就是这样，好像并非如此！
// xhr.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

//请求拦截器，config为传过来的所有参数
xhr.interceptors.request.use(config => {
	// $vue = config.vue;
	$handleError = config.handleError;
	$loading = config.loading;

	//发起请求时，取消掉当前正在进行的相同请求
	// if (promiseArr[config.url]) {
	// 	promiseArr[config.url]('操作取消')
	// 	promiseArr[config.url] = cancel
	// } else {
	// 	promiseArr[config.url] = cancel
	// }

	showLoading(config.loadingConfig)

	// console.log("interceptors.request.config", config)
	return config
}, error => {
	hideLoading()

	// console.log("interceptors.request.error", config)
	Promise.reject(error)
})

//响应拦截器即异常处理
xhr.interceptors.response.use(response => {
	hideLoading()

	// console.log("interceptors.response.response", response);
	return response
}, error => {
	/**
	 * 已测试过满足的条件：
	 * 网络出错，比如关闭服务端，会提示：Network Error，此时满足error.request
	 * 服务端处理失败，比如参数类型转换失败，会提示500错误，此时满足error.response
	 * 因为调用参数不当，比如导致内部数组越界，此时满足error(else)，很典型的就是loading设置target时非单实例，按网上做法但设置的target不存在或不正确的时候
	 */
	hideLoading()

	// 在何种场景下需要做以下区别？？？
	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		// console.log("interceptors.response.error.response", "请求发已送，但服务器响应状态码不在2xx范围", error.response)
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		// console.log("interceptors.response.error.request", "请求已发送，但没有收到服务器响应", error.request)
	} else {
		// Something happened in setting up the request that triggered an Error
		// console.log("interceptors.response.error.else", "在设置触发错误的请求时发生了一些事", error)
	}

	// 错误统一处理，则返回正常
	if ($handleError === undefined || $handleError) {
		Message.error({
			message: error.message,
			// duration: 0,
			// showClose: true,
		});

		return Promise.resolve()
	}

	// 错误不处理，返回异常
	return Promise.reject(error)
})

// install方法第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象
export default {
	install: function (Vue) {
		Vue.prototype.request = (config) => xhr.request(config)
		Vue.prototype.get = (url, config) => xhr.get(url, config)
		Vue.prototype.post = (url, data, config) => xhr.post(url, data, config)
		Vue.prototype.put = (url, data, config) => xhr.put(url, data, config)
		Vue.prototype.delete = (url, config) => xhr.delete(url, config)
	}
}
