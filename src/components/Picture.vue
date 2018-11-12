<template>
	<div class="Picture">
		<el-upload :action="url" :headers="headers" name="file" multiple list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
		<span>{{ new Date() | moment("YYYY") }}</span>
	</div>
</template>

<script>
export default {
	name: "Picture",
	data() {
		return {
			dialogImageUrl: '',
			dialogVisible: false,
			url: process.env.BASE_URL + '/admin/f',
			key: sessionStorage.getItem('key'),
			// _date: formatDate(new Date(), 'yyyy'),
			headers: {
				'Authorization': 'Bearer a'// + this.key
			}
		};
	},
	mounted() {
		console.log(this.url)
		console.log(this.key)
		console.log(this.headers)
		console.log(this.$moment(new Date()).format('YYMM'));
	},
	methods: {
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleRemove(file, fileList) {
			var my = this;

			var fd = new FormData();
			fd.append('file', file.response)

			// delete的传参不一样
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					"Authorization": "Bearer " + sessionStorage.getItem("key")
				},
				data: fd
			}

			my.axios.delete(my.url, config)
				.then((resp) => {
					console.info("del success")
				})
				.catch(function(err) {
					my.$notify.error({ title: "删除文件失败", message: err.message });
				});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
