<template>
	<div id="log">
		<!-- <div class="log_title">日志</div> -->
		<div class="log_box">
			<div v-for="(item,idx) in logList" :class="`log_${item.type}`" :key="idx"><span>{{item.time}}</span> {{item.mess}}</div>
		</div>
	</div>
</template>


<script>

export default {
	name: 'Log',
	data(){
		return {
			logList: [
				{
					mess: '这是一条消息一',
					type: "service",
					time: "2018-12-18 12:12:12"
				},{
					mess: 'This is a log message',
					type: "log",
					time: "2018-12-18 12:12:12"
				},{
					mess: '这是一条消息一',
					type: "handle",
					time: "2018-12-18 12:12:12"
				}
			]
		}
	},
	created() {
		this.$root.HandleEvent.$on('addLog', this.addLogLists)
	},
	destroyed(){
		this.$root.HandleEvent.$off('addLog')
	},
	mounted() {
		// setInterval(() => {
			// this.$root.HandleEvent.$emit('addLog' ,{
			// 	mess: '这是一条消息一4444444',
			// 		type: "service",
			// 		time: "2018-12-18 12:12:12"
			// })
		// },1000 * 2)
	},
	methods:{
		addLogLists: function(data){
			this.logList.push(data);
		}
	}
}
</script>

<style lang='scss' scoped>
#log{
	height: 100%;
	width: 100%;
	background: rgba($color: #000000, $alpha: 0.8);
	color: #fff;
	font-size: 12px;
	padding: 10px 0 10px 10px;
	.log_title{
		margin-bottom: 10px;
	}
	.log_box{
		height: 100%;
		padding-right: 10px;
		overflow-y: auto;
		div{
			line-height: 18px;
			&.log_error{
				color: red;
			}
			&.log_log{
				color: #e5e5e5;
			}
			&.log_service{
				color: blue;
			}
			&.log_handle{
				color: yellow;
			}
			span{
				color: #fff;
				font-size: 10px;
			}
		}
	}
}

</style>