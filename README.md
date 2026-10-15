# luci-app-singbox-lite

极简 OpenWrt LuCI 插件，仅管理 sing-box 内核，包含“插件配置”“配置文件”“日志”三个页面，不实现透明代理、防火墙或策略路由功能。

## 使用

安装 `sing-box` 与本插件。上传配置至 `/etc/sing-box/profiles/`，然后在 LuCI 的“服务 → sing-box Lite”选择配置并启用。服务通过 procd 管理，并在启动前执行 `sing-box check`。

配置：`/etc/config/singbox-lite`  
日志：`/var/log/sing-box-lite.log`  
服务：`/etc/init.d/singbox-lite`

当前是源码初版，尚未针对具体 OpenWrt SDK 编译验证。
