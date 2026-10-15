'use strict';
'require view';
'require form';
'require fs';

return view.extend({
	load: function () { return fs.list('/etc/sing-box/profiles').catch(function () { return []; }); },
	render: function (files) {
		var m = new form.Map('singbox-lite', _('配置文件'));
		var s = m.section(form.TypedSection, 'singbox', _('配置文件管理'));
		s.addremove = false;
		var o = s.option(form.FileUpload, '_upload', _('上传配置文件'));
		o.root_directory = '/etc/sing-box/profiles'; o.enable_download = true; o.browser = true;
		o.write = function () { return true; };
		var names = (files || []).filter(function (f) { return f.type === 'file'; }).map(function (f) { return f.name; });
		var d = s.option(form.DummyValue, '_files', _('现有文件'));
		d.cfgvalue = function () { return names.length ? names.join('\n') : _('此目录中没有内容'); };
		return m.render();
	}
});
