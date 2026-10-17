'use strict';
'require view';
'require form';
'require fs';
'require uci';

return view.extend({
	load: function () {
		return Promise.all([
			uci.load('singbox-lite'),
			fs.list('/etc/sing-box/profiles').catch(function () { return []; })
		]);
	},
	render: function (data) {
		var profiles = (data[1] || []).filter(function (f) { return f.type === 'file' && /\.json$/i.test(f.name) && f.name.indexOf('/') < 0; });
		var current = uci.get('singbox-lite', 'main', 'config_file') || '';
		var m = new form.Map('singbox-lite', _('配置文件编辑器'));
		var s = m.section(form.NamedSection, 'main', 'singbox');
		s.addremove = false;
		var editor = s.option(form.DummyValue, '_editor', _('JSON 内容'));
		editor.render = function () {
			var select = E('select', { 'class': 'cbi-input-select' });
			profiles.forEach(function (f) {
				var path = '/etc/sing-box/profiles/' + f.name;
				select.appendChild(E('option', { value: path, selected: path === current }, [ f.name ]));
			});
			var textarea = E('textarea', {
				'class': 'cbi-input-textarea',
				'style': 'width:100%;min-height:32em;font-family:monospace;white-space:pre',
				'wrap': 'off',
				'spellcheck': 'false'
			});
			var status = E('span', { 'style': 'margin-left:1em' });
			var save = E('button', { 'class': 'cbi-button cbi-button-action', 'click': function (ev) {
				ev.preventDefault();
				var path = select.value;
				try { JSON.parse(textarea.value); }
				catch (err) { status.textContent = _('JSON 格式错误：') + err.message; return; }
				fs.write(path, textarea.value).then(function () {
					return fs.exec('/etc/init.d/singbox-lite', ['check', path]);
				}).then(function () {
					status.textContent = _('保存成功，sing-box 配置检查通过。');
				}).catch(function (err) {
					status.textContent = _('文件已保存，但配置检查失败：') + (err && err.message ? err.message : err);
				});
			}}, [ _('保存并检查') ]);
			function loadSelected() {
				if (!select.value) { textarea.value = ''; status.textContent = _('请先上传 JSON 配置文件。'); return; }
				fs.read_direct(select.value).then(function (value) {
					textarea.value = value;
					status.textContent = '';
				}).catch(function (err) {
					textarea.value = '';
					status.textContent = _('读取失败：') + (err && err.message ? err.message : err);
				});
			}
			select.addEventListener('change', loadSelected);
			var box = E('div', {}, [
				E('div', { 'style': 'margin-bottom:1em' }, [ select, ' ', save, status ]),
				textarea
			]);
			if (!profiles.length) {
				select.disabled = true;
				save.disabled = true;
				status.textContent = _('尚无 JSON 配置文件，请先到“配置文件”菜单上传。');
			}
			else loadSelected();
			return box;
		};
		editor.write = function () { return true; };
		return m.render();
	}
});
