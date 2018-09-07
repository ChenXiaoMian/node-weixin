var express = require('express');
var router = express.Router();
const config = require('../config/wechat');

router.get('/auth', function(req, res, next) {
  var clientUrl = 'http://' + req.hostname + req.baseUrl + req.url;
  
});

module.exports = router;