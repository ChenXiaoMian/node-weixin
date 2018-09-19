const axios = require('axios')
const path = require('path')
const url = require('url')

const utils = require('../api/utils')
const config = require('../config/wechat')

const fs = require('fs');
const token = fs.readFileSync('./token').toString();
// const redis = require('redis');
// client = redis.createClient('6379', '127.0.0.1');

// client.on("error", function (err) {
//   console.log("Error " + err);
// });

function getJsApiTicket(){
  // var ACCESS_TOKEN = ''
  // client.get("access_token", function (err, reply) {
  //   ACCESS_TOKEN = reply.toString()
  // });  
  return new Promise((resolve, reject) => {
    console.log(token)
    let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
    axios.get(url).then((res)=>{
      let result = res.data
      console.log(result)
      resolve(result.ticket)      
    }).catch((e) => {
      console.log(e)
      reject(e)
    })
  })
}

function getJsApiData(clientUrl){
  return new Promise((resolve, reject) => {
    getJsApiTicket().then(ticket =>{
      const noncestr = utils.getNoncestr();
      const timestamp = utils.getTimestamp();
      const result = {
        ticket: ticket,
        signature: utils.getSign(ticket, noncestr, timestamp, clientUrl),
        timestamp: timestamp,
        noncestr: noncestr,
        appId: config.appId
      }
      resolve(result)
    })
  })
}

module.exports = getJsApiData