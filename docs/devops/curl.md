# Curl 用法简单小结

## 一、Curl 如何使用？

使用 curl 指令来做 web 服务器的请求，熟练使用可以帮助你减少对 postman 等软件的依赖

```sh
# 这就是一个简单的get请求
curl https://www.baidu.com
```

![curl](/frontend-knowledge/images/curl-https.png)

## 二、Curl post 请求接口，如果传递动态参数？

curl 有很多参数，可以传递不同的参数，比如下面的请求

```sh
curl -X 'POST' -b 'foo-bar' -H 'remoteUser: "san.zhang"' http://api.test.com -d '{"Id": 123}'
```

- -X 请求方法
- -H 请求头
- -d body 请求体
- -b Cookie

我们请求的数据常常不是固定的，比如在 CI 中运行时：

```sh
Request_URL='http://api.cn'
GITLAB_USER_NAME='san.zhang'
ResourceId=123

curl "$Request_URL" -X 'POST' -H 'remoteUser: '"$GITLAB_USER_NAME"'' -H 'Content-Type: application/json' -d '{"Action": "UpdateResource", "id": "'"$ResourceId"'", "status": "2"}'
```

**在 curl 请求中，单引号中的内容表示字符串，变量需要"${}"来处理，否则可能不生效**

## 三、Curl 请求返回的数据如何获取？

```sh
curl -X 'POST' -b 'foo-bar' -H 'remoteUser: "san.zhang"' http://api.test.com -d '{"Id": 123}' > response.log
```

接口请求后，一般会有返回值，那么在 Curl 后，想要保存下来请求结果，可以通过在指令后添加`>response.log`,写入 response.log

更多参考：https://www.ruanyifeng.com/blog/2019/09/curl-reference.html
