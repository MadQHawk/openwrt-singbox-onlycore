'use strict';
'require view';
'require form';
'require fs';

return view.extend({
	load: function () {
		return Promise.all([
			fs.read('/var/log/sing-box-lite.log').catch(function () { return ''; }),
			fs.read('/var/log/sing-box-lite-core.log').catch(function () { return ''; })
		]);
	},
	render: function (logs) {
		var m = new form.Map('singbox-lite', _('日志'));
		var s = m.section(form.NamedSection, 'main', 'singbox', _('sing-box Lite 日志'));
		var b = s.option(form.Button, '_clear'); b.inputtitle = _('清空日志'); b.inputstyle = 'reset';
		b.onclick = function () {
			return Promise.all([
				fs.write('/var/log/sing-box-lite.log', ''),
				fs.write('/var/log/sing-box-lite-core.log', '')
			]).then(function () { window.location.reload(); });
		};
		var o = s.option(form.TextValue, '_app_log', _('服务日志')); o.rows = 12; o.wrap = false; o.readonly = true;
		o.cfgvalue = function () { return logs[0] || _('暂无服务日志'); };
		o.write = function () { return true; };
		o = s.option(form.TextValue, '_core_log', _('sing-box 核心日志')); o.rows = 24; o.wrap = false; o.readonly = true;
		o.cfgvalue = function () { return logs[1] || _('暂无核心日志。若配置中未启用 log.level，sing-box 可能不会输出常规运行日志。'); };
		o.write = function () { return true; };
		return m.render();
	}
});
