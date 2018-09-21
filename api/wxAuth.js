/**
 * 微信网页授权
 */
const axios = require('axios')
const path = require('path')
const url = require('url')

const config = require('../config/wechat')
const utils = require('./utils')
const appId = config.appId
const appSecret = config.appSecret
const token = config.token

// const redis = require('redis');
// client = redis.createClient('6379', '127.0.0.1');

// client.on("error", function (err) {
//   console.log("Error " + err);
// });

const wxAuth = {
  // 验证消息的确来自微信服务器
  checkSignature: (req, res, next) => {
    const query = url.parse(req.url, true).query
    const signature = query.signature
    const echostr = query.echostr
    const timestamp = query.timestamp
    const nonce = query.nonce

    var reqArray = [nonce, timestamp, token]
    // 对数组进行字典排序
    reqArray.sort()
    var sortStr = reqArray.join('')
    var sha1Str = utils.sha1(sortStr);

    if (signature === sha1Str) {    
      console.log(echostr)
      res.end(echostr)
    } else {
      console.log("授权失败！");
      res.end("false");
    }
  },
  // 获取普通access_token
  getAccessToken: (req, response, next) => {
    console.log('======accessToken======')
    let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
    axios.get(url).then((res)=>{
      let result = res.data
      console.log(result)
      req.access_token = result.access_token
      req.expires_in = result.expires_in
      response.send(result)
      // next()
    }).catch((e) => {
      console.log(e)
    })
  },
  // 返回授权地址，获取code
  getCode: (req, res, next) => {
    // 授权后重定向的回调链接地址， 请使用 urlEncode 对链接进行处理
    const REDIRECT_URI = 'http://wx.bestmian.com/wechat/userInfo'
    // snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
    // snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息 ）
    const SCOPE = 'snsapi_userinfo'
    // 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
    const STATE = ''
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`
    res.redirect(url)
  },
  // 返回授权地址，获取code
  getJsSDK: (req, res, next) => {
    // 授权后重定向的回调链接地址， 请使用 urlEncode 对链接进行处理
    const REDIRECT_URI = 'http://wx.bestmian.com/wechat/getJsApi'
    // snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
    // snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息 ）
    const SCOPE = 'snsapi_userinfo'
    // 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
    const STATE = ''
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`
    res.redirect(url)
  },
  // 接受code，获取用户授权结果
  userInfo: (request, response, next) => {
    const CODE = request.query.code
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${CODE}&grant_type=authorization_code`
    axios.get(url).then((res)=>{
      let result = res.data
      response.render('wechat', { 
        title: '微信用户授权',
        user: {
          access_token: result.access_token,
          openid: result.openid,
          expires_in: result.expires_in
        }
      });
    }).catch((e) => {
      console.log(e)
      response.end(e)
    })
  },
  // 中间件：根据code，获取授权access_token
  getAuthAccessToken: (request, response, next) => {
    const CODE = request.query.code
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${CODE}&grant_type=authorization_code`
    axios.get(url).then((res)=>{
      let result = res.data
      request.access_token = result.request
      // client.set("access_token", "string val", redis.print);
      next()
    }).catch((e) => {
      console.log(e)
      response.end(e)
    })
  },
  // 中间件：根据access_token，获取调用微信JS接口的临时票据jsapi_ticket
  getJsApiTicket: (request, response, next) => {
    const ACCESS_TOKEN = request.access_token
    let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${ACCESS_TOKEN}&type=jsapi`
    axios.get(url).then((res)=>{
      let result = res.data
      request.ticket = result.ticket
      next()
    }).catch((e) => {
      console.log(e)
    })
  },
  // 返回JS-SDK验证配置
  getJsApi: (request, response, next) => {
    const ticket = request.ticket
    const noncestr = utils.getNoncestr();
    const timestamp = utils.getTimestamp();
    const clientUrl = 'http://' + request.hostname + request.baseUrl + request.url;
     
    response.json({
      signature: utils.getSign(ticket, noncestr, timestamp, clientUrl),
      timestamp: timestamp,
      noncestr: noncestr,
      appId: config.appId
    })
  },
  signatureShare: (request, response, next)=>{
    response.end(request.ticket)
  }
}

module.exports = wxAuth