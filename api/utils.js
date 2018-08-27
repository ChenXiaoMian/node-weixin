// 通用函数
const crypto = require('crypto')

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
  getTimestamp: function(){
    return new Date().valueOf();
  },
  getSign: function(jsApiTicket, noncestr, timestamp, url){
    var sortData = `jsapi_ticket=${jsApiTicket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
    return utils.sha1(sortData)
  }
}

module.exports = utils