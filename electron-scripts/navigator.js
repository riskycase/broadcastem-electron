const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let previous,
	current = 'home';
let id;

module.exports.load = page => {
	return new Promise((resolve, reject) => {
		require(`./${page}.js`);
		previous = current;
		current = page;
		const window = BrowserWindow.fromId(id);
		fs.readFile(
			path.resolve(__dirname, `../electron-views/${page}.html`),
			'utf8'
		)
			.then(html =>
				window.webContents
					.executeJavaScript(`document.getElementById('header').style.display = 'block';
	document.body.style.removeProperty('background-color');
	let script = document.createElement('script');
	script.src = './${page}.js';
	script.id = 'script';
	document.body.appendChild(script);
	document.getElementById('main').innerHTML = \`${html}\`;`)
			)
			.then(resolve);
	});
};

module.exports.initialise = key => (id = key);
