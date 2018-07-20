const http = require('http');
const https = require('https');
const Datastore = require('nedb');
const querystring = require('querystring');



var db = new Datastore({ filename: 'BJ-shareAPI', autoload: true });

function login(username, password, callback) {
  var status = false;
  var message = '';
  var data = {};

  var postData = querystring.stringify({
    'username': username,
    'password': password
  });

  var options = {
    hostname: 'bj-share.info',
    port: 443,
    path: '/login.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  req = https.request(options, (res) => {
    if (res.statusCode = 302) {
      status = true;
      message = 'Login successful';
      data = { "cookies": JSON.stringify(res.headers["set-cookie"]) };
    } else {
      status = false;
      message = 'Status code returned other than 302';
      data = {};
    }
    var result = { "status": status, "message": message, "data": data };
    callback(result);
  });

  req.on('error', (e) => {
    status = false;
    message = 'problem with request: ' + e.message;
    data = {};
    var result = { "status": status, "message": message, "data": data };
    callback(result);
  });

  req.write(postData);
  req.end();
}

function search(callback) {
  var status = false;
  var message = '';
  var data = {};
  var cookies = '';
  db.findOne({}, function (err, doc) {
    if (err) {
      status = false;
      message = 'problem with persit data: [' + err.errorType + '] ' + err.message;
      data = {};
      var result = { "status": status, "message": message, "data": data };
      callback(result);
    } else {
      cookies = doc.cookies;

      var getData = querystring.stringify({
        'username': '',
        'password': ''
      });

      var options = {
        hostname: 'bj-share.info',
        port: 443,
        path: '/index.php',
        method: 'GET',
        headers: {
          'Cookie': cookies
        }
      };

      var req = https.request(options, (res) => {
        if (res.statusCode = 200) {
          status = true;
          message = 'Search successful';
          data = { "body": '', "header": { "req": options, res: res.headers } };
        } else {
          status = false;
          message = 'Status code returned other than 200';
          data = {};
        }

        res.on('data', (chunk) => {
          data.body += chunk;
        });

        res.on('end', () => {
          var result = { "status": status, "message": message, "data": data };
          callback(result);
        });
      });

      req.on('error', (e) => {
        status = false;
        message = 'problem with request: ' + e.message;
        data = {};
        var result = { "status": status, "message": message, "data": data };
        callback(result);
      });

      req.write(getData);
      req.end();
    }
  })
}


http.createServer(function (req, res) {
  res.writeHead(443, { 'Content-Type': ' application/json' });
  // var username = 'user';
  // var password = '********';
  // login(username, password, function (result) {
  //   var array = JSON.parse(result.data.cookies);
  //   var cookies = array[0].split(";")[0];
  //   console.log(cookies);
  //   for (var i = 1; i < array.length; i++) {
  //     cookies += ";" + array[i].split(";")[0];
  //   }
  //   db.insert({ username: username, cookies: cookies },
  //     function (err, doc) {
  //       if (err) {
  //         status = false;
  //         message = 'problem with persit data: [' + err.errorType + '] ' + err.message;
  //         data = {};
  //         var result = { "status": status, "message": message, "data": data };
  //         res.end('{"result": ' + JSON.stringify(result) + '}');
  //       } else {
  //         search(function (result) {
  //           res.end('{"result": ' + JSON.stringify(result) + '}');
  //         });
  //       }
  //     });
  // });

  search(function(result){
    res.end('{"result": '+JSON.stringify(result)+'}');
  });

}).listen(3000);
console.log('Server running at http://localhost:3000/');

