# frontend-knowledge

## 开始使用

安装依赖,

```bash
$ npm i
```

启动开发服务,

```bash
$ npm start
```

构建,

```bash
$ npm run docs:build
```

测试,

```bash
$ npm test
```

通过`father`构建,

```bash
$ npm run build
```

## 开发者事项

- 将文档放在 docs 文件夹目录下
- 侧边栏 menu 通过文件夹目录层级自动生成，目前支持两级
- 可使用 dumi 的 md 配置项，例如：

```
---
order: 1
---
```

## 手动部署

1. yarn docs:build
2. yarn deploy

地址： https://umcloud-fe.github.io/frontend-knowledge/

## 自动部署

自动 push 代码到 deploy 分支即可
