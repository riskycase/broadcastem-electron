const { BrowserWindow, ipcMain, app, shell } = require('electron');
const path = require('path');
const os = require('os');
const Store = require('electron-store');

const control = require('./control.js');

let contents;

let key = `${os.userInfo().username} ${os.version} ${os.arch()}`;

const store = new Store({
	schema: {
		color: {
			type: 'string',
			pattern: '(light-)?(indigo|blue|green|red)',
			default: 'light-blue'
		},
		darkMode: {
			type: 'boolean',
			default: true
		},
		destination: {
			type: 'string',
			default: app.getPath('downloads')
		},
		list: {
			type: 'string',
			default: ''
		},
		port: {
			type: 'integer',
			default: 3000
		}
	},
	encryptionKey: key
});

module.exports.store = store;

module.exports.setContents = (receivedContents) => {
	contents = receivedContents;
	contents.on('did-finish-load', () =>{
		contents.executeJavaScript(`applyTheme({color: '${store.get('color')}',darkMode: ${store.get('darkMode')}})`);
	});
};

module.exports.getContents = () => contents;

module.exports.loadPreferences = function (receivedContents = contents) {
	contents = receivedContents;
	BrowserWindow.fromWebContents(contents).loadFile(path.resolve(__dirname, '../electron-views/preferences.html'))
	.then(() => {
		contents.send('load', {	color: store.get('color'),darkMode: store.get('darkMode')});
	});
};

ipcMain.on('input', (event, element, object) => {
	if (element === 'cancel') control.loadControl();
	else if (element === 'save') saveOptions(object);
	else if (element === 'github') shell.openExternal('https://github.com/riskycase/file-server');
	else if (element === 'author') shell.openExternal('https://github.com/riskycase');
});

function saveOptions(options) {
	store.set(options);
	control.loadControl();
}
