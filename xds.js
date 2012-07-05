var xds = function(url){
	this.serverUrl =  url; //"../xds/xds-serve/xds-serve.html";
	this.server = false;
	this.serverFrame = false;
	this._id = 0;
	this.callbacks = [];
	this.queue = [];
	this.init();
}

xds.prototype = {
	
    constructor: xds,

	init: function(){
		//this may be called multiple times, bail if things are already done
		if (this.server || this.serverFrame){
			return;
		}
		
		//create the server frame out of sight
		this.serverFrame = window.document.createElement('iframe');
		this.serverFrame.style.position = "absolute"; 
		this.serverFrame.style.left = this.serverFrame.style.top = "-999";

		//set up something to handle the "ready" message back from the server, and any responses therein
		var that = this;
		if (window.addEventListener){
			window.addEventListener('message', function(e){ that.onMessage(e); }, false);
		} else {
			window.attachEvent('onmessage', function(e){ that.onMessage(e); });
		}
		
		window.document.body.appendChild(this.serverFrame);
		this.serverFrame.src = this.serverUrl;
	},
	
	onMessage: function(e){
		response = JSON.parse(e.data);
		if (response.ready === true){
			this.server = this.serverFrame.contentWindow;
			this.processQueue();
			return;
		} else if (response.type === "get"){
			if (typeof this.callbacks[response._xds] !== "undefined"){
				this.callbacks[response._xds](response.val, response);
			}
		} else if (response.type === "set"){
			if (typeof this.callbacks[response._xds] !== "undefined"){
				this.callbacks[response._xds](response);
			}
		} else if (response.type === "del"){
			if (typeof this.callbacks[response._xds] !== "undefined"){
				this.callbacks[response._xds](response);
			}
		}
	},
	
	processQueue: function(){
		//nothing to do
		if (!this.queue){
			return;
		}
		
		//no server yet, better set it up
		if (!this.server){
			this.init();
			return;
		}
		
		//do the damn thing
		while(this.queue.length > 0) {
			this.server.postMessage(JSON.stringify(this.queue.shift()),"*");
		}
	},
	
	post: function(request, callback){
		//increment the request id to keep track of callbacks
		this._id++;
		request._xds = this._id;
		
		//store the callback for later use
		if (typeof callback !== "undefined" && callback !== null && callback !== false){
			this.callbacks[this._id] = callback;
		}
		
		//if the server isn't ready yet queue it and run/rerun init
		if (this.server){
			//post the reuqest to the iframe ("server")
			this.server.postMessage(JSON.stringify(request),"*");
		} else {
			this.queue.push(request);
			this.init();
		}
	},
	
	//create and send get request
	getItem: function(key,callback){
		this.post({'type': "get", 'key':key}, callback);
	},
	
	//create and send set request
	setItem: function(key, val, callback){
		this.post({'type': "set", 'key':key, 'val': val}, callback);
	},

	//create and send delete request
	removeItem: function(key, callback){
		this.post({'type': "del", 'key': key}, callback);
	},
	
	getObject: function(key, callback){
		this.getItem(key, function(value, response){
			//parse the response string back into the original object + null handling
			callback(value && JSON.parse(value), response);
		});
	},
	
	setObject: function(key, value, callback){
		//turn the object into a storable string
		this.setItem(key, JSON.stringify(value), callback);
	},
	
	removeObject: function(key, callback){
		this.removeItem(key, callback);
	}
}