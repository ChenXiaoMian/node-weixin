var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('share', { 
    title: '分享到朋友圈'
  });
});

module.exports = router;
