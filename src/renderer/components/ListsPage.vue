<template>
	<div>
		<div class="file-lists">
			<div class="list-item" v-for="(name,idx) in lists" :key="idx">
				<div class="file-name">{{name}}</div>
				<div class="file-ctrl">
					<span @click="FileDelete(idx)">删除</span>
					<span @click="FileEdit(idx)">编辑</span>
					<span @click="FileView(idx)">预览</span>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import fs from 'fs';
import path from 'path';
import file from '../../javascript/file.js';

export default {
	name: 'list-page',
	data(){
		return {
			servport: '',
			servpath: '',
			lists: []
		}
	},
	created() {
		this.$nextTick(() => {
			this.checkFile();
		})
	},
	mounted() {
	},
	methods: {
		checkFile(){
			this.servport = sessionStorage.getItem('port');
			this.servpath = sessionStorage.getItem('path');
			this.getFilesLists()
		},
		getFilesLists(){
			let files = fs.readdirSync(path.join(__static, `../../${this.servpath}/`))
			let file = []
			files.forEach(item => {
				let type = this.getFileType(item)
				if(type == 'json'){
					// console.log(path.join(__static, `../../${this.servpath}/${item}`));
					file.push(item)
				}
			})
			this.lists = file;
			this.$root.HandleEvent.$emit('addLog' ,{
				mess: `get the api lists ok`,
				type: "handle",
				time: new Date().getTime()
			})
		},
		getFileType(furl){
			let arr = furl.split('.');
			let len = arr.length ;
			if(len == 1){
				return 'dir'
			}
			return arr[len - 1]
		},
		FileDelete(idx){
			let name = this.lists[idx];
			fs.unlink(path.join(__static, `../../${this.servpath}/${name}`), err => {
				if(!err){
					this.$root.HandleEvent.$emit('addLog' ,{
						mess: `delete the file ${name} ok`,
						type: "handle",
						time: new Date().getTime()
					})
					this.lists.splice(idx, 1);
				}else{
					this.$root.HandleEvent.$emit('addLog' ,{
						mess: `delete the file ${name} err`,
						type: "error",
						time: new Date().getTime()
					})
					throw err;
				}
			})
		},
		FileEdit(idx){
			let name = this.lists[idx];
			this.$router.push({path: './landing', query: {file: name}})
		},
		FileView(idx){

		}
	}
}
</script>


<style lang='scss' scoped>
@import '../assets/common.scss';

.file-lists{
	.list-item{
		width: 100%;
		display: table;
		height: 44px;
		line-height: 44px;
		border-bottom: 1px solid #ccc;
		.file-name{
			float: left;
			width: 50%;
			padding-left: 20px;
		}
		.file-ctrl{
			float:right;
			text-align: right;
			padding-right: 50px;
			width: 50%;
			span{
				display: inline-block;
				width: 44px;
				text-align: center;
				font-size: 12px;
				color: #888;
				&:hover{
					cursor: pointer;
					color: red;
				}
			}
		}
	}
}
</style>