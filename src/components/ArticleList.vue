<template>
	<div class="signin">
    
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
        <el-pagination background small layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange"></el-pagination>

	</div>
</template>

<script>
export default {
  name: "Article",
  data() {
    return {
      pageIdx: 1,
      pageSize: 10,
      total: 0,
      articles: [],
      url: process.env.BASE_URL
    };
  },
  methods: {
    getArticles() {
      var my = this;

      let params = {
        t: my.$route.query.t,
        lt: my.lastTime,
        pi: my.pageIdx,
        ps: my.pageSize
      };

      this.axios
        .get(my.url + "/a", { params: params })
        .then(function(resp) {
          my.articles = resp.data.Articles;
          my.total = resp.data.Total;
        })
        .catch(function(err) {
          my.$notify.error({ title: "拉取文章失败", message: err.message });
        });
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
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var my = this;

          let headers = {
            Authorization: "Bearer " + sessionStorage.getItem("key")
          };

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
              my.getArticleCount();
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
    // signout() {
    //   sessionStorage.removeItem("key")
    //   this.$router.push({
    //     path: "/"
    //   })
    // }
  },
  beforeCreate() {
    // if (sessionStorage.getItem("key") == null) {
    //   this.$router.push({
    //     path: "/"
    //   })
    // }
  },
  mounted() {
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
</style>
