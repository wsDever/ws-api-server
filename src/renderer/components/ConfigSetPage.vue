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
				<span class="input-info">说明：vue项目build生成的文件夹</span>
			</a-form-model-item>
			<a-form-model-item label="项目">
				<a-input v-model="prodDir" readOnly @click="openProgFileHandler" class="file-input" />
				<span class="input-info">说明：要打包的项目根文件夹</span>
			</a-form-model-item>
			<a-form-model-item label="项目名称">
				<a-input v-model="prodName" />
				<span class="input-info">说明：一般是自动获取项目文件夹的名称，项目名称与文件夹名称不一致时请手动修改</span>
			</a-form-model-item>
			<a-form-model-item label="打包目录">
				<a-input v-model="buildDir" readOnly @click="openBuildFileHandler" class="file-input" />
				<span class="input-info">说明：打包程序所在的目录文件夹，一般就是 work_dir 目录</span>
			</a-form-model-item>
			<a-form-model-item label="打包标志">
				<a-input v-model="buildFlag" />
				<span class="input-info">说明：打包生成的文件名称后添加的一个标志，一般可不管</span>
			</a-form-model-item>
		</a-form-model>

		<a-button class="sumbit-btn" type="primary" @click="readyBuild" block>
			立即打包
		</a-button>
		<a-drawer
			title="打包进程"
			placement="right"
			:closable="true"
			:visible="logShow"
			:get-container="false"
			@close="logShow=false"
			>
			<div v-for="(log, i) in logLists" :class="`log_${ log.type }`" :key="i">{{ log.text }}</div>
		</a-drawer>
	</div>
</template>


<script>
import fs from 'fs';
import process from 'child_process';
import archiver from 'archiver';
import iconv from 'iconv-lite';
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
							this.$message.error(`该目录下不包含[env]文件夹`);
						}
					})
				}
			})
		},
		doZip(source, dist){		
			return new Promise((resolve, reject) => {
				let output = fs.createWriteStream(dist);
				let archive = archiver('zip', {
					zlib: {
						level: 9
					}
				})
	
				output.on('close', () => {
					resolve('0')
				})
				archive.on('error', err => {
					this.handleLogs(`压缩失败，原因：${ err }`, 'error');
					resolve(-1)
				})
	
				archive.pipe(output);
				archive.directory(source, false);
				archive.finalize();
			})
		},
		doDelZip(source){
			return new Promise((resolve, reject) => {
				fs.access(source , fs.constants.F_OK, (err) => {
					if(!err){
						fs.unlinkSync(source);
					}
					resolve(0);
				})
			})
		},
		doCopy(source, dist, delsource){
			return new Promise((resolve, reject) => {
				let readStream = fs.createReadStream(source);
				let writeStream = fs.createWriteStream(dist);
				readStream.pipe(writeStream);
				writeStream.on('close', () => {
					delsource && fs.unlinkSync(source);
					resolve(0)
				})
				writeStream.on('error', () => {
					resolve(-1)
				})
			})
		},
		doBuild(){
			// let _cmd = 'cd F:/work_dir/env && java -cp .;zip4j_1.3.1.jar;bcprov-jdk15-133.jar com.tfzq.javatest.PacketModuleUtil "F://work_dir" "h5_base" "110"'		
			let _buildDir = this.buildDir.replace(/\\/g, '\\\\');
			let _cd = `cd ${ _buildDir +'\\' + 'env' }`
			let _bd = `java -cp .;zip4j_1.3.1.jar;bcprov-jdk15-133.jar com.tfzq.javatest.PacketModuleUtil "${ _buildDir }" "${ this.prodName }" "${ this.buildFlag }"`
			
			let _timer = null;
			let _i = 0;
			_timer = setInterval(() => {
				this.handleLogs(`打包用时：${ ++_i }`);
			}, 1000 * 1)

			process.exec(`${ _cd } && ${ _bd }`, { encoding: 'binary' }, (err, stdout, stderr) => {
				clearInterval(_timer);
				if(stderr){
					this.handleLogs(`打包失败，原因：${ iconv.decode(new Buffer(stderr, 'binary'), 'cp936') }`, 'error');
					return;
				}
				// console.log(stdout);
				this.handleLogs(`打包完成，谢谢！`);
				this.handleLogs(`打包流程结束`);
			})
		},
		async readyBuild(){
			if(this.prodDir == '' || this.buildDir == ''){
				this.$message.error(`请选择正确的项目及打包目录`);
				return ;
			}
			this.logLists = [];
			this.logShow = true;
			
			let _source = this.prodDir.replace(/\\/g, '\\\\') + '\\' + this.fileDir;
			let _dist = this.prodDir.replace(/\\/g, '\\\\') + '\\' + this.prodName + '.zip';
			
			let _sourceFile = _source + '\\' + this.prodName + '.zip' ;
			// 先删除light目前下的zip
			this.handleLogs(`压缩生成 ${ this.prodName }.zip`);
			await this.doDelZip(_sourceFile);

			// 把目录生成zip
			await this.doZip(_source, _dist)
			
			// 复制到light中去
			let _c = await this.doCopy(_dist, _sourceFile, true);
			if(_c != 0){
				this.handleLogs(`${ this.prodName }.zip 生成失败`, 'error');
				this.handleLogs(`打包流程结束`);
				return ;
			}
			this.handleLogs(`${ this.prodName }.zip 生成成功`);

			let _buildDir = this.buildDir.replace(/\\/g, '\\\\');
			let _buildDist = _buildDir + '\\' + this.prodName + '.zip';

			// 删除build目录下的zip
			this.handleLogs(`删除打包目录中的 ${ this.prodName }.zip`);
			await this.doDelZip(_buildDist);

			// 把light下的zip复制到打包目录下
			let _cc = await this.doCopy(_sourceFile, _buildDist, false);
			if(_cc != 0){
				this.handleLogs(`复制 ${ this.prodName }.zip 到打包目录，失败`, 'error');
				this.handleLogs(`打包流程结束`);
				return ;
			}
			this.handleLogs(`复制 ${ this.prodName }.zip 到打包目录，成功`);

			this.handleLogs(`进入打包目录`);
			this.handleLogs(`开始打包，请等待......`);
			this.doBuild();
		},
		handleLogs(txt, type='info'){
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

			this.logLists.push(
					{
						type,
						text: `${time} ${txt}`
					}
				);
		}
	}


}
</script>


<style lang='less' scoped>
@import '../assets/var.less';
.set-wraper{
	// margin: 30px;
	padding: 30px 0;
	// background: linear-gradient(to right bottom,#f0f2f5, #fff);
	/deep/ .ant-drawer-content{
		background: #333;
		margin-top: @headerHeight;
		.ant-drawer-wrapper-body{
			.ant-drawer-body{
				font-size: 12px;
				.log_info{
					color: #fff;
				}
				.log_error{
					color: red;
				}
			}
		}
	}
	/deep/ .ant-form{
		.ant-row{
			.ant-form-item-control{
				position: relative;
				span.input-info{
					position: absolute;
					left: 0;
    				top: 18px;
					font-size: 12px;
					color: #bebebe;
				}
			}
		}
	}
}
.file-input{
	cursor: pointer;
}
.sumbit-btn{
	margin-top: 20px;
	width: 240px;
	margin-left: 50%;
    transform: translateX(-50%);
}

</style>