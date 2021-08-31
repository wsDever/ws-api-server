<template>
	<div id="header">
		<a-layout-header>
			<img class="logo" src="../../assets/logo.png" />
			<a-menu
				theme="dark"
				mode="horizontal"
				:default-selected-keys="[]"
				:style="{ lineHeight: '64px' }"
			>
				<!-- <a-menu-item key="1">
					<router-link to='/welcome'>欢迎</router-link>
				</a-menu-item> -->
				<a-menu-item key="2">
					<router-link to='/set'> 打 包 </router-link>
				</a-menu-item>
				<!-- <a-menu-item key="3">
					<router-link to='/landing'>添加接口</router-link>
				</a-menu-item> -->
				<!-- <a-menu-item key="4">
					<router-link to='/lists'>列表接口</router-link>
				</a-menu-item> -->
			</a-menu>
			<!-- <a-button type="primary" class="start-btn" @click="startServer">
				{{ !$root.server ? '启动':'运行中.' }}
			</a-button> -->
		</a-layout-header>
	</div>
</template>


<script>

export default {
	name: 'Header',
	data(){
		return {
		}
	},
	created() {
		
	},
	mounted() {

	},
	destroyed(){
		
	},
	methods: {

	}
}
</script>

<style lang='less' scoped>
@import '../../assets/var.less';
#header{
	height: @headerHeight;
	position: relative;
	.ant-menu-dark,
	.ant-layout-header,
	.ant-menu-dark .ant-menu-sub{
		background: #072b39;
	}
}
.logo {
    height: 48px;
    float: left;
    margin-left: -20px;
    margin-top: 8px;
}
.start-btn{
	position: absolute;
	right: 50px;
	top: 16px;
}
</style>