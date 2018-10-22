<template>
	<div class="signin">
    <el-button type="success" size="small" native-type="submit" @click="signin">Signin</el-button>
	</div>
</template>

<script>
export default {
  name: 'Signin',
  data() {
    return {
			url: process.env.BASE_URL + '/authenticate',
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
          my.$message({message: '认证成功', type: 'success'});
				})
				.catch (function (err) {
          my.$message.error("认证失败：" + err.message);
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
  left:50%;top:50%;position: absolute;margin-left:-200px;margin-top:-100px
}
</style>
