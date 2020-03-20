const http = require("http");
const fs = require("fs");
const WebSocketServer = require('websocket').server;
const lastLines = require('./utils.js').lastLines;
const newLines = require('./utils.js').newLines;

const LOGFILE = "logfile";

let lastLine;
const server = http.createServer(function (req, res) {
    if (req.url == "/log"){
        fs.readFile("index.html", function (err, data) {
            if (err) {
                console.error(err.message);
                res.writeHead(404, {'content-type': 'text/html'});
                res.write('index.html not found.');
                res.end();
            }
            else {
                res.write(data);
                res.end();
            }
        });
    }
})

server.listen(8080, function(){
    console.log("server listening on http://localhost:8080");
});

wsServer = new WebSocketServer({
    httpServer: server
});

let connections = [];

wsServer.on('request', function(request) {
    connections.push(request.accept(null, request.origin));
});

wsServer.on('connect', connection => {
    lastLines(LOGFILE)
    .then(lines => {
        connection.send(JSON.stringify({ filename: LOGFILE, lines }));
    })
    .catch(err => {
       connection.send(JSON.stringify( err ));
    });
    
    connection.on('close', function(connection) {
        let i = connections.indexOf(connection);
        connections.splice(i, 1)
    });
});

fs.watchFile(LOGFILE, (curr, prev) => {

    if (curr.ctimeMs == 0) {
        connections.forEach( c => {
            c.send(JSON.stringify( { error: "File doesn't exists at the moment." } ));
        });
    } else if (curr.mtime !== prev.mtime){
        newLines(LOGFILE, lastLine)
        .then(lines => {
            if (lines.length > 0) {
                connections.forEach( c => {
                    c.send(JSON.stringify({ filename: LOGFILE, lines }));
                });
            }
        })
        .catch(error => {
            connections.forEach( c => {
                c.send(JSON.stringify( { error } ));
            });
        });
    }
});