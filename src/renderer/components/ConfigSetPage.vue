<template>
	<div class="set-wraper">
		<a-form-model
			:label-col="{ span: 6, offset: 1 }"
			:wrapper-col="{ span: 12 }">
			<!-- <a-form-model-item label="本 机 IP">
				<a-input v-model="servip" readOnly />
			</a-form-model-item> -->
			<a-form-model-item label="文 件 夹">
				<a-input v-model="fileDir" class="file-input" />
			</a-form-model-item>
			<a-form-model-item label="项目">
				<a-input v-model="prodDir" readOnly @click="openProgFileHandler" class="file-input" />
			</a-form-model-item>
			<a-form-model-item label="项目名称">
				<a-input v-model="prodName" />
			</a-form-model-item>
			<a-form-model-item label="打包目录">
				<a-input v-model="buildDir" readOnly @click="openBuildFileHandler" class="file-input" />
			</a-form-model-item>
			<a-form-model-item label="打包标志">
				<a-input v-model="buildFlag" />
			</a-form-model-item>
		</a-form-model>

		<a-button class="sumbit-btn" type="primary" @click="readyBuild" block>
			打 包
		</a-button>
		<a-drawer
			title="打包进程"
			placement="right"
			:closable="true"
			:visible="logShow"
			:get-container="false"
			:wrap-style="{ position: 'absolute' }"
			@close="logShow=false"
			>
			<div v-for="(log, i) in logLists" :key="i">{{ log }}</div>
		</a-drawer>
	</div>
</template>


<script>
import fs from 'fs';
import fstream from 'fstream';
import zlib from 'zlib';
import tar from 'tar';
import compressing  from 'compressing';

import process from 'child_process';
import archiver from 'archiver';

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
			fileDir: 'light',
			prodName: '',
			prodDir: '',
			buildDir: '',
			buildFlag: '5',
			logLists: [],
			logShow: false
			// servpath: path.join(__static, `../../`),
			// servip: '',
			// serveg: ''
		}
	},
	watch:{
		prodName(newName){
			// 判断有没有中文
		},
		prodDir(newDir){
			let _parr = newDir.split("\\") ;
			this.prodName = _parr[_parr.length - 1];
		}
	},
	mounted() {

	},
	methods: {
		openProgFileHandler() {
			this.$electron.remote.dialog.showOpenDialog({"properties": ['openDirectory','createDirectory']}, p => {
				if(p){
					let _path = p[0].replace(/\\/g, '\\\\');
					fs.access(_path + '\\' + this.fileDir , fs.constants.F_OK, (err) => {
						if(!err){
							this.prodDir = p[0];
						}else{
							this.prodDir = '';
							this.$message.error(`项目目录下不包含[${ this.fileDir }]文件夹`);

						}
					})
				}
			})
		},
		openBuildFileHandler() {
			this.$electron.remote.dialog.showOpenDialog({"properties": ['openDirectory','createDirectory']}, p => {
				if(p){
					let _path = p[0].replace(/\\/g, '\\\\');
					fs.access(_path + '\\env' , fs.constants.F_OK, (err) => {
						if(!err){
							this.buildDir = p[0];
						}else{
							this.buildDir = '';
							console.log(this.$message);
							this.$message.error(`该目录下不包含[env]文件夹`);
						}
					})
				}
			})
		},
		doZip(source, dist, cbok){		

			let output = fs.createWriteStream(dist);
			let archive = archiver('zip', {
				zlib: {
					level: 9
				}
			})

			output.on('close', function(){
				cbok()
			})
			archive.on('error', err => {
				this.handleLogs(`压缩失败，原因：${ err }`);
			})

			archive.pipe(output);
			archive.directory(source, false);
			archive.finalize();
		},
		doDelZip(source){
			fs.access(source , fs.constants.F_OK, (err) => {
				if(!err){
					fs.unlinkSync(source);
				}
			})
		},
		doCopy(source, dist, delsource, cbok){
			let readStream = fs.createReadStream(source);
			let writeStream = fs.createWriteStream(dist);
			readStream.pipe(writeStream);
			writeStream.on('close', () => {
				delsource && fs.unlinkSync(source);
				cbok();
			})
		},
		doBuild(){
			this.handleLogs(`开始打包，请等待......`);
			// let _cmd = 'cd F:/work_dir/env && java -cp .;zip4j_1.3.1.jar;bcprov-jdk15-133.jar com.tfzq.javatest.PacketModuleUtil "F://work_dir" "h5_base" "110"'		
			let _buildDir = this.buildDir.replace(/\\/g, '\\\\');
			let _cd = `cd ${ _buildDir +'\\' + 'env' }`
			let _bd = `java -cp .;zip4j_1.3.1.jar;bcprov-jdk15-133.jar com.tfzq.javatest.PacketModuleUtil "${ _buildDir }" "${ this.prodName }" "${ this.buildFlag }"`
			
			let _timer = null;
			let _i = 0;
			_timer = setInterval(() => {
				this.handleLogs(`打包用时：${ ++_i }`);
			}, 1000 * 1)

			process.exec(`${ _cd } && ${ _bd }`, (err, stdout, stderr) => {
				clearInterval(_timer);
				if(stderr){
					this.handleLogs(`打包失败，原因：${ stderr }`);
					return;
				}
				console.log(stdout);
				this.handleLogs(`打包完成，谢谢！`);
			})
		},
		readyBuild(){
			this.logLists = [];
			this.logShow = true;
			
			let _source = this.prodDir.replace(/\\/g, '\\\\') + '\\' + this.fileDir;
			let _dist = this.prodDir.replace(/\\/g, '\\\\') + '\\' + this.prodName + '.zip';
			
			let _sourceFile = _source + '\\' + this.prodName + '.zip' ;
			// 先删除light目前下的zip
			this.doDelZip(_sourceFile);
			this.handleLogs(`压缩生成 ${ this.prodName }.zip`);
			// 把目录生成zip
			this.doZip(_source, _dist, () => {
				this.handleLogs(`${ this.prodName }.zip 生成成功`);
				// 复制到light中去
				this.doCopy(_dist, _sourceFile, true, () => {
					let _buildDir = this.buildDir.replace(/\\/g, '\\\\');
					let _buildDist = _buildDir + '\\' + this.prodName + '.zip';
					// 删除build目录下的zip
					this.handleLogs(`删除打包目录中的 ${ this.prodName }.zip`);
					this.doDelZip(_buildDist);
					// 把light下的zip复制到打包目录下
					this.handleLogs(`复制 ${ this.prodName }.zip 到打包目录`);
					this.doCopy(_sourceFile, _buildDist, false, () => {
						// 开始打包
						this.doBuild();
					})
				});
			})
		},
		handleLogs(txt){
			let dTime = new Date();
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

			let time = `${year}${month}${day} ${hour}:${minute}:${second}`;

			this.logLists.push(`${time} ${txt}`);
		}
	}


}
</script>


<style lang='less' scoped>
.set-wraper{
	margin: 30px;
	padding: 30px 0;
	background: linear-gradient(to right bottom,#f0f2f5, #fff);
	/deep/ .ant-drawer-content{
		background: #000;
		.ant-drawer-wrapper-body{
			.ant-drawer-body{
				color: #fff;
				font-size: 12px;
			}
		}
	}
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