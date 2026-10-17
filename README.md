# OpenWrt sing-box Core Only

This repository contains an independently maintained, core-only adaptation of [OpenWrt Momo](https://github.com/nikkinikki-org/OpenWrt-momo).

It keeps Momo's LuCI status, profile upload/editor, logs, configuration checks, service controls, dashboard controls, and scheduled restart. Transparent proxy and mixin pages are removed. Core-only mode is enabled by default and enforced by the service.

The package targets OpenWrt 25.12.5 x86_64 and depends on the device's existing sing-box package. This source is based on Momo 1.2.2 / 2026.10.14.

Momo is licensed under GPL-3.0. See [LICENSE](LICENSE) and retain upstream copyright notices.
