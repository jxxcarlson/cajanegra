#!/usr/bin/env node

// https://github.com/driverdan/node-XMLHttpRequest

// var SERVER = "localhost:8888"
var SERVER = "10.0.1.20:8888"
// var SERVER = "nodejs-cajanegra.rhcloud.com:8888"

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var command = process.argv.slice(2,3);
var arg = process.argv.slice(3);

var httpClient = function() {
    this.get = function(url, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == 4 && httpRequest.status == 200)
              callback(httpRequest.responseText);
        }

        httpRequest.open( "GET", url, true );
        httpRequest.send( null );
    }
}


/*
var url = "http://" + SERVER + "/"

if (arg[0] == "-c" && arg[1]) {
  url += arg[1]
} else {
  url += arg[1] + "?"
  url += "user=" +  arg[0]
  if (arg[2]) {
    url = url + ";amount=" + arg[2]
  }
}
*/

var url = "http://" + SERVER + "/" + command + "?"
last_index = arg.length - 1
for (k=0; k < last_index; k++) {
  url += "arg" + (k+1) + "=" + arg[k] + ";"
}
url += "arg" + (last_index + 1) + "=" + arg[last_index]

console.log(url)

client = new httpClient();
client.get(url, function(answer) {
    console.log()
    console.log("  " + answer);
    console.log()
})
