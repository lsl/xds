var express = require('express'),
    http = require('http'),
    path = require('path'),
    client = express(),
    server = express();

server.use(express.static(__dirname));

http.createServer(server).listen(3001, "0.0.0.0");
console.log("server listening http://0.0.0.0:3001");

client.use(express.static(__dirname));

client.all('/', function(req, res){
  res.sendfile('example-client.html')
});


http.createServer(client).listen(3000);
console.log("client listening http://localhost:3000");
console.log("");
console.log("View http://localhost:3000/ in a browser, inspect console output");

