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
        <el-col :span="20">
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
	</div>
</template>

<script>
export default {
  name: "EditArticle",
  data() {
    return {
      url: process.env.BASE_URL,
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
      var my = this;

      this.axios
        .get(my.url + "/a/" + my.$route.params.aid)
        .then(function(resp) {
          my.form.title = resp.data.title
          my.form.issue_time = resp.data.issue_time
          my.form.update_time = resp.data.update_time
          my.form.content = resp.data.content

          if (resp.data.tag == '') {
            my.form.tags = []
          } else {
            my.form.tags = resp.data.tag.split(',')
          }
        })
        .catch(function(err) {
          my.$notify.error({ title: "拉取文章失败", message: err.message });
        });
    },
    onSubmit() {
      var my = this;

      var fd = new FormData();
      fd.append('title', my.form.title)
      fd.append('content', my.form.content)
      fd.append('issueTime', my.form.issue_time)
      fd.append('updateTime', my.form.update_time)

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": "Bearer " + sessionStorage.getItem("key")
        }
      }

      this.axios.put(my.url + "/admin/a/" + my.$route.params.aid, fd, config)
        .then(function(resp) {
          my.$notify.success({ title: "提示", message: "编辑文章成功" });
          my.$router.push({
            path: "/article/list"
          });
        })
        .catch(function(err) {
          my.$notify.error({ title: "编辑文章失败", message: err.message });
        });
    },

    handleClose(tag) {
      var my = this;

      let config = {
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem("key")
        }
      }

      this.axios
        .delete(my.url + "/admin/a/" + my.$route.params.aid + "/" + tag, config)
        .then(function(resp) {
          my.form.tags.splice(my.form.tags.indexOf(tag), 1);
        })
        .catch(function(err) {
          my.$notify.error({ title: "删除标签失败", message: err.message });
        });
    },

    showInput() {
      this.form.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      var my = this;

      let tag = my.form.inputValue;
      if (!tag) {
        return;
      }

      let config = {
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem("key")
        }
      }

      this.axios
        .post(my.url + "/admin/a/" + my.$route.params.aid + "/" + tag, null, config)
        .then(function(resp) {
          if (tag) {
            my.form.tags.push(tag);
          }
          my.form.inputVisible = false;
          my.form.inputValue = '';
        })
        .catch(function(err) {
          my.$notify.error({ title: "添加标签失败", message: err });
        });
    }
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
