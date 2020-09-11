<template>
	<div class="set-wraper">
		-------------------------------------------服务配置------------------------------------------
		<div class="fill-area">
			<div class="fill-line">
				<span class="line-label">端口</span><input type="text" v-model="servport" @input="modefy('port')">
				<span class="input-err" :class="{'show-err': showPortErr}">{{portErr}}</span>
			</div>
			<div class="fill-line">
				<span class="line-label">路径</span><input type="text" v-model="servpath" @input="modefy">
				<!-- <span class="input-err" :class="{'show-err': showPathErr}">{{pathErr}}</span> -->
			</div>
			<div class="fill-line">
				<span class="line-label">IP地址</span><span>{{servip}}</span>
			</div>
			<div class="fill-line">
				<span class="line-label">请求示例</span><span>{{serveg}}</span>
			</div>
			<div @click="saveConfig" class="fill-button">保存</div>
		</div>
	</div>
</template>


<script>
import fs from 'fs';
import path from 'path';
import file from '../../javascript/file.js';
import common from '../../javascript/common.js';

import { remote } from 'electron';

export default{
	name: 'set-page',
	components: {

	},
	data(){
		return {
			isExist: false,
			servport: '9090',
			servpath: 'data',
			servip: '',
			serveg: '',
			portErr: '必须是数字',
			pathErr: '不能是汉字',
			
			showPortErr: false
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.servip = common.getIpAdress('IPv4');
			this.getConfigData();
			
		})
	},
	methods: {
		getConfigData(){
			// file.fileExists('config.cfg',(err) => {
			// 	console.log(err)
			// })
			// file.fileRead('config.cfg', 'json', (flag, data) => {
			// 	if(flag == 'success'){
			// 		this.servport = data.serv_port;
			// 		this.servpath = data.serv_path;
			// 		this.serveg = `http://${this.servip}:${this.servport}/${this.servpath}/xxx.json`;
			// 	}else{
			// 		this.isExist = false
			// 	}
			// })
			this.servport = sessionStorage.getItem('port');
			this.servpath = sessionStorage.getItem('path');
			this.serveg = `http://${this.servip}:${this.servport}/${this.servpath}/xxx.json`;
		},
		modefy(flag){
			if(flag == 'port'){
				if(this.servport.length > 4 || isNaN(Number(this.servport)) || Number(this.servport) <=0 || Number(this.servport).toString().length <4 ){
					this.portErr = '端口号不规范，应该为1000-9999之间'
					this.showPortErr = true;
					return ;
				}else{
					this.portErr = ''
					this.showPortErr = false;
				}
			}
			this.serveg = `http://${this.servip}:${this.servport}/${this.servpath}/xxx.json`;
		},
		saveConfig(){
			if(this.servport.toString() == '' || this.servpath.trim() == ''){
				alert("端口和路径是必填信息");
				return ;
			}
			let content = {
				"serv_port": this.servport,
				"serv_path": this.servpath
			}
			sessionStorage.setItem('port',this.servport)
			sessionStorage.setItem('path',this.servpath)
			file.fileWrite('config.cfg', JSON.stringify(content), (e) => {
				if(e){
					alert("保存失败，稍候再试");
					return;
				}
				this.$router.push('./')
			})
		}
	}


}
</script>


<style lang='scss' scoped>
.set-wraper{

}
.fill-area{
	width: 400px;
	margin-left: 100px;
	.fill-line{
		margin-top: 30px;
		height: 32px;
		position: relative;
		.line-label{
			display: inline-block;
			width: 120px;
			padding: 0 25px;
			height: 32px;
			line-height: 32px;
			font-size: 14px;
			vertical-align: middle;
			text-align: justify;
			text-align-last: justify;
			color: #2e2e2e;
			+ span{
				width: auto;
				padding: 0;
				color: #a5a5a5;
				font-size: 12px;
			}
		}
		input{
			outline: none;
			width: 230px;
			border: 1px solid #e5e5e5;
			height: 32px;
			line-height: 32px;
			font-size: 12px;
			color: #666;
			padding: 0 5px;
		}
		.input-err{
			position: absolute;
			top: 36px;
			left: 100%;
			font-size: 11px;
			color: red;
			display: none;
			// opacity: 0;
			// -webkit-transition: left 5s;
		}
		.show-err{
			left: 120px;
			// opacity: 1;
			display: block;
		}
	}
	.fill-button{
		width: 300px;
		margin: 30px 50px 0;
		height: 44px;
		line-height: 44px;
		border-radius: 5px;
		background: #1E79DE;
		text-align: center;
		color: #fff;
		font-size: 18px;
	}
}

</style>