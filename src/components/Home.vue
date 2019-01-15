<template>
	<div class="home">
		<el-container>
			<el-main>
				<el-row type="flex">
					<el-aside>
						<el-menu router class="el-menu-vertical">
							<el-menu-item index="/article/list">
								<i class="el-icon-document"></i>
								<span slot="title">All Articles</span>
							</el-menu-item>
							<el-menu-item index="/article/new">
								<i class="el-icon-news"></i>
								<span slot="title">New Article</span>
							</el-menu-item>
							<el-menu-item index="/tag" disabled>
								<i class="el-icon-star-on"></i>
								<span slot="title">Tags</span>
							</el-menu-item>
							<!-- <el-menu-item index="/picture">
								<i class="el-icon-picture"></i>
								<span slot="title">Picture</span>
							</el-menu-item> -->
							<el-menu-item index="">
								<i class="el-icon-refresh"></i>
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
		name: "Home",
		methods: {
			signout() {
				sessionStorage.removeItem("key")
				this.$router.push({
					path: "/"
				})
			}
		},
		updated() {
			if (!sessionStorage.getItem("key")) {
				this.$router.push({
					path: "/"
				})
			}
		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.el-menu-vertical:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
		text-align: right;
	}
</style>
