<template>
	<div class="new-article">
     <el-form ref="form" :model="form" label-width="50px">
      <el-form-item label="Title">
        <el-col :span="6">
          <el-input v-model="form.title"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Datetime">
        <el-col :span="6">
          <el-date-picker v-model="form.datetime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="Tags">
        <el-col :span="6">
          <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col>
          <mavon-editor v-model="form.content" subfield="false" boxShadow="true" defaultOpen="edit" placeholder="input"/>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Publish</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
	</div>
</template>

<script>
export default {
  name: "NewArticle",
  data() {
    return {
      url: process.env.BASE_URL,
      form: {
          title: '',
          datetime: new Date(),
          dynamicTags: ['标签一', '标签二', '标签三'],
          inputVisible: false,
          content: ''
        }
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
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
