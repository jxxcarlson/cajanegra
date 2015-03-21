// var exec = require("child_process").exec;
var querystring = require("querystring"),
  fs = require("fs"),
  formidable = require("formidable"),
  jf = require("jsonfile")
  moment = require("moment");

function start(response) {
 console.log("Request handler 'start' was called.");

 var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="get">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';
 response.writeHead(200, {"Content-Type": "text/html"});
 response.write(body);
 response.end();
}

function queryHash(queryString) {

  if (queryString == null) {
    return {}
  }
  queryString = queryString.replace(/%22/g, "");
  queries = queryString.split(";");
  hash = {}
  for (k in queries) {
    part = queries[k].split("=")
    hash[part[0]] = part[1]
  }
  return hash
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
      console.log("parsing done");

      /* Possible error on Windows systems:
      tried to rename to an already existing file */
      fs.rename(files.upload.path, "/tmp/test.png", function(error) {
        if (error) {
          fs.unlink("/tmp/test.png");
        }
      });
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("received image:<br/>");
      response.write("<img src='/show' />");
      response.end();
    });
  }

function show(response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  fs.createReadStream("/tmp/test.png").pipe(response);
}

function hello(query, response) {
  console.log("Request handler 'hello' was called");
  response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "http://www.noteshare.io"});
  response.write("Yes, I am alive. Thankyou.")
  response.end();

}

function add(query, response) {
  console.log("Request handler 'add' was called with args " + query);

  var hash = queryHash(query);
  var userName = hash["arg1"];
  var amount = 0
  if (hash["arg2"]){
    amount = parseFloat(hash["amount"]);
  }
  if (users[userName]) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Error: " + userName + " already exists");
    response.end();
  } else {
    var newUser = new user(userName, amount)
    users[userName] = newUser;
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("New user " + userName + " has balance " + amount);
    response.end();
  }

  jf.writeFile("./users.json", users, function(err) {
    console.log(err)
  })

}

function balance(query, response) {
  console.log("Request handler 'balance' was called with args " + query);
  response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "http://www.noteshare.io"});
  //8 response.writeHead(200, {"Content-Type": "text/plain"});

  var hash = queryHash(query);
  var userName = hash["arg1"];
  var sessionUser = users[userName];
  if (sessionUser) {
    var balance = sessionUser.balance;
    response.write("Balance for " + userName + ": " + balance);
  } else {
    response.write("Error: no such user");
  }

  response.end();


}

function set(query, response) {
  console.log("Request handler 'set' was called with args " + query);
  response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "http://www.noteshare.io"});

  var hash = queryHash(query);
  var userName = hash["arg1"];
  var amount = parseFloat(hash["arg2"]);
  var sessionUser = users[userName];
  if (sessionUser && amount) {
    var balance = sessionUser.balance = amount
    response.write("New balance for " + userName + ": " + balance);
    jf.writeFile("./users.json", users, function(err) {
      console.log(err)
    })

  } else {
      response.write("Error: no such user or no amount");
  }
  response.end();
}


function credit(query, response) {
  console.log("Request handler 'credit' was called with args " + query);
  response.writeHead(200, {"Content-Type": "text/plain"});

  var hash = queryHash(query);
  var userName = hash["arg1"];
  var amount = parseFloat(hash["arg2"]);
  var sessionUser = users[userName];

  if (sessionUser && amount) {
    var balance = sessionUser.credit(amount)
    response.write("New balance for " + userName + ": " + balance);
    jf.writeFile("./users.json", users, function(err) {
      console.log(err)
      })
  } else {
      response.write("Error:either the user or the amount is not defined:");
  }
  response.end();
}


function debit(query, response) {
  console.log("Request handler 'debit' was called with args " + query);
  response.writeHead(200, {"Content-Type": "text/plain"});

  var hash = queryHash(query);
  var userName = hash["arg1"];
  var amount = parseFloat(hash["arg2"]);

  if (sessionUser && amount) {
    var sessionUser = users[userName];
    var balance = sessionUser.debit(amount)
    jf.writeFile("./users.json", users, function(err) {
      console.log(err)
    })
  }

  response.write("New balance for " + userName + ": " + balance);
  response.end();

}


//////////////

function get(query, response) {
  console.log("Request handler 'get' was called with args " + query);
  response.writeHead(200, {"Content-Type": "text/plain"});

  var hash = queryHash(query);
  var key = hash["arg1"]

  if (key) {
    var value = JSON.parse(keyvalue[key]);
    jf.writeFile("./users.json", users, function(err) {
      console.log(err)
    })
  }

  response.write(value);
  response.end();

}


function put(query, response) {
  console.log("Request handler 'put' was called with args " + query);
  response.writeHead(200, {"Content-Type": "text/plain"});

  var hash = queryHash(query);
  var key = hash["arg1"];
  var value = hash["arg2"];
  value = value.replace(/%20/g, " ")

  if (key && value) {
    keyvalue[key] = JSON.stringify(value);
    jf.writeFile("./keyvalue.json", keyvalue, function(err) {
      console.log(err)
    });
    response.write(value);
  } else {
    response.write("error");
  }


  response.end();

}

function uptime(query, response) {
  console.log("Request handler 'uptime' was called with args " + query);
  response.writeHead(200, {"Content-Type": "text/plain"});

  if (keyvalue["server_start_time"]) {

    var now = moment();
    var then = moment(JSON.parse(keyvalue["server_start_time"]))
    var elapsed_milliseconds = now - then;
    var elapsed_hours = elapsed_milliseconds/(1000*60*60);
    var elapsed_days = elapsed_hours/24;
    if (elapsed_hours < 24) {
      elapsed_hours = Math.round(1000*elapsed_hours)/1000;
      response.write(elapsed_hours + " hours");
    } else {
      elapsed_days = Math.round(1000*elapsed_days)/1000;
      response.write(elapsed_days + " days");
    }
  }

  response.end();

}


//////////////

exports.start = start;
exports.upload = upload;
exports.show = show;

exports.hello = hello;
exports.add = add;
exports.set = set;
exports.balance = balance;
exports.credit = credit;
exports.debit = debit;

exports.get = get;
exports.put = put;

exports.uptime = uptime;
