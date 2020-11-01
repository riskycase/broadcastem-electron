const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs').promises;

const control = require('./electron-scripts/control.js');
const preferences = require('./electron-scripts/preferences.js');
const home = require('./electron-scripts/home.js');
const server = require('./electron-scripts/server.js');

function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		minWidth: 360,
		minHeight: 640,
		title: `Broadcast 'em - Electron`,
		resizable: true,
		fullscreenable: true,
		webPreferences: {
			devtools: false,
			nodeIntegration: true,
		},
	});

	win.webContents.on('devtools-opened', win.webContents.closeDevTools);
	win.setMenuBarVisibility(false);

	win.loadFile(path.resolve(__dirname, './electron-views/container.html'))
		.then(
			win.webContents
				.executeJavaScript(`document.body.setAttribute('class', '${
				preferences.store.get('darkMode')
					? 'uk-background-secondary uk-light'
					: 'uk-dark'
			}');
	document.getElementById('banner').setAttribute('class', 'uk-navbar uk-padding-small background-${preferences.store.get(
		'color'
	)}')`)
		)
		.then(() =>
			fs.readFile(
				path.resolve(__dirname, './electron-views/home.html'),
				'utf8'
			)
		)
		.then(html =>
			win.webContents
				.executeJavaScript(`document.getElementById('header').style.display = 'block';
	document.body.style.removeProperty('background-color');
	let script = document.createElement('script');
	script.src = './home.js';
	script.id = 'script';
	document.body.appendChild(script);
	document.getElementById('main').innerHTML = \`${html}\`;`)
		);
	// .then(() => {
	// preferences.setContents(win.webContents);
	// control.loadControl();
	// });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		server.killServer();
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
