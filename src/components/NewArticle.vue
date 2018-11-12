<template>
	<div class="new-article">
		 <el-form ref="form" :model="form" label-width="50px">
			<el-form-item label="Title">
				<el-col :span="5">
					<el-input v-model="form.title"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="Time">
				<el-col :span="1">
					<el-date-picker v-model="form.datetime" type="datetime" value-format="yyyy-MM-ddTHH:mm:ss+08:00" placeholder="选择日期时间"></el-date-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="Tags">
				<el-col :span="10">
					<el-tag :key="tag" v-for="tag in form.tags" closable :disable-transitions="false" @close="handleClose(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="form.inputVisible" v-model="form.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
				</el-col>
			</el-form-item>
			<el-form-item label="Content">
				<el-col :span="20">
					<mavon-editor v-model="form.content" ref="md" :subfield="false" :boxShadow="false" defaultOpen="edit" @imgAdd="imgAdd" @imgDel="imgDel"/>
				</el-col>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">Submit</el-button>
				<el-button @click="onCancel">Cancel</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: "NewArticle",
	data() {
		return {
			url: process.env.BASE_URL,
			form: {
				title: '',
				datetime: '',
				tags: [],
				inputVisible: false,
				inputValue: '',
				content: ''
			},
			images: {}
		};
	},
	methods: {
		onSubmit() {
			var my = this;

			var fd = new FormData();
			fd.append('title', my.form.title)
			fd.append('content', my.form.content)
			fd.append('time', my.form.datetime)
			fd.append('tag', my.form.tags)

			console.info(my.form.content);

			let config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					"Authorization": "Bearer " + sessionStorage.getItem("key")
				}
			}

			this.axios.post(my.url + "/admin/a", fd, config)
				.then(function(resp) {
					my.$notify.success({ title: "提示", message: "添加文章成功" });
					my.$router.push({
						path: "/article/list"
					});
				})
				.catch(function(err) {
					my.$notify.error({ title: "添加文章失败", message: err });
				});
		},
		onCancel() {
			this.$router.back();
		},

		handleClose(tag) {
			this.form.tags.splice(this.form.tags.indexOf(tag), 1);
		},

		showInput() {
			this.form.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputConfirm() {
			let inputValue = this.form.inputValue;
			if (inputValue) {
				this.form.tags.push(inputValue);
			}
			this.form.inputVisible = false;
			this.form.inputValue = '';
		},

		imgAdd(pos, $file) {
			var my = this;

			var formdata = new FormData();
			formdata.append('file', $file);

			let config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					"Authorization": "Bearer " + sessionStorage.getItem("key")
				}
			}

			my.axios.post(my.url + "/admin/f", formdata, config)
				.then((resp) => {
					console.info("add:" + pos)
					console.log("resp:" + resp.data)
					my.$refs.md.$img2Url(pos, resp.data);
					my.images[pos] = resp.data;
					console.log("my.images[0]:" + my.images[0])
					console.log("my.images[1]:" + my.images[1])
				})
				.catch(function(err) {
					my.$notify.error({ title: "上传文件失败", message: err.message });
				});
		},

		imgDel(pos) {
			var my = this;
			console.info("pos:" + pos)
			var file = my.images[pos[1]];
			console.log("file:" + file)
			// return;

			var fd = new FormData();
			fd.append('file', file)

			// delete的传参不一样
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					"Authorization": "Bearer " + sessionStorage.getItem("key")
				},
				data: fd
			}

			my.axios.delete(my.url + "/admin/f", config)
				.then((resp) => {
					delete my.images[pos[1]];
					console.info("del success")
				})
				.catch(function(err) {
					my.$notify.error({ title: "删除文件失败", message: err.message });
				});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
	width: 200px;
	min-height: 400px;
}
.el-tag + .el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
