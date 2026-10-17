include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-singbox-lite
PKG_VERSION:=0.1.0
PKG_RELEASE:=5
PKG_LICENSE:=GPL-3.0-only

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-singbox-lite
  SECTION:=luci
  CATEGORY:=LuCI
  TITLE:=Minimal sing-box LuCI Controller
  PKGARCH:=all
  EXTRA_DEPENDS:=luci-base (>=0),sing-box (>=0),curl (>=0)
endef

define Package/luci-app-singbox-lite/description
  Minimal LuCI controller for sing-box.
endef

define Package/luci-app-singbox-lite/postinst
#!/bin/sh
[ -n "$$IPKG_INSTROOT" ] || { mkdir -p /etc/sing-box/profiles; touch /var/log/sing-box-lite.log /var/log/sing-box-lite-core.log; /etc/init.d/singbox-lite enable; }
exit 0
endef

define Build/Compile
endef

define Package/luci-app-singbox-lite/install
	$(INSTALL_DIR) $(1)/www
	$(CP) ./htdocs/. $(1)/www/
	$(CP) ./root/. $(1)/
	$(INSTALL_BIN) ./root/etc/init.d/singbox-lite $(1)/etc/init.d/singbox-lite
endef

$(eval $(call BuildPackage,luci-app-singbox-lite))

# call BuildPackage - OpenWrt buildroot signature
