const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let navigationStack = [];
let id;

ipcMain.on('navigator', (event, element) => {
	if (element === 'back') {
		navigationStack.pop();
		load(navigationStack.pop());
	} else if (element === 'preferences') load('preferences');
});

function load(page) {
	return new Promise((resolve, reject) => {
		navigationStack.push(page);
		const window = BrowserWindow.fromId(id);
		fs.readFile(
			path.resolve(__dirname, `../electron-views/${page}.html`),
			'utf8'
		)
			.then(html =>
				window.webContents
					.executeJavaScript(`main = document.createElement('div');
	main.innerHTML = \`${html}\`;
	main.setAttribute('class', 'uk-card uk-padding-small uk-height-expand');
	main.setAttribute('style', 'height: calc(100vh - 56px)');
	main.id = 'main';
	document.getElementById('main').remove();
	document.getElementById('header').insertAdjacentElement("afterend", main);
	document.getElementById('script').remove();
	script = document.createElement('script');
	script.id = 'script';
	script.src = './${page}.js';
	document.body.appendChild(script);
	0;`)
			)
			.then(require(`./${page}.js`).load())
			.then(resolve);
	});
}

module.exports.getId = () => id;

module.exports.load = load;

module.exports.initialise = key => (id = key);
