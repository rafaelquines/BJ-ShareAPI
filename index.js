var http = require('http');
var https = require('https');
var querystring = require('querystring');

function login(callback){
  var status = false;
  var message = '';
  var data = {};

  var postData = querystring.stringify({
    'username': '',
    'password':''
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
    if(res.statusCode = 302){
      status = true;
      message = 'Login successful';
      data = {"cookies": JSON.stringify(res.headers["set-cookie"])};
    } else {
      status = false;
      message = 'Status code returned other than 302';
      data = {};
    }
    var result = {"status": status, "message": message, "data": data };
    callback(result);
  });
  
  req.on('error', (e) => {
    status = false;
    message = 'problem with request: '+e.message;
    data = {};
    var result = {"status": status, "message": message, "data": data };
    callback(result);
  });
  
  req.write(postData);
  req.end();
}

function search(cookies, callback){
  var status = false;
  var message = '';
  var data = {};
  

  var getData = querystring.stringify({
    'username': '',
    'password':''
  });

  var options = {
    hostname: 'bj-share.info',
    port: 443,
    path: '/index.php',
    method: 'GET',
    headers: {
     'Cookie': '__cfduid=db20069544fe4e64929daa653a5ba5c311532035085;PHPSESSID=cimrke1sb4gabvbul4k8aojde1;session=uwj08zaL%2FPbHnA13%2BrBQNYM3YgsIUYFERfWHbwdc0EM0xc7fjkFwq3uB%2FV7ZFWlUCHFXrKCKNJT80RDsQdWhZuXGaCGQgwg7OwfE9RniOqEVotSggzqnKAC5ygLyLX%2Fg3dgeDDiHPuDaHVBTKJZ7WQ%3D%3D'
      
    }
  };

  var req = https.request(options, (res) => {
    if(res.statusCode = 200){
      status = true;
      message = 'Search successful';
      data = {"body": ''};
    } else {
      status = false;
      message = 'Status code returned other than 200';
      data = {};
    }

    res.on('data', (chunk) =>{
        data.body += chunk;
    });

    res.on('end', () =>{
      var result = {"status": status, "message": message, "data": data };
      callback(result);
    });
  });

  req.on('error', (e) => {
    status = false;
    message = 'problem with request: '+e.message;
    data = {};
    var result = {"status": status, "message": message, "data": data };
    callback(result);
  });

  req.write(getData);
  req.end();
}


http.createServer(function (req, res) {
  res.writeHead(443 , {'Content-Type': ' application/json'});
  
  //login(function(result){    
  //  res.end('{"result": '+JSON.stringify(result)+'}');
  //});

  search('',function(result){
    res.end('{"result": '+JSON.stringify(result)+'}');
  });
  
}).listen(3000);
console.log('Server running at http://localhost:3000/');

