const express = require('express');
const router = express.Router();

const config = require('../config/wechat');
const wxAuth = require('../api/wxAuth');

/**
 * 正确响应微信发送的Token验证
 */
router.get('/', wxAuth.checkSignature);

/**
 * 获取access_token
 */
router.get('/getAccessToken', wxAuth.getAccessToken);

/**
 * 引导用户获取code
 * 设置跳转地址，默认为用户授权
 * ?redirect_uri=''
 */
router.get('/getCode', wxAuth.getCode);

/**
 * 获取用户授权
 */
router.get('/userInfo', wxAuth.userInfo);

/**
 * 获取JS-SDK验证配置
 */
router.get('/getJsSDK', wxAuth.getJsSDK);
router.get('/getJsApi', wxAuth.getAuthAccessToken, wxAuth.getJsApiTicket, wxAuth.getJsApi);


module.exports = router;