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
					<mavon-editor v-model="form.content" :subfield="false" :boxShadow="false" defaultOpen="edit"/>
				</el-col>
			</el-form-item>
		</el-form>
		<Affix :offset-bottom="300" class="btn">
			<el-button size="small" @click="showFolder">Picture</el-button>
			<el-button size="small" type="primary" @click="onSubmit">Submit</el-button>
			<el-button size="small" @click="onCancel">Cancel</el-button>
		</Affix>

		<el-dialog title="Folder" :visible.sync="outerVisible" fullscreen>
			<el-collapse accordion v-for="(item, key) in folders" :key="key">
				<el-collapse-item :title="key" :name="key">
					<img :src="'http://localhost/pic/'+key+'/'+si" v-for="(si, sk) in item" :key="sk" v-clipboard="process.env.BASE_URL+'/pic/'+key+'/'+si"  @success="copySuccess" @error="copyError" style="cursor: pointer;">
				</el-collapse-item>
			</el-collapse>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: "NewArticle",
	data() {
		return {
			outerVisible: false,
			form: {
				title: '',
				datetime: '',
				tags: [],
				inputVisible: false,
				inputValue: '',
				content: ''
			},
			folders: [],
		};
	},
	methods: {
		showFolder() {
			var my = this;

			my.outerVisible = true

			this.get('/p')
				.then((resp) => {
					my.folders = resp.data;
				})
		},
		copySuccess() {
			this.$notify.success({ title: "复制成功" });
		},
		copyError() {
			this.$notify.error({ title: "复制失败" });
		},
		onSubmit() {
			let my = this;

			let data = new FormData();
			data.append('title', my.form.title)
			data.append('content', my.form.content)
			data.append('time', my.form.datetime)
			data.append('tag', my.form.tags)

			this.post("/admin/a", data)
				.then(resp => {
					my.$message.success({message: "添加文章成功"});
					my.$router.push({
						path: "/article/list"
					});
				})
		},
		onCancel() {
			this.$router.go(-1);
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
		// imgAdd(pos, $file) {
		// 	var my = this;

		// 	var data = new FormData();
		// 	data.append('file', $file);

		// 	this.post("/admin/f", data)
		// 		.then(resp => {
		// 			console.info("add:" + pos)
		// 			console.log("resp:" + resp.data)
		// 			my.$refs.md.$img2Url(pos, resp.data);
		// 			my.images[pos] = resp.data;
		// 			console.log("my.images[0]:" + my.images[0])
		// 			console.log("my.images[1]:" + my.images[1])
		// 		})
		// 		.catch(function(err) {
		// 			my.$notify.error({ title: "上传文件失败", message: err.message });
		// 		});
		// },
		// imgDel(pos) {
		// 	var my = this;
		// 	console.info("pos:" + pos)
		// 	var file = my.images[pos[1]];
		// 	console.log("file:" + file)
		// 	// return;

		// 	var data = new Data();
		// 	data.append('file', file)

		// 	// delete的传参不一样
		// 	let config = {
		// 		headers: {
		// 			'Content-Type': 'multipart/form-data',
		// 			"Authorization": "Bearer " + sessionStorage.getItem("key")
		// 		},
		// 		data: data
		// 	}

		// 	my.axios.delete(my.url + "/admin/f", config)
		// 		.then((resp) => {
		// 			delete my.images[pos[1]];
		// 			console.info("del success")
		// 		})
		// 		.catch(function(err) {
		// 			my.$notify.error({ title: "删除文件失败", message: err.message });
		// 		});
		// },
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
.new-article {

}
.btn {
	margin-left: 90%;
}
</style>
