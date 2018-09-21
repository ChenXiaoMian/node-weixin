# node-weixin
node开发微信公众号

## 问题

1、微信分享未验证成功：

config:fail,Error: invalid signature

已用[微信 JS 接口签名校验工具](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign)验证过

jsapi_ticket 存取方式存在问题

2、缓存access_token方式错误，应该使用redis (搬瓦工服务器仅有512MB内存，运行不起来)
