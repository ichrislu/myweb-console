<template>
	<div class="signin">
		<el-input v-model="key" placeholder="auth key" ref="key" type="password" size="small" autofocus="true" @keyup.enter.native="signin" style="width:225px"></el-input>
		<el-button type="success" size="small" native-type="submit" @click="signin">Signin</el-button>
	</div>
</template>

<script>
export default {
	name: 'Signin',
	data() {
		return {
			url: '/authenticate',
			key: ''
		};
	},
	methods: {
		signin() {
			var my = this;

			var fd = new FormData();
			fd.append('key', my.key)

			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}

			this.axios.post(my.url, fd, config)
				.then (function (resp) {
					my.$notify({title: '成功', message: '认证成功', type: 'success'});
					sessionStorage.setItem("key", my.key)
					my.$router.push({
						path: "article/list"
					});
				})
				.catch (function (err) {
					my.$notify.error({title: '认证失败', message: err.message});
					my.$refs.key.focus();
					my.key = '';
				})
		}
	},
	init() {

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.signin {
	width: 300px;
	align-content: center;
	/* margin:auto auto; */
	left:50%;top:50%;position: absolute;margin-left:-200px;margin-top:-100px
}
</style>
