import fs from 'fs';
import path from 'path';

export default{
	fileExists(filepath, callback){
		fs.access(path.join(__static, filepath), fs.constants.F_OK, err => callback(err))
	},
	fileReadSync(filepath, apifile = true){
		let __frp = apifile ? __root_dir : __static ;
		console.log("同步读取文件：", path.join(__frp, filepath));
		return fs.readFileSync(path.join(__frp, filepath), 'utf8');
	},
	fileRead(filepath, apifile = true, type = 'string', callback){
		let __frp = apifile ? __root_dir : __static ;
		console.log("异步读取文件：", path.join(__frp, filepath));

		fs.readFile(path.join(__frp, filepath), 'utf8', (err, data) => {
			if(err){
				callback('error', err)
				// let errTxt = ''
				// console.log(err.code);
				// if(err.code == 'ENOENT'){
				// 	errTxt = '配置文件或目录不存在'
				// }else{
				// 	errTxt = '读取配置文件失败'
				// }
				// remote.dialog.showMessageBox({
				// 	title: '提示',
				// 	type: 'info',
				// 	message: errTxt,
				// })
			}else{
				callback('success', type == 'json' ? JSON.parse(data) : data);
			}
		});

	},
	fileWrite(filepath, apifile = true, filecontent, callback){
		console.log("保存文件的路径：");
		let __frp = apifile ? __root_dir : __static ;
		console.log(path.join(__frp, filepath));
		fs.writeFile(path.join(__frp, filepath), filecontent, { encoding: 'utf-8' }, res => callback(res));
	}
}