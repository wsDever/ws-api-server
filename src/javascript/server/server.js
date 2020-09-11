import http from 'http'
import context from './context';
import request from './request';
import response from './response';

export default class ApplicationServer{
	constructor(){
		this.callbackFunc;

		this.context = context;
		this.request = request;
		this.response = response;
		this.server = null;
	}
	listen(...args){
		this.server = http.createServer(this.callback())
		console.log(this.server);
		this.server.listen(...args);
	}
	use(fn){
		this.callbackFunc = fn;
	}
	close(){
		this.server.close().then(() => {
			console.log('close server ok');
		})
	}
	callback(){
		return (req, res) => {
			let ctx = this.createContext(req, res);
			let respond = () => this.responseBody(ctx);
			this.callbackFunc(ctx).then(respond);
		}
	}
	createContext(req, res){
		let ctx = Object.create(this.context);
		ctx.request = Object.create(this.request);
		ctx.response = Object.create(this.response);
		ctx.req = ctx.response.req = req;
		ctx.res = ctx.response.res = res;
		return ctx;
	}
	responseBody(ctx){
		let body = ctx.body;
		if(typeof body == 'string'){
			// ctx.res.end(body)
			ctx.res.write(body)
		}else if(typeof body == 'object'){
			ctx.res.write(JSON.stringify(body))
			// ctx.res.end(JSON.stringify(body))
		}
		ctx.res.end();
	}
}