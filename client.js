

// https://github.com/driverdan/node-XMLHttpRequest
// console.log(process.env.secret_key);

var SERVER = "localhost:8888"

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var arg = process.argv.slice(2);

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
}

var userName = arg[0]
var command = arg[1]
var amount = arg[2]
var url = "http://" + SERVER + "/" + command + "?"
url = url + "user=" + userName
if (amount) {
  url = url + ";amount=" + amount
}


var client = new HttpClient();
client.get(url, function(answer) {
    console.log()
    console.log("  " + answer);
    console.log()
})
