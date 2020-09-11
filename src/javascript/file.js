import fs from 'fs';
import path from 'path';

export default{
	fileExists(filepath, callback){
		fs.access(path.join(__static, filepath), fs.constants.F_OK, err => callback(err))
	},
	fileRead(filepath, type = 'string', callback){
		fs.readFile(path.join(__static, filepath), 'utf8', (err, data) => {
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
	fileWrite(filepath, filecontent, callback){
		fs.writeFile(path.join(__static, filepath), filecontent, { encoding: 'utf-8' }, res => callback(res));
	}
}