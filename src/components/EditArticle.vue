<template>
	<div class="edit-article">
		 <el-form ref="form" :model="form" label-width="50px">
			<el-form-item label="Title">
				<el-col :span="5">
					<el-input v-model="form.title"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="Issue Time">
				<el-col :span="1">
					<el-date-picker v-model="form.issue_time" type="datetime" value-format="yyyy-MM-ddTHH:mm:ss+08:00" placeholder="选择日期时间"></el-date-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="Update Time">
				<el-col :span="1">
					<el-date-picker v-model="form.update_time" type="datetime" value-format="yyyy-MM-ddTHH:mm:ss+08:00" placeholder="选择日期时间"></el-date-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="Tags">
				<el-col :span="10">
					<el-tag :key="tag" v-for="tag in form.tags" closable :disable-transitions="false" @close="closeTag(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="form.inputVisible" v-model="form.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="addTag" @blur="addTag"></el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
				</el-col>
			</el-form-item>
			<el-form-item label="Content">
				<el-col :span="20">
					<mavon-editor v-model="form.content" :subfield="false" :boxShadow="false" defaultOpen="edit"/>
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
	name: "EditArticle",
	data() {
		return {
			form: {
				title: '',
				issue_time: '',
				update_time: '',
				tags: [],
				inputVisible: false,
				inputValue: '',
				content: ''
			}
		};
	},
	methods: {
		getArticles() {
			let my = this;

			this.get("/a/" + my.$route.params.aid)
				.then(resp => {
					my.form.title = resp.data.title
					my.form.issue_time = resp.data.issue_time
					my.form.update_time = resp.data.update_time
					my.form.content = resp.data.content

					if (resp.data.tag === '') {
						my.form.tags = []
					} else {
						my.form.tags = resp.data.tag.split(',')
					}
				})
		},
		onSubmit() {
			let my = this;

			let data = new FormData()
			data.append('title', my.form.title)
			data.append('content', my.form.content)
			data.append('issueTime', my.form.issue_time)
			data.append('updateTime', my.form.update_time)

			this.put("/admin/a/" + my.$route.params.aid, data)
				.then(resp => {
					my.$notify.success({ title: "提示", message: "编辑文章成功" });
					my.$router.push({
						path: "/article/list"
					});
				})
		},
		onCancel() {
			this.$router.go(-1);
		},
		closeTag(tag) {
			let my = this;

			let params = {
				params: {
					'aid': my.$route.params.aid,
					'tag': tag
				}
			}

			this.delete("/admin/a/t", params)
				.then(resp => {
					my.form.tags.splice(my.form.tags.indexOf(tag), 1);
				})
		},
		showInput() {
			this.form.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		addTag() {
			let my = this;

			let tag = my.form.inputValue;
			if (!tag) {
				return;
			}

			let data = new FormData()
			data.append('aid', my.$route.params.aid)
			data.append('tag', tag)

			this.post("/admin/a/t", data)
				.then(resp => {
					my.form.tags.push(tag);
					my.form.inputVisible = false;
					my.form.inputValue = '';
				})
		}
	},
	created() {
		this.getArticles();
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
