'use strict';
'require view';
'require form';
'require uci';
'require fs';

return view.extend({
	load: function () { return Promise.all([uci.load('singbox-lite'), fs.exec('/etc/init.d/singbox-lite', ['running']).catch(function () { return { code: 1 }; })]); },
	render: function (data) {
		var m = new form.Map('singbox-lite', _('sing-box Lite'), _('仅运行 sing-box 内核，不配置透明代理、策略路由或防火墙规则。'));
		var s = m.section(form.NamedSection, 'main', 'singbox', _('状态与运行设置'));
		var o = s.option(form.DummyValue, '_status', _('核心状态'));
		o.cfgvalue = function () { return data[1].code === 0 ? _('运行中') : _('未运行'); };
		o = s.option(form.Button, '_start'); o.inputtitle = _('启动服务'); o.inputstyle = 'apply';
		o.onclick = function () { return fs.exec('/etc/init.d/singbox-lite', ['start']).then(function () { window.location.reload(); }); };
		o = s.option(form.Button, '_stop'); o.inputtitle = _('停止服务'); o.inputstyle = 'reset';
		o.onclick = function () { return fs.exec('/etc/init.d/singbox-lite', ['stop']).then(function () { window.location.reload(); }); };
		o = s.option(form.Flag, 'enabled', _('启用')); o.rmempty = false; o.default = '0';
		o = s.option(form.ListValue, 'config_file', _('选择配置文件')); o.rmempty = false; o.placeholder = _('-- 请选择 --');
		return fs.list('/etc/sing-box/profiles').catch(function () { return []; }).then(function (files) {
			(files || []).forEach(function (f) { if (f.type === 'file' && /\.(json|ya?ml)$/i.test(f.name)) o.value('/etc/sing-box/profiles/' + f.name, f.name); });
			o = s.option(form.Value, 'start_delay', _('启动延迟（秒）')); o.datatype = 'uinteger'; o.default = '0';
			return m.render();
		});
	}
});
