var express = require('express');
var router = express.Router();

const config = require('../config/wechat');
const wxAuth = require('../api/wxAuth');
const getJsApiData = require('../libs/getJsApiData');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const clientUrl = 'http://' + req.hostname + req.baseUrl + req.url;
  console.log(clientUrl)
  getJsApiData(clientUrl).then((data) => {
    res.render('share', { 
      title: '分享到朋友圈',
      ticket: data.ticket,
      signature: data.signature,
      timestamp: data.timestamp,
      noncestr: data.noncestr,
      appId: data.appId
    });
  });
});

module.exports = router;
