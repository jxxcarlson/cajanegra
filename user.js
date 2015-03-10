// http://book.mixu.net/node/ch6.html
// http://www.phpied.com/3-ways-to-define-a-javascript-class/
// http://openmymind.net/2012/2/3/Node-Require-and-Exports/

/*
> var user = require("./user")
undefined
> j = new user("jim", 23)
{ screenName: 'jim', balance: 23 }
> j.screenName
'jim'
> j.balance
23
*/

var User = function (screenName, balance) {
  this.screenName = screenName;
  this.balance = balance;
}

User.prototype.encode = function () {
  return JSON.stringify(this);
}

User.prototype.credit = function (amount) {
  this.balance = this.balance + amount;
  return this.balance;
}

User.prototype.debit = function (amount) {
  this.balance = this.balance - amount;
  return this.balance;
}

function decode (str) {
  hash = JSON.parse(str);
  return new User(hash["screenName"], hash["balance"])
}

module.exports = User;
module.exports.decode = decode;
