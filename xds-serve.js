;(function(){
	var win = window,
		storage = win.localStorage;
	
	function init(){
		// Setup postMessage event listeners
		if (win.addEventListener) {
			win.addEventListener('message', onMessage, false);
		} else if(win.attachEvent) {
			win.attachEvent('onmessage', onMessage);
		}

		// Tell the parent window we're ready.
		win.parent.postMessage(JSON.stringify({ready:true}),"*");
	}
	
	function onMessage(e){
		request = JSON.parse(e.data);
		if (request.type === "get"){
			respond(get(request), e.origin);
		} else if (request.type === "set"){
			respond(set(request), e.origin);
		} else if (request.type === "del"){
			respond(del(request), e.origin);
		}
	}
	
	function get(request){
		return { key: request.key, val: storage.getItem(request.key), type: "get", _xds: request._xds };
	}
	
	function set(request){
		storage.setItem(request.key, request.val);
		return { key: request.key, type: "set", _xds: request._xds };
	}
	
	function del(request){
		storage.removeItem(request.key);
		return {key: request.key, type: "del", _xds: request._xds};
	}
	
	function respond(response, origin){
		win.parent.postMessage(JSON.stringify(response),"*");
	}

	init();
})();