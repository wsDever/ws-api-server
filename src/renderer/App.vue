<template>
<div class="page">
  <a-layout class="layout">
    <Header />
	<div class="page-body">
		<a-layout-content class="page-content">
			<div class="left">
				<router-view></router-view>
			</div>
		</a-layout-content>
	</div>
  </a-layout>
</div>
</template>
<script>
  import Header from './components/part/Header';
  export default {
	name: 'my-pro',
	components: { Header },
	mounted(){

	}
  }
</script>

<style lang="less">
@import './assets/common.less';

#app{
	height: 100vh;
}
.page{
	height: 100vh;
	width: 100vw;
	overflow: hidden;
}
.page-body{
	height: calc(100vh - @headerHeight);
	padding: 30px;
	width: 100%;
	// overflow: hidden;
	background: linear-gradient(to right bottom,#f0f2f5, #fff);
}
.page-content{
	// padding: 30px;
	height: 100%;
	background: #fff;
	display: flex;
}
.left {
      overflow-y: scroll;
      box-sizing: border-box;
	  padding-right: 20px;
      position: relative;
      width: auto;
      // max-width: calc(100% - 160px);
      flex-grow: 1;
    //   background-color: $border_color;
	.log-dir{
		position: absolute;
		height: 100px;
		width: 20px;
		right: 0px;
		top: 50%;
		transform: translateY(-85%);
		padding-top: 50px;
	}
}

</style>
