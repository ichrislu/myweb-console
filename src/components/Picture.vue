<template>
	<div class="Picture">
		<el-row :gutter="10">
			<el-col :xs="4" :sm="6" :md="4" :lg="5" :xl="11">
				<datepicker :minimumView="'month'" :maximumView="'month'" :format="format" :disabledDates="disabledFn" :language="zh" :inline="true" @selected="handleSelected"></datepicker>
			</el-col>
			<el-col :push="2" :offset="5" :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
				<el-upload :action="url+'/admin/p'" :headers="headers" name="file" multiple list-type="picture" :file-list="pics" drag show-file-list :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img :src="dialogImageUrl" v-clipboard="dialogImageUrl" @success="copySuccess" @error="copyError" style="cursor: pointer;">
				</el-dialog>
			</el-col>
		</el-row>
	</div>
</template>

<script>
// 为什么会是在这里？局部注册？
import Datepicker from 'vuejs-datepicker';
import {zh} from 'vuejs-datepicker/dist/locale'

export default {
	name: "Picture",
	components: {
		Datepicker
	},
	data() {
		var my = this;

		return {
			zh: zh,
			dialogImageName: '',
			dialogImageUrl: '',
			dialogVisible: false,
			url: process.env.BASE_URL,
			format: "yy-MM",
			cals: [],
			pics: [],
			disabledFn: {
				customPredictor(date) {
					var f = my.cals.indexOf(my.$moment(date).format('YYMM'))
					return f < 0
				}
			},
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('key')
			}
		};
	},
	created() {
		var my = this;

		let config = {
			headers: {
				"Authorization": "Bearer " + sessionStorage.getItem("key")
			}
		}

		my.axios.get(my.url + '/admin/p', config)
			.then((resp) => {
				my.cals = resp.data
			})
			.catch(function(err) {
				my.$notify.error({ title: "获取文件失败", message: err.message });
			});
	},
	methods: {
		handlePictureCardPreview(file) {
			this.dialogImageName = file.name;
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleSelected(date) {
			var my = this;

			let config = {
				headers: {
					"Authorization": "Bearer " + sessionStorage.getItem("key")
				}
			}

			var folder = this.$moment(date).format('YYMM');

			my.axios.get(my.url + '/admin/p/' + folder, config)
				.then((resp) => {
					var d = resp.data;
					var data = resp.data
					my.pics = [];
					for (var i in data) {
						var ary = eval('(' + data[i] + ')')
						ary.url = my.url + '/pic/' + ary.url
						my.pics.push(ary);
					}
				})
				.catch(function(err) {
					my.$notify.error({ title: "获取文件失败", message: err.message });
				});
		},
		handleRemove(file, fileList) {
			var my = this;

			var fd = new FormData();
			fd.append('file', file.response)

			// delete的传参不一样，封装的时候需要注意
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					"Authorization": "Bearer " + sessionStorage.getItem("key")
				},
				data: fd
			}

			my.axios.delete(my.url + '/admin/p', config)
				.then((resp) => {
					console.info("del success")
				})
				.catch(function(err) {
					my.$notify.error({ title: "删除文件失败", message: err.message });
				});
		},
		copySuccess() {
			this.$notify.success({ title: "复制成功" });
		},
		copyError() {
			this.$notify.error({ title: "复制失败" });
		}
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-col {
	border-radius: 4px;
}
.bg-purple-dark {
	background: #99a9bf;
}
.bg-purple {
	background: #d3dce6;
}
.bg-purple-light {
	background: #e5e9f2;
}
.grid-content {
	border-radius: 4px;
	min-height: 36px;
}
</style>
