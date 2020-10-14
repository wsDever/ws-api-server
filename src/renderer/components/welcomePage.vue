<template>
  <div class="page-welcome">
	<div class="welcome">WELCOME</div>
    <div class="items">
      <!-- <div class="item">
        <div class="name">Path:</div>
        <div class="value">{{ path }}</div>
      </div>
      <div class="item">
        <div class="name">Route Name:</div>
        <div class="value">{{ name }}</div>
      </div> -->
	  <div class="item-line">
		<div class="item">
			<div class="name">Vue:</div>
			<div class="value">{{ vue }}</div>
		</div>
		<div class="item">
			<div class="name">Electron:</div>
			<div class="value">{{ electron }}</div>
		</div>
	  </div>
	  <div class="item-line">
		<div class="item">
			<div class="name">Node:</div>
			<div class="value">{{ node }}</div>
		</div>
		<div class="item">
			<div class="name">Platform:</div>
			<div class="value">{{ platform }}</div>
		</div>
	  </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        electron: process.versions.electron,
        name: this.$route.name,
        path: this.$route.path,
        node: process.versions.node,
        platform: require('os').platform(),
        vue: require('vue/package.json').version
      }
	}
  }
</script>

<style scoped>
	.page-welcome{
		position: relative;
		height: 100%;
	}
  .welcome{
	  font-size: 60px;
	  height: 80%;
	  padding-top: 20%;
	  width: 100%;
	  text-align:center;
  }
  .items { 
	  width: 100%;
	  position: absolute;
	  bottom: 20px;
	  padding: 0 20%;
	}
	.item-line{
		display: flex;
	}

  .item {
    display: flex;
	flex-grow: 1;
	text-align: center;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
	flex-grow: 1;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
	flex-grow: 1;
    font-weight: bold;
  }
</style>
