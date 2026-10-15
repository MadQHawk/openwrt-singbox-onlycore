'use strict';
'require view';
'require form';
'require fs';

return view.extend({
	load: function () { return fs.read('/var/log/sing-box-lite.log').catch(function () { return ''; }); },
	render: function (log) {
		var m = new form.Map('singbox-lite', _('日志'));
		var s = m.section(form.TypedSection, 'singbox', _('sing-box Lite 日志'));
		s.addremove = false;
		var b = s.option(form.Button, '_clear'); b.inputtitle = _('清空日志'); b.inputstyle = 'reset';
		b.onclick = function () { return fs.write('/var/log/sing-box-lite.log', '').then(function () { window.location.reload(); }); };
		var o = s.option(form.TextValue, '_log'); o.rows = 26; o.wrap = false; o.readonly = true;
		o.cfgvalue = function () { return log || _('暂无日志'); };
		o.write = function () { return true; };
		return m.render();
	}
});
