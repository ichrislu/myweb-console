<template>
	<div class="Picture">
		<el-row :gutter="20">
			<el-col :span="5">
				<div class="grid-content bg-purple">
					<p>
						<datepicker :minimumView="'month'" :maximumView="'month'" :format="format" :disabledDates="disabledFn" :language="zh" :inline="true" @selected="handleSelected"></datepicker>
					</p>
				</div>
			</el-col>
			<el-col :span="5">
				<el-upload :action="url+'/admin/p'" :headers="headers" name="file" multiple list-type="picture" :file-list="pics" drag show-file-list :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img :src="dialogImageUrl" :data-clipboard-text="dialogImageUrl" @click="copy" class="img" id="img">
				</el-dialog>
			</el-col>
		</el-row>
	</div>
</template>

<script>
// 为什么会是在这里？局部注册？
import Datepicker from 'vuejs-datepicker';
import {zh} from 'vuejs-datepicker/dist/locale'
import Clipboard from 'clipboard';

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
			url: process.env.BASE_URL,
			format: "yy-MM",
			cals: [],
			pics: [],//[{name:'2jda63gs.jpg', url:'http://localhost/pic/1811/2jda63gs.jpg'},{name:'6zu75ejt.png', url:'http://localhost/pic/1811/6zu75ejt.png'}],
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
	// watch: {
	// 	"pics" (curr, old) {
	// 		console.log("old:" + old)
	// 		console.log("curr:" + curr)
	// 	}
	// },
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
					console.log(resp.data)
					var d = resp.data;
					for (var v in d) {
						var d2 = eval('('+d[v]+')')
						for (var v2 in d2) {
							// console.log("-----------" + d2[v2])
						}
					}

					// var ary = eval('(' + resp.data + ')')
					var data = resp.data
					// var ary = eval('(' + resp.data + ')')
					my.pics = [];
					for (var i in data) {
						var ary = eval('(' + data[i] + ')')
						// for (var j in ary) {
							// }
						ary.url = my.url + '/pic/' + ary.url
						console.log("name:" + ary.name)
						console.log("url:" + ary.url)
						my.pics.push(ary);
					}

					console.log(my.pics)
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
		copy() {
			console.log(event.target.currentSrc)
			var clipboard = new Clipboard('#img')
			clipboard.on('success', e => {
				console.log('复制成功')
			})
			clipboard.on('error', e => {
				console.log('该浏览器不支持自动复制'+e)
			})

			clipboard.destroy()
			console.log("======================")
		}
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
