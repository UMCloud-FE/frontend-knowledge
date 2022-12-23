# A 卷

## 一、A 卷[1.1.1 路由器、交换机安全加固](https://blog.csdn.net/zwf8558/article/details/127581579?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-3-127581579-blog-127624058.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-3-127581579-blog-127624058.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=3)

```bash
enable
config terminal
line vty 0 15
login local
transport input ssh
privilege level 15
exit
hostname sansuo
username Inspc privilege 15 secret P@ssw0rd
ip domain-name sansuo
crypto key generate rsa
       1024
ip ssh version 2
---------------------------------
access-list 110 permit icmp host 192.168.11.1 host 172.16.1.1
access-list 110 deny ip host 192.168.10.1 host 192.168.1.1
interface e0/0
ip access-group 110 in
write Switch_private-config.cfg
write Switch_startup-config.cfg
---------------------------------
access-list 110 deny ip host 192.168.10.1 host 192.168.11.1
access-list 110 permit ip any any
interface e0/1
ip access-group 110 in
write Router_private-config.cfg
write Router_startup-config.cfg
```

## 二、A 卷 B 卷[1.2.2windows 防火墙和远程访问安全配置](https://blog.csdn.net/zwf8558/article/details/127623715?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-127623715-blog-127581579.pc_relevant_multi_platform_whitelistv3&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-127623715-blog-127581579.pc_relevant_multi_platform_whitelistv3&utm_relevant_index=1)

```
1、此电脑 => 属性 => 远程管理 => 添加用户
2、开始 => 服务器管理器 => 本地安全策略
3、power shell => gpedit.msc => 计算机配置 => 模版管理 => window组件 => 远程管理
```

## 三、A 卷[2.1.1 防火墙安全配置](https://blog.csdn.net/zwf8558/article/details/127623588?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-3-127623588-blog-127623715.pc_relevant_recovery_v2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-3-127623588-blog-127623715.pc_relevant_recovery_v2&utm_relevant_index=4)

登录防火墙软件，进行配置

防火墙 => 浮动 +

## 四、A 卷[2.2.1 远程安全访问管理](https://blog.csdn.net/zwf8558/article/details/127624002?spm=1001.2101.3001.6650.4&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-4-127624002-blog-127623715.pc_relevant_recovery_v2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-4-127624002-blog-127623715.pc_relevant_recovery_v2&utm_relevant_index=5)

```bash
# 添加用户
useradd RemoteUser01
# 添加组
groupadd RemoteUserGroup
# 将用户加入组
usermod -g RemoteUserGroup RemoteUser01
# 修改配置
vim /etc/ssh/sshd_config

Port 2222;
PermitRootLogin no;
PermitEmptyPasswords no;
passwordAuthentication yes;
```

## 五、A 卷[3.1.4 网络流量监控](https://blog.csdn.net/zwf8558/article/details/127624058?spm=1001.2101.3001.6650.6&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-6-127624058-blog-127623715.pc_relevant_recovery_v2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-6-127624058-blog-127623715.pc_relevant_recovery_v2&utm_relevant_index=7)

抓包软件的使用

## 六、A 卷[3.2.2 数据库查询日志提取](https://blog.csdn.net/zwf8558/article/details/127624084?spm=1001.2101.3001.6650.7&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-7-127624084-blog-127624058.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EOPENSEARCH%7ERate-7-127624084-blog-127624058.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=7)

```bash
# 登录数据库
mysql -u root -p admin@123

# 查看数据库错误日志路径，读取路径/var/log/mysql/hostname.err
show variables like 'log_error';

# 备份数据库错误日志
cp /var/log/mysql/hostname.err /root/mysql_server_error.log

# 查看日志是否开启和日志位置
show variables like '%general_log%';

# 语句有问题，需要确认
mysqldump --lock-tables=0 -uroot -p admin@123 mysql general_log > /root/mysql_server_log.sql;
```

## [A 卷前三道](http://www.mianhuage.com/1313.html?from_wecom=1)
