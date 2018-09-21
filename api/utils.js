// 通用函数
const crypto = require('crypto')

const raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
}

const utils = {
  sha1: function(str){
    var shasum = crypto.createHash('sha1')
    shasum.update(str)
    str = shasum.digest('hex')
    return str
  },
  getNoncestr: function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < 16; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
  createNonceStr: function(){
    return Math.random().toString(36).substr(2, 15);
  },
  createTimestamp: function(){
    return parseInt(new Date().getTime() / 1000) + '';
  },
  getTimestamp: function(){
    return new Date().valueOf();
  },
  getSign: function(jsApiTicket, noncestr, timestamp, url){
    var sortData = `jsapi_ticket=${jsApiTicket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
    return utils.sha1(sortData)
  },
  sign: function(ticket, noncestr, timestamp, url){
    var sortData = `jsapi_ticket=${jsApiTicket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
    // var ret = {
    //   jsapi_ticket: ticket,
    //   noncestr: noncestr,
    //   timestamp: timestamp,
    //   url: url
    // };
    // var str = raw(ret);
    var jsSHA = require('jssha');
    var shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(sortData)
    return shaObj.getHash("HEX");
  }
}

module.exports = utils