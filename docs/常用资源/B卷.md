# B 卷

## 一、B 卷 1.1.3 部署入侵检测/防御系统

打开火狐浏览器，登录管理系统，根据题目操作

## 二、A 卷 B 卷[1.2.2windows 防火墙和远程访问安全配置](https://blog.csdn.net/zwf8558/article/details/127623715?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-127623715-blog-127581579.pc_relevant_multi_platform_whitelistv3&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-127623715-blog-127581579.pc_relevant_multi_platform_whitelistv3&utm_relevant_index=1)

```
1、此电脑 => 属性 => 远程管理 => 添加用户
2、开始 => 服务器管理器 => 本地安全策略
3、power shell => gpedit.msc => 计算机配置 => 模版管理 => window组件 => 远程管理
```

## 三、B 卷 2.1.3 网络安全日志配置

opnsense 的操作

## 四、B 卷 2.2.3Linux 系统日志管理

放弃

## 五、A 卷 B 卷[3.1.4 网络流量监控](https://blog.csdn.net/zwf8558/article/details/127624058?spm=1001.2101.3001.6650.6&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-6-127624058-blog-127623715.pc_relevant_recovery_v2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-6-127624058-blog-127623715.pc_relevant_recovery_v2&utm_relevant_index=7)

Wireshark 抓包软件的使用，按流程使用

## 六、B 卷 3.2.1 提取 web 日志

```bash
# 1、修改nginx配置
vim /etc/nginx/nginx.conf
log_format main '$remote_addr - "$http_user_agent"'
access_log /root/access.log

# 2、提取异常日志
cat /root/access.log | awk '$3' | grep MSJ/1.0 > /root/danger.log
```
