<template>
	<div class="signin">
    <el-container>
      <el-aside>
        <el-menu router="true" class="el-menu-vertical" style="align=left">
          <el-menu-item index="1" route="/article">
            <i class="el-icon-document"></i>
            <span slot="title">All Article</span>
          </el-menu-item>
          <el-menu-item index="1" route="/article">
            <i class="el-icon-news"></i>
            <span slot="title">New Article</span>
          </el-menu-item>
          <el-menu-item index="2" disabled>
            <i class="el-icon-star-on"></i>
            <span slot="title">Tags</span>
          </el-menu-item>
          <el-menu-item index="2" route="/signout">
            <i class="el-icon-sold-out"></i>
            <span slot="title">Signout</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <template>
          <el-table :data="articles" stripe style="width: 100%">
            <el-table-column prop="aid" label="ID" width="100"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="issue_time" label="发布时间" width="200"></el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="200"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="edit(scope.row.aid)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="del(scope.row.aid)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
      </el-main>
    </el-container>
	</div>
</template>

<script>
export default {
  name: 'Article',
  data() {
    return {
			articles: [],
			url: process.env.BASE_URL + '/a'
    };
  },
  methods: {
    getArticles() {
      var my = this;

			let params = {
				t: my.$route.query.t,
				l: my.lastTime
			}

      this.axios.get(my.url, {params: params})
				.then (function (resp) {
					my.articles = my.articles.concat(resp.data);
				})
				.catch (function (err) {
          my.$notify.error({title: "拉取失败", message: err.message});
				})
    },
    edit(aid) {
      console.info(aid)
    },
    del(aid) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var my = this;

        let params = {
          aid: aid
        }

        this.axios.delete(my.url, {params: params})
          .then (function (resp) {
            getArticles()
          })
          .catch (function (err) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
      }).catch(() => {
        // nothing to do
      });
    }
  },
	mounted() {
		this.getArticles();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
