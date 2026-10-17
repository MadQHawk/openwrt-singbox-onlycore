'use strict';
'require view';
'require form';
'require uci';
'require fs';
'require ui';

function notifyError(err) {
	ui.addNotification(null, E('p', {}, [ _('Operation failed: ') + (err && err.message ? err.message : err) ]), 'error');
}

return view.extend({
	load: function () {
		return Promise.all([
			uci.load('singbox-lite'),
			fs.exec('/etc/init.d/singbox-lite', ['running']).catch(function () { return { code: 1 }; }),
			fs.exec('/usr/bin/sing-box', ['version']).catch(function () { return { stdout: _('未安装'), code: 1 }; })
		]);
	},
	render: function (data) {
		var m = new form.Map('singbox-lite', _('sing-box Lite'), _('仅运行 sing-box 内核，不配置透明代理、策略路由或防火墙规则。'));
		var s = m.section(form.NamedSection, 'main', 'singbox', _('状态与运行设置'));
		var o = s.option(form.DummyValue, '_package_version', _('插件版本'));
		o.cfgvalue = function () { return '0.1.0-r4'; };
		o = s.option(form.DummyValue, '_core_version', _('核心版本'));
		o.cfgvalue = function () {
			var match = (data[2].stdout || '').match(/sing-box version\s+([^\s]+)/);
			return match ? match[1] : _('未检测到');
		};
		o = s.option(form.DummyValue, '_status', _('核心状态'));
		o.cfgvalue = function () { return data[1].code === 0 ? _('运行中') : _('未运行'); };

		o = s.option(form.Button, '_reload'); o.inputtitle = _('重载服务'); o.inputstyle = 'apply';
		o.onclick = function () { return fs.exec('/etc/init.d/singbox-lite', ['reload']).then(function () { window.location.reload(); }).catch(notifyError); };
		o = s.option(form.Button, '_restart'); o.inputtitle = _('重启服务'); o.inputstyle = 'reset';
		o.onclick = function () { return fs.exec('/etc/init.d/singbox-lite', ['restart']).then(function () { window.location.reload(); }).catch(notifyError); };
		o = s.option(form.Button, '_update_dashboard'); o.inputtitle = _('更新面板'); o.inputstyle = 'apply';
		o.onclick = function () { return fs.exec('/etc/init.d/singbox-lite', ['dashboard']).then(function () { ui.addNotification(null, E('p', _('面板更新请求已发送。')), 'info'); }).catch(notifyError); };
		o = s.option(form.Button, '_open_dashboard'); o.inputtitle = _('打开面板');
		o.onclick = function () {
			var selected = uci.get('singbox-lite', 'main', 'config_file');
			if (!selected || selected.indexOf('/etc/sing-box/profiles/') !== 0) {
				ui.addNotification(null, E('p', _('请先选择配置文件。')), 'warning');
				return Promise.resolve();
			}
			return fs.read_direct(selected).then(function (raw) {
				var config = JSON.parse(raw);
				var api = config.experimental && config.experimental.clash_api;
				var controller = api && api.external_controller;
				if (!controller) throw new Error(_('所选配置未设置 experimental.clash_api.external_controller'));
				var match = controller.match(/^(?:\[[0-9a-fA-F:]+\]|[^:]+):(\d+)$/);
				if (!match) throw new Error(_('无法识别 Clash API 地址'));
				var host = window.location.hostname;
				var url = 'http://' + host + ':' + match[1] + '/ui/?hostname=' + encodeURIComponent(host) + '&port=' + encodeURIComponent(match[1]);
				if (api.secret) url += '&secret=' + encodeURIComponent(api.secret);
				window.open(url, '_blank', 'noopener');
			}).catch(notifyError);
		};

		o = s.option(form.Flag, 'enabled', _('启用')); o.rmempty = false; o.default = '0';
		o = s.option(form.ListValue, 'config_file', _('选择配置文件')); o.rmempty = false; o.placeholder = _('-- 请选择 --');
		var profileOption = o;
		o = s.option(form.Value, 'start_delay', _('启动延迟（秒）')); o.datatype = 'uinteger'; o.default = '0';
		o = s.option(form.Flag, 'scheduled_restart', _('定时重启')); o.rmempty = false; o.default = '0';
		o = s.option(form.ListValue, 'restart_hour', _('每日重启时间（时）')); o.default = '4';
		for (var h = 0; h < 24; h++) o.value(String(h), (h < 10 ? '0' : '') + h + ':00');
		o = s.option(form.Flag, 'check_config', _('启动前检查配置文件')); o.rmempty = false; o.default = '1';
		o = s.option(form.Button, '_check_config'); o.inputtitle = _('立即检查配置'); o.inputstyle = 'apply';
		o.onclick = function () { return fs.exec('/etc/init.d/singbox-lite', ['check']).then(function () { ui.addNotification(null, E('p', _('配置检查通过。')), 'info'); }).catch(notifyError); };

		return fs.list('/etc/sing-box/profiles').catch(function () { return []; }).then(function (files) {
			(files || []).forEach(function (f) {
				if (f.type === 'file' && /\.json$/i.test(f.name))
					profileOption.value('/etc/sing-box/profiles/' + f.name, f.name);
			});
			return m.render();
		});
	}
});
