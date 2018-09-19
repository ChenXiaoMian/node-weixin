const axios = require('axios')
const config = require('../config/wechat')
const fs = require('fs')
// const redis = require('redis');
// client = redis.createClient('6379', '127.0.0.1');

// client.on("error", function (err) {
//   console.log("Error " + err);
// });

const getAccessToken = function () {
  let url = 'https://api.weixin.qq.com/cgi-bin/token'
  let params = {
    grant_type: 'client_credential',
    appid: config.appId,
    secret: config.appSecret
  }
  return new Promise ((resolve, reject) => {
    axios.get(url, {
      params
    }).then((res)=>{
      console.log(res.data)
      resolve(res.data)
    }).catch((e) => {
      reject(e)
    })
  })

  // return new Promise ((resolve, reject) => {
  //   resolve({
  //     "access_token": "13_18UVB82v850FUmRmZw2QYhW499GvQ8LFBk4J3cdLBe9s8OVqVihhxeitw2GF87c-8YgU4JZ9zv6MaH6MeYBQB8L1hgXwxr30sNINSfryC0MBMldKhgKX0MjMoa1S7Tdm5k_jTIwihmukDFFJZMUhAEAFSA",
  //     "expires_in": 7200
  //   })
  // })
}

const saveToken = function () {
  getAccessToken().then((res) => {
    let token = res['access_token']
    fs.writeFile('./token', token, function (err) {
      
    });
    // client.set("access_token", token, 'EX', 7200);    
  })
}

const refreshToken = function () {
  saveToken()
  setInterval(()=>{
    saveToken()
  }, 7000 * 1000)
};

module.exports = refreshToken;