const { BrowserWindow, ipcMain, app, shell } = require('electron');
const path = require('path');
const os = require('os');
const Store = require('electron-store');

const navigator = require('./navigator.js');

let key = `${os.userInfo().username} ${os.version} ${os.arch()}`;

const store = new Store({
	schema: {
		color: {
			type: 'string',
			pattern: '(light-)?(indigo|blue|green|red)',
			default: 'light-blue',
		},
		darkMode: {
			type: 'boolean',
			default: true,
		},
		destination: {
			type: 'string',
			default: app.getPath('downloads'),
		},
		list: {
			type: 'string',
			default: '',
		},
		port: {
			type: 'integer',
			default: 3000,
		},
	},
	encryptionKey: key,
});

module.exports.store = store;

module.exports.load = () => {
	BrowserWindow.fromId(navigator.getId()).webContents.send('load', {
		darkMode: store.get('darkMode'),
		color: store.get('color'),
	});
};
