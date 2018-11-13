<template>
	<div class="Picture">
		<el-row :gutter="20">
			<el-col :span="5">
				<div class="grid-content bg-purple">
					<p>
						<datepicker :minimumView="'month'" :maximumView="'month'" :format="format" :disabledDates="disabledFn" :language="zh" :inline="true" @selected="handleSelected"></datepicker>
					</p>
					<el-upload :action="url" :headers="headers" name="file" multiple list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" height="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</el-col>
			<el-col :span="18">
				<div class="grid-content bg-purple">
					<el-row>
						<el-col :span="8" v-for="(item, key) in pics" :key="key" :offset="key > 0 ? 2 : 0">
							<el-card :body-style="{ padding: '0px' }">
								<img :src="''+item" class="image" @click="copyUrl">
							</el-card>
						</el-col>
					</el-row>
				</div>
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
			dialogImageUrl: '',
			dialogVisible: false,
			url: process.env.BASE_URL + '/admin/p',
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

		my.axios.get(my.url, config)
			.then((resp) => {
				my.cals = resp.data
			})
			.catch(function(err) {
				my.$notify.error({ title: "获取文件失败", message: err.message });
			});
	},
	methods: {
		handlePictureCardPreview(file) {
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

			my.axios.get(my.url + "/" + folder, config)
				.then((resp) => {
					my.pics = resp.data
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

			my.axios.delete(my.url, config)
				.then((resp) => {
					console.info("del success")
				})
				.catch(function(err) {
					my.$notify.error({ title: "删除文件失败", message: err.message });
				});
		},
		copyUrl(url) {
			// todo copy url to clip
			console.log()
		}
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
