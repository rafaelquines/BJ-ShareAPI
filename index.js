const http = require('http');
const https = require('https');
const Datastore = require('nedb');
const cheerio = require('cheerio');
const querystring = require('querystring');
const BJConst = require('./BJConst.js');
const BJQuery = require('./BJQuery.js');



var db = new Datastore({ filename: 'BJ-shareAPI.db', autoload: true });

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

function search(query, callback) {
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

      var form = "";

      if (query.getSearchstr() !== undefined) {
        form += (form.length == 0) ? "?" : "&";
        form += "searchstr=" + query.getSearchstr();
      }

      if (query.getYear() !== undefined) {
        form += (form.length == 0) ? "?" : "&";
        form += "year=" + query.getYear();
      }

      if (query.getFreetorrent() === BJConst.FREE_TORRENT.TRUE) {
        form += (form.length == 0) ? "?" : "&";
        form += "freetorrent=" + BJConst.FREE_TORRENT.TRUE;

      }

      if (query.getTaglist() !== undefined) {
        form += (form.length == 0) ? "?" : "&";
        form += "taglist=" + query.getTaglist();
      }

      if (query.getTags_type() !== undefined) {
        form += (form.length == 0) ? "?" : "&";
        form += "tags_type=" + query.getTags_type();
      }

      if (query.getOrder_by() !== undefined) {
        form += (form.length == 0) ? "?" : "&";
        form += "order_by=" + query.getOrder_by();
      }

      if (query.getOrder_way() !== undefined) {
        form += (form.length == 0) ? "?" : "&";
        form += "order_way=" + query.getOrder_way();
      }

      if (query.getCategory() !== undefined) {
        query.getCategory().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "filter_cat[" + element + "]=1";
        });
      }

      if (query.getPatform() !== undefined) {
        query.getPatform().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "plataforma=" + element;
        });
      }

      if (query.getLanguage() !== undefined) {
        query.getLanguage().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "idioma[]=" + element;
        });
      }

      if (query.getAudio() !== undefined) {
        query.getAudio().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "audio[]=" + element;
        });
      }

      if (query.getFormat() !== undefined) {
        query.getFormat().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "format[]=" + element;
        });
      }

      if (query.getGenre() !== undefined) {
        query.getGenre().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "generosFilmes[]=" + element;
        });
      }

      if (query.getResolution() !== undefined) {
        query.getResolution().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "resolucao[]=" + element;
        });
      }

      if (query.getMovie_3D() !== undefined) {
        form += (form.length == 0) ? "?" : "&";
        form += "3d=" + query.getMovie_3D();
      }

      if (query.getVideo_codec() !== undefined) {
        query.getVideo_codec().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "codecvideo[]=" + element;
        });
      }

      if (query.getAudio_codec() !== undefined) {
        query.getAudio_codec().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "codecaudio[]=" + element;
        });
      }

      if (query.getQuality() !== undefined) {
        query.getQuality().forEach(element => {
          form += (form.length == 0) ? "?" : "&";
          form += "qualidade[]=" + element;
        });
      }
      form += (form.length == 0) ? "?" : "&";
      form += "action=basic&searchsubmit=1";
      var options = {
        hostname: 'bj-share.info',
        port: 443,
        path: '/torrents.php' + form,
        method: 'GET',
        headers: {
          'Cookie': cookies
        }
      };

      var body = "";

      var req = https.request(options, (res) => {
        if (res.statusCode = 200) {
          status = true;
          message = 'Search successful';
          data = {};
          body = "";
        } else {
          status = false;
          message = 'Status code returned other than 200';
          data = {};
        }

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          var result = { "status": status, "message": message, "data": data };
          var resultset = [];
          var $ = cheerio.load(body);
          $('tr.group').each(function (i, element) {
            var a = $(this);
            var r = {}
            r.nome = a.children('td.big_info').children('div.group_info').children('a.tooltip').text();
            var ano = a.children('td.big_info').children('div.group_info').html();
            ano = ano.substring(ano.indexOf("</a>"));
            ano = ano.substring(0, ano.indexOf("<div"));
            if(ano.indexOf("[") !== -1){
              r.ano = ano.substring(ano.indexOf("[") + 1, ano.indexOf("]"));
            } else {
              r.ano = "";
            }
            r.category = a.children('td.cats_col').children('a').children('img').attr('alt');
            r.url = a.children('td.big_info').children('div.group_info').children('a.tooltip').attr('href');
            r.tags = [];
            a.children('td.big_info').children('div.group_info').children('div.tags').children('a').each(function (i, element) {
              r.tags.push($(this).text());
            });
            r.info = a.children('td.big_info').children('div.group_info').children('div.torrent_info').text();

            a.children('td.number_column').each(function (i, element) {
              switch (i) {
                case 0:
                r.size = $(this).text();
                break;
                case 1:
                r.snatches = $(this).text();
                break;
                case 2:
                r.seeders = $(this).text();
                break;
                case 3:
                r.leechers = $(this).text();
                break;
              }
            });
            resultset.push(r);
          });
          $('tr.torrent').each(function (i, element) {
            var a = $(this);
            var a = $(this);
            var r = {}
            r.nome = a.children('td.big_info').children('div.group_info').children('a.tooltip').text();
            var ano = a.children('td.big_info').children('div.group_info').html();
            ano = ano.substring(0, ano.indexOf("<div"));
            ano = ano.substring(ano.lastIndexOf("</a>"));
            if(ano.indexOf("[") != -1){
              r.ano = ano.substring(ano.indexOf("[") + 1, ano.indexOf("]"));
            } else {
              r.ano = "";
            }
            r.category = a.children('td.cats_col').children('a').children('img').attr('alt');
            r.url = a.children('td.big_info').children('div.group_info').children('a.tooltip').attr('href');
            r.tags = [];
            a.children('td.big_info').children('div.group_info').children('div.tags').children('a').each(function (i, element) {
              r.tags.push($(this).text());
            });
            r.info = a.children('td.big_info').children('div.group_info').children('div.torrent_info').text();
            a.children('td.number_column').each(function (i, element) {
              switch (i) {
                case 0:
                  r.size = $(this).text();
                  break;
                case 1:
                  r.snatches = $(this).text();
                  break;
                case 2:
                  r.seeders = $(this).text();
                  break;
                case 3:
                  r.leechers = $(this).text();
                  break;
              }
            });
            resultset.push(r);
          });
          result.data.resultset = resultset;
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

      req.end();
      console.log("#######################");
      console.log(form);
      console.log("#######################");

    }
  })
}


http.createServer(function (req, res) {
  res.writeHead(443, { 'Content-Type': ' application/json' });


  // var username = 'user';
  // var password = '*******';
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
  //         var query = new BJQuery("Arrow");
  //         search(query, function (result) {
  //           res.end('{"result": ' + JSON.stringify(result) + '}');
  //         });
  //       }
  //     });
  // });

  var query = new BJQuery("arrow");

  search(query, function (result) {
    res.end('{"result": ' + JSON.stringify(result) + '}');
  });

}).listen(3000);
console.log('Server running at http://localhost:3000/');

