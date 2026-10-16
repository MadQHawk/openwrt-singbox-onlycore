include $(TOPDIR)/rules.mk

LUCI_NAME:=luci-app-singbox-lite
LUCI_TITLE:=Minimal sing-box LuCI Controller
LUCI_DEPENDS:=+luci-base +sing-box
LUCI_PKGARCH:=all

PKG_VERSION:=0.1.0
PKG_RELEASE:=1
PKG_LICENSE:=GPL-3.0-only

define Package/luci-app-singbox-lite/postinst
#!/bin/sh
[ -n "$$IPKG_INSTROOT" ] || { mkdir -p /etc/sing-box/profiles; touch /var/log/sing-box-lite.log; /etc/init.d/singbox-lite enable; }
exit 0
endef

include ../../luci.mk
