var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var fs = require('fs');
var jf = require("jsonfile")
var util = require("util")
var AWS = require("aws-sdk");

user = require("./user")

jf.readFile("./data.json", function(err, obj) {
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
handle["/app"] = requestHandlers.app;
handle["/credit"] = requestHandlers.credit;
handle["/debit"] = requestHandlers.debit;
handle["/balance"] = requestHandlers.balance;
handle["/set"] = requestHandlers.set;
handle["/add"] = requestHandlers.add;



server.start(router.route, handle);
