'use strict';

require('babel-polyfill');

var Primus = require('primus'),
    http = require('http'),
    fs = require('fs'),
    url = require("url");

var server = http.createServer(function server(req, res) {
    // res.setHeader('Content-Type', 'text/html');
    // fs.createReadStream(__dirname + '/../index.html').pipe(res);

    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    res.writeHead(200);

    if (pathname == "/") {
        var html = fs.readFileSync("index.html", "utf8");
        res.write(html);
    } else if (pathname == "/client.js") {
        var script = fs.readFileSync(__dirname + "/client.js", "utf8");
        res.write(script);
    }

    res.end();
});

var options = {
    transformer: 'websockets'
};

var primus = new Primus(server, options);

primus.on('connection', function (spark) {
    console.log(spark.id, 'connected.');

    spark.write("Hello");

    spark.on("data", function (data) {
        return console.log(data);
    });
});

server.listen(2121);