<template>
	<div>
		<div class="search">
			<el-col :span="50">
				<el-input placeholder="搜索关键字" clearable v-model="key" size="mini" @keyup.enter.native="search" @blur="search" @clear="getArticles"></el-input>
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
							<el-popover placement="top" width="160" v-model="visible">
								<p>这是一段内容这是一段内容确定删除吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="visible = false">取消</el-button>
									<el-button type="primary" size="mini" @click="visible = false">确定</el-button>
								</div>
								<el-button type="danger" slot="reference" icon="el-icon-delete" size="mini" circle></el-button>
							</el-popover>
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
			pageSize: 10,
			total: 0,
			articles: [],
			visible: false,
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
			let my = this;

			let params = {
				't': my.$route.query.t,
				'k': my.key,
				'lt': my.lastTime,
				'ps': my.pageSize,
				'pi': my.pageIdx,
			};

			let loadingConfig = {
				target: '#article-list',
				text: 'loading...',
				// fullscreen: true,
				// lock: false,
				background: 'rgba(0, 0, 0, 0.7)'
			}

			let config = {
				params: params,
				timeout: 10000,
				vue: my,
				loading: true,
				loadingConfig: loadingConfig,
			}

			this.get('/a', config)
				.then(resp => {
					if (resp) {
						my.articles = resp.data.Articles;
						my.total = resp.data.Total;
					}
				})
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

		del(aid) {
			// this.$confirm(title, "确认删除", {
			// 	confirmButtonText: "确定",
			// 	cancelButtonText: "取消",
			// 	type: "warning"
			// })
			// .then(() => {
				var my = this;

				this.delete("/admin/a/" + aid)
					.then(resp => {
						my.getArticles();
						my.$notify.success({ title: "提示", message: "删除成功" });
					})
				my.visible = false;
			// }
			// )
			// .catch(error => {
			// 	if (error != "cancel") {
			// 		this.$notify.warning({ title: "异常", message: error.message });
			// 	}
			// });
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
	margin-bottom: 0px;
}
.pager div {
	float: right;
	margin-top: 10px;
}
</style>
