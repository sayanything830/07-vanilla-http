'use strict';

const http = require('http');
const bodyParser = require('./body-parse.js');
const cowsay = require('cowsay');

const app = http.createServer((request, response) => {
  bodyParser(request)
    .then(req => {
      if(req.method === 'GET' && req.url.pathname === '/') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify('hello from my server!'));
        response.end();
        return;
      }
      if(req.method === 'GET' && req.url.pathname === '/cowsay') {
        if(req.url.query.text) {
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.write(cowsay.say({
            text: req.url.query.text,
          }));
          response.end();
          return;
        }
        if(!req.url.query.text) {
          response.writeHead(400, {'Content-Type': 'text/plain'});
          response.write(cowsay.say({
            text: 'Bad Request',
          }));
          response.end();
          return;
        }
      }


      if(req.method === 'POST' && req.url.pathname === '/cowsay') {
        response.writeHead(201, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(req.body));
        response.end();
        return;
      }

      response.writeHead(400, {'Content-Type': 'text/plain'});
      response.write(cowsay.say({
        text: 'Bad Request',
      }));
      response.end();
      return;
    })
    .catch(err => {
      console.log(err);
      response.writeHead(400, {'Content-Type': 'text/plain'});
      response.write(cowsay.say({
        text: 'Bad Request',
      }));
      response.end();
      return;
    });
});

const server = module.exports = {};
server.start = (port, cb) => app.listen(port, cb);
server.stop = (cb) => app.close(cb);