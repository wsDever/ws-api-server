<template>
  <div id="app">
	<Header />
	<div class="page-body">
		<div class="page-left">
    		<router-view></router-view>
		</div>
		<div class="page-right">
			<Log />
		</div>
	</div>
  </div>
</template>
<script>
  import Header from './components/part/Header';
  import Log from './components/part/Log';
  export default {
	name: 'my-pro',
	components: { Header, Log }
  }
</script>

<style lang="scss">
@import './assets/common.scss';

#app{
	height: 100vh;
}
.page-body{
	height: calc(100vh - #{$headerHeight});
	display: flex;
	width: 100%;
	overflow: hidden;
	background: linear-gradient(to right bottom,#e5e5e5, white);
}
.page-left{
	width: 75%;
	height: 100%;
	overflow-y: auto;
}
.page-right{
	width: 25%;
	height: 100%;
	border-left: 1px solid #ccc;
	overflow-y: auto;
}
</style>
