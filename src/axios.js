/**
 * 这个封装需要研究一下:
 * 		1,官方文档的一些概念
 * 		2,封装要考虑:可默认统一处理错误或异常,但调用者也可以自定义
 * 		3,可自定义params/data等;
 * 		4,封装get/post/put/delete等，尝试统一处理第2点和第3点
 * 5,关于发送相同请求的原理
 * 6,Promise和qs的应用
 * 7,研究关于response.status的处理
 * 8,外部参数调用传到拦截器中，关于统一的错误处理在拦截器中完成
 *
 */

import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui';

// let cancel ,promiseArr = {}
// const CancelToken = axios.CancelToken;

let xhr = axios.create({
	baseURL: process.env.BASE_URL,
	timeout: 150000,
	headers: {
		'X-Requested-With': 'XMLHttpRequest'
	}
})

if (sessionStorage.getItem("key")) {
	xhr.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem("key");
}

// 默认就是这样
// xhr.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

//请求拦截器，config为传过来的所有参数
xhr.interceptors.request.use(config => {
	// 在请求发送之前做一些事

	// 有空测试以下，这是一个很好应用思路
	// if (config.method === "post") {
	// 	config.data = qs.stringify(config.data)
	// }

	//发起请求时，取消掉当前正在进行的相同请求
	// if (promiseArr[config.url]) {
	// 	promiseArr[config.url]('操作取消')
	// 	promiseArr[config.url] = cancel
	// } else {
	// 	promiseArr[config.url] = cancel
	// }

	// console.log("interceptors.request.config", config)
	return config
}, error => {
	console.log("interceptors.request.error", config)
	Promise.reject(error)
})

//响应拦截器即异常处理
xhr.interceptors.response.use(response => {
	console.log("interceptors.response.response", response)
	return response
}, error => {
	/**
	 * 满足条件：
	 * 网络出错，比如关闭服务端，会提示：Network Error，此时满足error.request
	 * 服务端处理失败，比如参数类型转换失败，会提示500错误，此时满足error.response
	 */
	// 对响应错误做点什么

	// console.log('response', response)
	console.log("this", this.config)
	console.log("xhr", xhr.config)
	console.log("interceptors.response.error", error)

	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		console.log("interceptors.response.error.response", "请求发已送，但服务器响应状态码不在2xx范围", error.response)
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		console.log("interceptors.response.error.request", "请求已发送，但没有收到服务器响应", error.request)
	} else {
		// Something happened in setting up the request that triggered an Error
		console.log("interceptors.response.error.else", "在设置触发错误的请求时发生了一些事", error)
	}

	return Promise.reject(error)
})

export const get = (url, params, timeout, pf) => {
	console.log("get", xhr.defaults)
	return xhr.get(url, {
		params: params,
		timeout: (timeout === undefined ? xhr.defaults.timeout : timeout),
		headers: {'pf': pf},
		// TODO
		// headers: {'X-Requested-With': 'XMLHttpRequest'},
		// cancelToken: new CancelToken(c => {
		// 	cancel = c
		// })
	})
	.then( resp => {
		// console.log("get.then.resp", resp)
		return resp
	})
	.catch( error => {
		// console.log("get.catch.err", error)

		if (pf === undefined || pf) {
			Message.error({
				message: error.message,
				// duration: 0,
				// showClose: true,
			});

			return Promise.resolve()
		}

		return Promise.reject(error)
	})
}

export const post = (url, pf, fd) => {
	return xhr.post(url, fd, {
		config: {
			headers: {
				// 'Content-Type': 'multipart/form-data'
				'pf': pf
			}
		}
	})
	.then( resp => {
		return resp
	})
	.catch( error => {
		if (pf === undefined || pf) {
			Message.error({
				message: error.message,
				// duration: 0,
				// showClose: true,
			});

			return Promise.resolve()
		}

		return Promise.reject(error)
	})
}
