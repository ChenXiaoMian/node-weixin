var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '基于Express开发微信公众号' });
});

module.exports = router;
