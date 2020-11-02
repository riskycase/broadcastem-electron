const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');

const fileEditor = require('./fileEditor.js');
const server = require('./server.js');
const preferences = require('./preferences.js');
let refreshNeeded = false;

//Check for the latest version
require('https').get(
	'https://raw.githubusercontent.com/riskycase/broadcastem-electron/trunk/package.json',
	res => {
		res.setEncoding('utf8');
		let body = '';
		res.on('data', chunk => {
			body += chunk;
		});
		res.on('end', () => {
			if (JSON.parse(body).version === app.getVersion())
				server.options.version = 'latest';
			else server.options.version = 'old';
		});
	}
);

module.exports.refreshNeeded = () => (refreshNeeded = true);

module.exports.loadControl = function () {
	BrowserWindow.fromId(preferences.getId())
		.loadURL(
			`file://${path.resolve(
				__dirname,
				'../electron-views/control.html'
			)}?options=${JSON.stringify(server.options)}&refreshNeeded=${
				refreshNeeded && server.isServerListening() ? 'needed' : 'done'
			}&version=${app.getVersion()}&theme=${JSON.stringify({
				color: preferences.store.get('color'),
				darkMode: preferences.store.get('darkMode'),
			})}`
		)
		.then(() => {
			if (server.isServerListening()) server.serverListening();
		});
};

ipcMain.on('input', (event, element, ...args) => {
	if (element === 'preferences') preferences.loadPreferences();
	else if (element === 'file-select') shareSelector('file');
	else if (element === 'folder-select') shareSelector('folder');
	else if (element === 'list-select') listSelector();
	else if (element === 'dest-select') destSelector();
	else if (element === 'port') portSelector(...args);
	else if (element === 'version' && server.options.version === 'old')
		shell.openExternal('https://github.com/riskycase/file-server/releases');
	else if (element === 'start-server') server.launchServer();
	else if (element === 'kill-server') server.destroyServer();
	else if (element === 'refresh-server') server.refreshServer();
});

ipcMain.on('click', (event, element) => {
	if (element === 'selected-files') fileEditor.loadFileEditor();
});

function shareSelector(type) {
	let properties = ['multiSelections', 'showHiddenFiles', 'dontAddToRecent'];
	let title, label;
	if (type === 'file') {
		properties.push('openFile');
		title = 'Select files to share';
		label = 'Add files';
	} else {
		properties.push('openDirectory');
		title = 'Select folders to share';
		label = 'Add folders';
	}
	dialog
		.showOpenDialog({
			title: title,
			buttonLabel: label,
			properties: properties,
		})
		.then(result => {
			if (!result.canceled) {
				result.filePaths.forEach(pushUnique);
			}
			BrowserWindow.fromId(preferences.getId()).webContents.send(
				'update',
				server.options
			);
		});
}

function pushUnique(item) {
	if (server.options.files.indexOf(item) === -1) {
		server.options.files.push(item);
		server.optionsChanged();
		refreshNeeded = false;
	}
}

function listSelector() {
	dialog
		.showOpenDialog({
			title: 'Select list file',
			buttonLabel: 'Use this list',
			properties: ['openFile', 'showHiddenFiles', 'dontAddToRecent'],
		})
		.then(result => {
			if (!result.canceled) server.options.list = result.filePaths[0];
			else server.options.list = '';
			BrowserWindow.fromId(preferences.getId()).webContents.send(
				'update',
				server.options
			);
		});
}

function destSelector() {
	dialog
		.showOpenDialog({
			title: 'Select folder save to',
			buttonLabel: 'Save here',
			properties: [
				'openDirectory',
				'showHiddenFiles',
				'dontAddToRecent',
				'createDirectory',
				'promptToCreate',
			],
		})
		.then(result => {
			if (!result.canceled) server.options.dest = result.filePaths[0];
			else server.options.dest = app.getPath('downloads');
			BrowserWindow.fromId(preferences.getId()).webContents.send(
				'update',
				server.options
			);
		});
}

function portSelector(port) {
	if (parseInt(port)) server.options.port = port;
}
