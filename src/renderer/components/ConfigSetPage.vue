<template>
	<div class="set-wraper">
		<a-form-model
			:label-col="{ span: 6, offset: 1 }"
			:wrapper-col="{ span: 12 }">
			<a-form-model-item label="监听端口">
				<a-input v-model="servport"/>
			</a-form-model-item>
			<a-form-model-item label="启动目录">
				<a-input v-model="servpath" readOnly @click="openFileHandler" class="file-input" />
			</a-form-model-item>
			<a-form-model-item label="本 机 IP">
				<a-input v-model="servip" readOnly />
			</a-form-model-item>
			<a-form-model-item label="请求示例">
				<a-input v-model="serveg" readOnly />
			</a-form-model-item>
		</a-form-model>
		<a-button class="sumbit-btn" type="primary" @click="saveConfig" block>
			保 存
		</a-button>
		
	</div>
</template>


<script>
import fs from 'fs';
import path from 'path';
import file from '../../javascript/file.js';
import common from '../../javascript/common.js';

import { remote, dialog } from 'electron';

export default{
	name: 'set-page',
	components: {

	},
	data(){
		return {
			servport: '9090',
			servpath: path.join(__static, `../../`),
			servip: '',
			serveg: ''
		}
	},
	watch:{
		servport(newPort){
			if(newPort.length > 5 || 
				isNaN(Number(newPort)) || 
				Number(newPort) <= 0 || 
				Number(newPort).toString().length < 4 ){
					this.$message.error('端口是4-5位数字');
					this.servport = this.servport;
					return ;
			}
			this.serveg = `http://${this.servip}:${newPort}/api-name.json`;
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.servip = common.getIpAdress('IPv4');
			this.getConfigData();
			
		})
	},
	methods: {
		openFileHandler() {
			this.$electron.remote.dialog.showOpenDialog({"properties": ['openDirectory','createDirectory']}, p => {
				if(p){
					this.servpath = p[0]
				}
			})
			
		},
		getConfigData(){
			this.servport = sessionStorage.getItem('port');
			this.servpath = sessionStorage.getItem('path');
			this.serveg = `http://${this.servip}:${this.servport}/xxx.json`;
		},
		saveConfig(){
			const _this = this;
			if(this.servport.toString() == ''){
				this.$message.error('端口是必填信息');
				return ;
			}
			let content = {
				"serv_port": this.servport,
				"serv_path": this.servpath
			}
			console.log(this.servport, this.servpath)
			
			sessionStorage.setItem('port',this.servport)
			sessionStorage.setItem('path',this.servpath)

			__root_dir = this.servpath.replace(/\\/g, '\\\\');
			file.fileWrite('config.cfg', false, JSON.stringify(content), (e) => {
				if(e){
					console.log(e);
					_this.$message.error('保存失败，稍候再试');
					return;
				}
				this.$router.push('./lists')
			})
		}
	}


}
</script>


<style lang='less' scoped>
.set-wraper{
	padding-top: 30px;
}
.file-input{
	cursor: pointer;
}
.sumbit-btn{
	width: 240px;
	margin-left: 50%;
    transform: translateX(-50%);
}
</style>