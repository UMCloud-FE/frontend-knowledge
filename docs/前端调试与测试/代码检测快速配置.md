# 代码检测快速配置

1、安装依赖

```
## 安装husky、prettier、eslint
yarn add -D husky prettier eslint

yarn add pinst -D # ONLY if your package is not private
```

2、启动 husky，配置自动安装

```
## 启动，并配置在安装依赖时，自动配置提交检测
yarn husky install

npm pkg set scripts.prepare="husky install"
```

3、配置检测范围和检测指令

```js
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [ // 根据自己的文件类型写
      "eslint --fix",
      "yarn prettier"
    ]
}
```

4、创建一个 Hooks，执行在 pre-commit 阶段

```
npx husky add .husky/pre-commit "yarn lint-staged --allow-empty"
git add .husky/pre-commit
```

5、卸载 husky

```
# 如果需要
yarn remove husky && git config --unset core.hooksPath
```

6、注意点

- 如果是 ts 文件，需要安装对应的声明文件`@typescript-eslint/eslint-plugin,@typescript-eslint/parser`，会自动提示安装
- 要求 **husky 4** 版本以上
- prettier 和 eslint 都有对应的配置文件，eslint 配置文件可以执行`npm init @eslint/config`自动生成
- 测试：直接修改代码格式，正常执行`git add . && git commit -m "feat: change code"`就可以看到效果了
