const http = require('http');
const os = require('os');
const { BrowserWindow } = require('electron');

const preferences = require('./preferences.js');
const core = require('broadcastem-core');

let server;

module.exports.options = options = {
	_files: [],
	get files() {
		return this._files;
	},
	set files(files) {
		this._files = files;
	},
	_list: preferences.store.get('list'),
	get list() {
		return this._list;
	},
	set list(list) {
		this._list = list;
		optionsChanged();
		preferences.store.set('list', list);
	},
	_dest: preferences.store.get('destination'),
	get dest() {
		return this._dest;
	},
	set dest(dest) {
		this._dest = dest;
		optionsChanged();
		preferences.store.set('destination', dest);
	},
	_port: preferences.store.get('port'),
	get port() {
		return this._port;
	},
	set port(port) {
		this._port = port;
		preferences.store.set('port', parseInt(port, 10));
	},
	_version: 'unchecked',
	get version() {
		return this._version;
	},
	set version(version) {
		this._version = version;
	},
};

module.exports.optionsChanged = optionsChanged;

module.exports.killServer = killServer;

module.exports.destroyServer = destroyServer;

module.exports.refreshServer = function () {
	core({
		input: options.files,
		flags: {
			destination: options.dest,
			list: options.list,
		},
		restart: false,
	});
	BrowserWindow.fromId(preferences.getId()).webContents.send(
		'refresh',
		'done'
	);
};

module.exports.launchServer = function () {
	BrowserWindow.fromId(preferences.getId()).webContents.send(
		'status',
		'initiating'
	);
	core({
		input: options.files,
		flags: {
			destination: options.dest,
			list: options.list,
		},
	}).then(createServer);
};

module.exports.isServerListening = function () {
	return server ? server.listening : false;
};

module.exports.serverListening = serverListening;

function optionsChanged() {
	if (server && server.listening)
		BrowserWindow.fromId(preferences.getId()).webContents.send(
			'refresh',
			'needed'
		);
}

function getAddresses() {
	const ni = os.networkInterfaces();
	let addresses = [];
	for (const iface in ni) {
		const ip4 = ni[iface].find(iface => iface.family === 'IPv4');
		if (!ip4.internal) addresses.push([iface, ip4.address]);
	}
	return addresses;
}

function createServer(app) {
	BrowserWindow.fromId(preferences.getId()).webContents.send(
		'status',
		'initiated'
	);
	server = http.createServer(app);
	BrowserWindow.fromId(preferences.getId()).webContents.send(
		'status',
		'created'
	);
	server.listen(options.port);
	server.on('listening', serverListening);
	server.on('error', serverErrored);
}

function serverListening() {
	BrowserWindow.fromId(preferences.getId()).webContents.send(
		'status',
		'binded'
	);
	BrowserWindow.fromId(preferences.getId()).webContents.send(
		'address',
		getAddresses()
	);
}

function serverErrored(err) {
	if (err.code === 'EADDRINUSE')
		BrowserWindow.fromId(preferences.getId()).webContents.send(
			'status',
			'port-used'
		);
	if (err.code === 'EACCES')
		BrowserWindow.fromId(preferences.getId()).webContents.send(
			'status',
			'port-err'
		);
}

function killServer() {
	if (server && server.listening) server.close();
}

function destroyServer() {
	BrowserWindow.fromId(preferences.getId()).webContents.send(
		'status',
		'closing'
	);
	killServer();
	BrowserWindow.fromId(preferences.getId()).webContents.send(
		'status',
		'closed'
	);
}
