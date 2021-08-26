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
			logList: []
		}
	},
	created() {
		this.$root.HandleEvent.$on('addLog', this.addLogLists)
	},
	destroyed(){
		this.$root.HandleEvent.$off('addLog')
	},
	mounted() {
	},
	methods:{
		addLogLists: function(data){
			let dTime = new Date(data.time);
			let year = dTime.getFullYear();
			let month = dTime.getMonth() + 1;
			month = month < 10 ? '0' + month : month ;
			let day = dTime.getDate();
			day = day < 10 ? '0' + day : day ;
			let hour = dTime.getHours();
			hour = hour < 10 ? '0' + hour : hour;
			let minute = dTime.getMinutes();
			minute = minute < 10 ? '0' + minute : minute ;
			let second = dTime.getSeconds();
			second = second < 10 ? '0' + second : second ;

			data.time = `${year}${month}${day} ${hour}:${minute}:${second}`;
			this.logList.push(data);
		}
	}
}
</script>

<style lang='less' scoped>
#log{
	height: 100%;
	width: 100%;
	background: rgba(0,0,0,.8);
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
				color: #ff4d4f;
			}
			&.log_log{
				color: #FFF;
			}
			&.log_service{
				color: #FCFF40;
			}
			&.log_handle{
				color: #E6A23C;
			}
			span{
				color: #fff;
				font-size: 10px;
			}
		}
	}
}

</style>