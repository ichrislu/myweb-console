<template>
	<div class="signin">
		<el-input v-model="key" placeholder="auth key" ref="key" type="password" size="small" autofocus="true" @keyup.enter.native="signin" style="width:225px"></el-input>
		<el-button type="success" size="small" native-type="submit" @click="signin">Signin</el-button>
	</div>
</template>

<script>
import qs from 'qs'

export default {
	name: 'Signin',
	data() {
		return {
			key: ''
		};
	},
	methods: {
		signin() {
			let my = this;

			// let data = new FormData();
			// data.append('key', my.key)
			let data = qs.stringify({'key': my.key})

			let config = {
				handleError: false,
			}

			this.post('/authenticate', data, config)
				.then (resp => {
					my.$message.success({message: '认证成功'});
					sessionStorage.setItem("key", my.key)
					my.$router.push({
						path: "article/list"
					});
				})
				.catch (err => {
					my.$message.error({message: err.message});
					my.$refs.key.focus();
					my.key = '';
				})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.signin {
	width: 300px;
	align-content: center;
	/* margin:auto auto; */
	left: 50%;
	top: 50%;
	position: absolute;
	margin-left:-200px;
	margin-top:-100px;
}
</style>
