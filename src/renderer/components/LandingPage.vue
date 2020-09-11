<template>
  <div class="land-wraper">
	  <div class="edit-wraper">
		<div class="edit-box">
			<div class="edit-title"><span>接口名称</span><input type="text" v-model="fileName"></div>
			<div class="edit-title"><span>接口用途</span><input type="text"></div>
			<textarea name="" id="source" cols="30" rows="10" @input="watchEdit"></textarea>
		</div>
		<div class="edit-result">
			<ul class="result-tips">
				<li>1、注意中英文标点切换</li>
				<li>2、key、value值全部用双引号</li>
			</ul>
			<pre>{{editCode}}</pre>
		</div>
	  </div>
	  <div class="land-tool">
		<div class="btn" @click="createFile">保 存</div>
	  </div>
  </div>
</template>

<script>
  import fs from 'fs';
  import path from 'path';
  
  import file from '../../javascript/file.js';
  import common from '../../javascript/common.js';
  import { remote } from 'electron';

  export default {
    name: 'landing-page',
	components: { },
	data(){
		return {
			servport: '',
			servpath: '',
			
			editCode: '',
			fileName: ''
		}
	},
	mounted(){
		this.$nextTick(() => {
			this.checkFile();
		})
	},

    methods: {
    //   open (link) {
    //     this.$electron.shell.openExternal(link)
	//   }
	    checkFile(){
			this.servport = sessionStorage.getItem('port');
			this.servpath = sessionStorage.getItem('path');
			if(this.$route.query.file){
				this.fileName = this.$route.query.file;
				this.getFile(this.fileName);
			}
		},
		createFile(){
			if(this.$root.server){
				this.$root.server.close();
				this.$root.server = null;
				this.$root.HandleEvent.$emit('addLog' ,{
					mess: `the service closed ok`,
					type: "service",
					time: new Date().getTime()
				})
			}
			let txt = document.getElementById('source').value;
			if(!txt || !this.fileName){
				return ;
			}
			let _this = this;
			fs.writeFile(path.join(__static, `../../${this.servpath}/${this.fileName}`), txt, function(e){
				if(e){
					_this.$root.HandleEvent.$emit('addLog' ,{
						mess: `save the file ${_this.fileName} error`,
						type: "error",
						time: new Date().getTime()
					})
				}else{
					_this.$root.HandleEvent.$emit('addLog' ,{
						mess: `save the file ${_this.fileName} ok`,
						type: "handle",
						time: new Date().getTime()
					})
					_this.$root.HandleEvent.$emit('serverStart');
				}
			});
		},
		getFile(filename){
			let fileTxt = fs.readFileSync(path.join(__static, `../../${this.servpath}/${filename}`), 'utf8');
			this.$root.HandleEvent.$emit('addLog' ,{
				mess: `open the file ${this.fileName} ok`,
				type: "handle",
				time: new Date().getTime()
			})
			document.getElementById('source').value = fileTxt ;
			this.editCode = fileTxt ;
		},
		watchEdit(e){
			this.editCode = e.target.value
		}
    }
  }
</script>
<style lang="scss">
@import '../assets/common.scss';

.land-wraper {
	$footBarHeight: 80px;

	height: 100%;
	.edit-wraper{
		display: flex;
		// height: calc(100vh - #{$headerHeight});
		height: calc(100% - #{$footBarHeight});
		min-height: 201px;
		.edit-box{
			width: 50%;
			height: 100%;
			padding-left: 10px;
			padding-top: 10px;
			padding-right: 10px;
			.edit-title{
				height: 40px;
				line-height: 40px;
				span{
					display: inline-block;
					width: 80px;
					font-size: 12px;
					vertical-align: middle;
				}
			}
			input{
				height: 30px;
				width: calc(100% - 80px);
				padding-left: 5px;
				font-size: 12px;
				outline: none;
			}
			textarea{
				width: 100%;
				resize: none;
				height: calc(100% - 80px);
				padding: 10px;
				line-height: 20px;
				overflow-y: auto;
			}
		}
		.edit-result{
			width: 50%;
			$lineHeight: 25px;
			.result-tips{
				padding: 20px;
				font-size: 12px;
				background: #333;
				list-style: none;
				line-height: $lineHeight;
				color: #999;
				height: 90px;
			}
			pre{
				height: calc(100% - #{$lineHeight * 2} - 40px);
				background: #333;
				color: #fff;
				padding: 9px 20px;
				font-size: 12px;
				line-height: 20px;
				overflow-y: auto;
			}
		}
	}
	.land-tool{
		height: $footBarHeight;
		padding: 20px 0;
		// border-top: 2px solid  red;
		.btn{
			width: 240px;
			height: 36px;
			line-height: 36px;
			border-radius: 5px;
			background: #1E79DE;
			text-align: center;
			margin: 0 auto;
			color: #fff;
			margin-top: calc(#{$footBarHeight/2} - 36px);
		}
	}
    // background:
    //   radial-gradient(
    //     ellipse at top left,
    //     rgba(255, 255, 255, 1) 40%,
    //     rgba(229, 229, 229, .9) 100%
    //   );
  }
</style>
