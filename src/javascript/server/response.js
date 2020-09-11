export default class Response{
	get body(){
		return this._body;
	}
	set body(new_body){
		this._body = new_body;
	}
	get status(){
		return this.res.statusCode;
	}
	set status(new_status){
		if(typeof new_status != 'number'){
			throw new Error('statusCode must be a number!')
		}else{
			this.res.statusCode = new_status;
		}
	}
}