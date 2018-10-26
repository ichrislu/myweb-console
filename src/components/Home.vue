<template>
    <div class="home">
        <el-container>
            <el-main>
                <el-row type="flex">
                    <el-aside>
                        <el-menu router class="el-menu-vertical">
                            <el-menu-item index="1" route="/article/list">
                                <i class="el-icon-document"></i>
                                <span slot="title">All Article</span>
                            </el-menu-item>
                            <el-menu-item index="1" route="/article/new">
                                <i class="el-icon-news"></i>
                                <span slot="title">New Article</span>
                            </el-menu-item>
                            <el-menu-item index="2" disabled>
                                <i class="el-icon-star-on"></i>
                                <span slot="title">Tags</span>
                            </el-menu-item>
                            <el-menu-item index="3">
                                <i class="el-icon-sold-out"></i>
                                <span slot="title" @click.stop="signout">Signout</span>
                            </el-menu-item>
                        </el-menu>
                    </el-aside>
                    <div style="width: 100%">
                        <router-view></router-view>
                    </div>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home"
    };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-menu-vertical:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

</style>
