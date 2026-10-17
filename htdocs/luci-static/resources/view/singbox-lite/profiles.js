'use strict';
'require view';
'require form';
'require fs';

return view.extend({
	load: function () { return fs.list('/etc/sing-box/profiles').catch(function () { return []; }); },
	render: function (files) {
		var m = new form.Map('singbox-lite', _('配置文件'));
		var s = m.section(form.NamedSection, 'main', 'singbox', _('配置文件管理'));
		var o = s.option(form.FileUpload, '_upload', _('上传 JSON 配置文件'));
		o.root_directory = '/etc/sing-box/profiles';
		o.enable_upload = true;
		o.enable_download = true;
		o.enable_remove = true;
		o.browser = true;
		o.write = function () { return true; };
		o.validate = function (section_id, value) {
			if (value && !/\.json$/i.test(value))
				return _('仅支持 JSON 配置文件（.json）');
			return true;
		};
		var names = (files || []).filter(function (f) { return f.type === 'file' && /\.json$/i.test(f.name); }).map(function (f) { return f.name; });
		var d = s.option(form.DummyValue, '_files', _('现有 JSON 文件'));
		d.cfgvalue = function () { return names.length ? names.join('\n') : _('此目录中没有 JSON 文件'); };
		d.write = function () { return true; };
		return m.render();
	}
});
