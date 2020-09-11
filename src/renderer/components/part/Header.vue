<template>
	<div id="header">
		<div class="page-logo">
			<img src="../../assets/logo1.png" alt="">
		</div>
		<div class="page-menus">
			<div class="menu-box">
				<router-link to='/set'>设置</router-link>
				<router-link to='/landing'>添加</router-link>
				<router-link to='/list'>列表</router-link>
			</div>
		</div>
		<div class="page-tools">
			<div class="start-btn" @click="startServer">
				{{ !$root.server ? '启动':'运行中.' }}
			</div>
		</div>
	</div>
</template>


<script>
import fs from 'fs';
import path from 'path';
import httpd from 'http';
import common from '../../../javascript/common.js';
import file from '../../../javascript/file.js';

export default {
	name: 'Header',
	data(){
		return {
			servport: 0,
			servpath: ''
		}
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
			this.servpath = sessionStorage.getItem('path');

			this.$root.server = httpd.createServer((req,res) => {
				fs.readFile(`${path.join(__static, `../../`)}${req.url}`, (err, data) => {
					if(err){
						res.writeHeader(404);
						res.write('404');
						this.$root.HandleEvent.$emit('addLog' ,{
							mess: `http request at ${ req.url } error`,
							type: "error",
							time: new Date().getTime()
						})
					}else{
						res.write(data)
						this.$root.HandleEvent.$emit('addLog' ,{
							mess: `http request at ${ req.url } ok`,
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
			file.fileRead('config.cfg', 'json', (flag, data) => {
				if(flag == 'error'){
					this.$root.HandleEvent.$emit('addLog' ,{
						mess: `get config.cfg error`,
						type: "error",
						time: new Date().getTime()
					})
					return ;
				}else{
					this.servport = data.serv_port;
					this.servpath = data.serv_path;
					sessionStorage.setItem('port',data.serv_port)
					sessionStorage.setItem('path',data.serv_path)
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

<style lang='scss' scoped>
#header{
	height: 60px;
	width: 100%;
	// background: #ececec;
	background-image: linear-gradient(to right, transparent, #1E79DE);
	display: flex;
}
.page-logo{
	width: 20%;
	img{
		width: 200px;
	}
}
.page-menus{
	// float: left;
	// display: flex;
	height: 60px;
	width: 50%;
	.menu-box{
		height: 30px;
		margin-top: 25px;
	}
	a{
		height: 30px;
		line-height: 30px;
		// margin-top: 15px;
		text-decoration: none;
		width: 25%;
		text-align: center;
		display: inline-block;
		position: relative;
		&.router-link-active{
			color: white;
			&:after{
				content: "";
				position: absolute;
				height: 3px;
				width: 72%;
				bottom: -5px;
				left: 50%;
				transform: translateX(-50%);
				background: #e5e5e5;
				border-radius: 20px 20px 0 0;
			}
			&:before{
				content: "";
				position: absolute;
				height: 0;
				width: 0;
				border: 6px solid transparent;
				bottom: -3px;
				left: 50%;
				transform: translateX(-50%);
				border-bottom-color: #e5e5e5;
			}
		}
	}
}
.page-tools{
	width: 20%;
	// float: left;
	diaplay: flex;
	.start-btn{
		cursor: pointer;
		height: 36px;
		width: 66px;
		background: #1E79DE;
		font-size: 12px;
		line-height: 34px;
		text-align: center;
		color: #fff;
		margin-top: 10px;
		border-radius: 5px;
		// box-shadow: 5px 5px 5px #1E79DE;
	}
	
}
</style>