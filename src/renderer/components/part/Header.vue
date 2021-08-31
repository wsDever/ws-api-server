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
					<router-link to='/set'>设置</router-link>
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
import fs from 'fs';
import path from 'path';
import httpd from 'http';
import common from '../../../javascript/common.js';
import file from '../../../javascript/file.js';

let url = require('url');
export default {
	name: 'Header',
	data(){
		return {
			servport: 0
		}
	},
	computed:{
		
	},
	created() {
		this.closeServer();
	},
	mounted() {
		this.$root.HandleEvent.$on('serverStart', this.startServer)
		this.$root.HandleEvent.$on('serverClose', this.closeServer)
		this.$nextTick(() => {
			this.checkFile();
		})
	},
	destroyed(){
		this.$root.HandleEvent.$off('serverStart')
		this.$root.HandleEvent.$off('serverClose')
	},
	methods: {
		startServer(){
			if(this.$root.server){
				this.closeServer();
				return ;
			}
			this.servport = sessionStorage.getItem('port');

			this.$root.server = httpd.createServer((req,res) => {
				console.log("请求文件为：", `${path.join(__root_dir, `./`)}${req.url}`)

				let _url = req.url;
				const parms = url.parse(_url, true).query;
				const parmsArr = Object.getOwnPropertyNames(parms); 
				if(parmsArr.length != 0){
					_url = req.url.split('?')[0];
					this.$root.HandleEvent.$emit('addLog' ,{
						mess: `http request at ${ _url } params: ${JSON.stringify(parms)}`,
						type: "service",
						time: new Date().getTime()
					})
				}
				
				fs.readFile(`${path.join(__root_dir, `./`)}${_url}`, (err, data) => {
					if(err){
						res.writeHeader(404);
						res.write('<div>The file is not found</div>');
						this.$root.HandleEvent.$emit('addLog' ,{
							mess: `http request at ${ _url } error`,
							type: "error",
							time: new Date().getTime()
						})
					}else{
						res.writeHeader(200);
						res.write(data)
						this.$root.HandleEvent.$emit('addLog' ,{
							mess: `http request at ${ _url } ok`,
							type: "service",
							time: new Date().getTime()
						})
					}
					res.end();
				})
			}).listen(`${this.servport}`);
			this.$root.HandleEvent.$emit('addLog' ,{
				mess: `web server running at ${ common.getIpAdress('IPv4') }:${this.servport} ok`,
				type: "service",
				time: new Date().getTime()
			})
		},
		closeServer(){
			if(this.$root.server){
				this.$root.server.close();
				this.$root.server = null;
				this.$root.HandleEvent.$emit('addLog' ,{
					mess: `the service closed ok`,
					type: "service",
					time: new Date().getTime()
				})
			} 
		},
		checkFile(){
			file.fileRead('config.cfg', false, 'json', (flag, data) => {
				if(flag == 'error'){
					this.$root.HandleEvent.$emit('addLog' ,{
						mess: `get config.cfg error`,
						type: "error",
						time: new Date().getTime()
					})
					return ;
				}else{
					this.servport = data.serv_port;
					sessionStorage.setItem('port',data.serv_port)
					sessionStorage.setItem('path',data.serv_path)

					__root_dir = data.serv_path.replace(/\\/g, '\\\\');
					this.$root.HandleEvent.$emit('addLog' ,{
						mess: `get config.cfg ok`,
						type: "log",
						time: new Date().getTime()
					})
				}
			})
		}
	}
}
</script>

<style lang='less' scoped>
@import '../../assets/common.less';
#header{
	height: @headerHeight;
	position: relative;
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