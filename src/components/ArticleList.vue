<template>
	<div>
		<div class="search">
			<el-col :span="50">
				<el-input placeholder="搜索关键字" clearable v-model="key" @keyup.enter.native="search" @blur="search" @clear="getArticles"></el-input>
			</el-col>
		</div>
		<div id="article-list">
			<template>
				<el-table :data="articles" stripe style="width: 100%">
					<el-table-column prop="aid" label="ID" width="100"></el-table-column>
					<el-table-column prop="title" label="标题"></el-table-column>
					<el-table-column prop="issue_time" :formatter="dateFormat" label="发布时间" width="200"></el-table-column>
					<el-table-column prop="update_time" :formatter="dateFormat" label="更新时间" width="200"></el-table-column>
					<el-table-column label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="primary" icon="el-icon-edit" size="mini" circle @click="edit(scope.row.aid)"></el-button>
							<el-button type="danger" icon="el-icon-delete" size="mini" circle @click="del(scope.row.aid, scope.row.title)"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<div class="pager">
			<el-pagination background small layout="total, prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange"></el-pagination>
		</div>
	</div>
</template>

<script>
export default {
	name: "ArticleList",
	data() {
		return {
			key: '',
			pageIdx: 1,
			pageSize: 2,
			total: 0,
			articles: [],
		};
	},
	methods: {
		dateFormat: function(row, column) {
			const date = row[column.property]
			if (date === undefined) {
				return ''
			}

			return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
		},
		getArticles() {
			var my = this;

			let params = {
				't': my.$route.query.t,
				'k': my.key,
				'lt': my.lastTime,
				'ps': my.pageSize,
				'pi': my.pageIdx,
			};

			let loadingConfig = {
				target: '#article-list',
				// fullscreen: false,
				// lock: true,
				// text: 'loading...',
				// background: 'rgba(0, 0, 0, 0.5)'
			}

			let config = {
				params: params,
				timeout: 10000,
				// headers: {'pf': 'true1'},
				// handleError: false,
				vue: my,
				loading: true,
				loadingConfig: loadingConfig,
			}

			this.get2('/a', config)
				.then(resp => {
					// loading.close();

					if (resp) {
						my.articles = resp.data.Articles;
						my.total = resp.data.Total;
					}
				})
				.catch(error => {
					// loading.close();
					// my.$notify.error({ title: "拉取文章失败", message: error.message });
				});
		},

		search() {
			if (this.key == "") {
				return;
			}

			this.getArticles();
		},

		handleCurrentChange(val) {
			this.pageIdx = val;

			this.getArticles();
		},

		edit(aid) {
			var my = this;

			my.$router.push({
				path: "/article/edit/" + aid
			});
		},

		del(aid, title) {
			this.$confirm(title, "确认删除", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
			.then(() => {
				var my = this;

				let headers = {
					Authorization: "Bearer " + sessionStorage.getItem("key")
				};

				// 此处多余
				let params = {
					aid: aid
				};

				this.axios
					.delete(
						my.url + "/admin/a/" + aid,
						{ headers: headers },
						{ params: params }
					)
					.then(function(resp) {
						my.getArticles();
						my.$notify.success({ title: "提示", message: "删除成功" });
					})
					.catch(function(err) {
						my.$notify.error({ title: "失败", message: err.message });
					});
			})
			.catch(err => {
				if (err != "cancel") {
					this.$notify.warning({ title: "异常", message: err.message });
				}
			});
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
.search div {
	float: right;
	margin-bottom: 10px;
}
.pager div {
	float: right;
	margin-top: 10px;
}
</style>
