import url from 'url';
export default class Request{
	get query(){
		return url.parse(this.req.url, true).query;
	}
}