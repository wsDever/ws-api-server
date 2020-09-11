const os = require('os');
export default{
	getIpAdress(type) {
		try{
			const interfaces = os.networkInterfaces();
			for (let devName in interfaces) {
				let iface = interfaces[devName];
				for (let i = 0; i < iface.length; i++) {
					let alias = iface[i];
					if (alias.family === `${type}` && alias.address !== '127.0.0.1' && !alias.internal) {
						return alias.address;
					}
				}
			}
		}catch(e){
			return 'error'
		}
	},
}