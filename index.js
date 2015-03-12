var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var moment = require('moment');

var fs = require('fs');
var jf = require("jsonfile")
var util = require("util")
var AWS = require("aws-sdk");


user = require("./user")
users = {}
keyvalue= {}

jf.readFile("./users.json", function(err, obj) {
  console.log(util.inspect(obj));
  users = {};
  for (k in obj) {
    var item = obj[k];
    var screenName = item["screenName"];
    var balance = item["balance"];
    var newUser = new user(screenName, balance);
    users[screenName] = newUser;
  }

})

jf.readFile("./keyvalue.json", function(err, obj) {
  now = moment();
  console.log("now: ", now.format());
  console.log("keyvalue.json:");
  console.log(util.inspect(obj));
  console.log("--------------------");
  keyvalue = obj;
  keyvalue["server_start_time"] = JSON.stringify(now);
})


// now = moment();
// keyvalue["server_start_time"] = JSON.stringify(now);
//jf.writeFile("./keyvalue.json", keyvalue, function(err) {})

/*
var jim = new user("jim", 10.23)
var dylan = new user("dylan", 11.08)
users = { "jim": jim, "dylan": dylan}


jf.writeFile("./data.json", users, function(err) {
  console.log(err)
})
*/

var handle = {};
handle["/"] = requestHandlers.start
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

handle["/hello"] = requestHandlers.hello;
handle["/credit"] = requestHandlers.credit;
handle["/debit"] = requestHandlers.debit;
handle["/balance"] = requestHandlers.balance;
handle["/set"] = requestHandlers.set;
handle["/add"] = requestHandlers.add;

handle["/get"] = requestHandlers.get;
handle["/put"] = requestHandlers.put;

handle["/uptime"] = requestHandlers.uptime;


server.start(router.route, handle);
