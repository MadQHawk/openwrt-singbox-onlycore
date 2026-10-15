include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-singbox-lite
PKG_VERSION:=0.1.0
PKG_RELEASE:=1
PKG_LICENSE:=GPL-3.0-only

LUCI_TITLE:=Minimal sing-box LuCI Controller
LUCI_DEPENDS:=+luci-base +sing-box
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) $(CURDIR)/root/etc/init.d/singbox-lite $(1)/etc/init.d/singbox-lite
endef

define Package/luci-app-singbox-lite/postinst
#!/bin/sh
[ -n "$$IPKG_INSTROOT" ] || { mkdir -p /etc/sing-box/profiles; touch /var/log/sing-box-lite.log; /etc/init.d/singbox-lite enable; }
exit 0
endef
