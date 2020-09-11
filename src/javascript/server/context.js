export default class Context{
	get query(){
		return this.request.query;
	}


	get body(){
		return this.response.body;
	}
	get status(){
		return this.response.status;
	}
	set body(new_body){
		this.response.body = new_body;
	}
	set status(new_status){
		this.response.status = new_status;
	}
}