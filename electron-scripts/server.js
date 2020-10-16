const http = require('http');
const os = require('os');

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
	}
};

module.exports.optionsChanged = optionsChanged;

module.exports.killServer = killServer;

module.exports.destroyServer = destroyServer;

module.exports.refreshServer = function () {
	core.init({
		input: options.files,
		flags: {
			destination: options.dest,
			list: options.list,
		},
		restart: false
	});
	preferences.getContents().send('refresh', 'done');
};

module.exports.launchServer = function () {
	preferences.getContents().send('status', 'initiating');
	core.init({
		input: options.files,
		flags: {
			destination: options.dest,
			list: options.list,
		}
	}).then(createServer);
};

module.exports.isServerListening = function () {
	return server ? server.listening : false;
};

module.exports.serverListening = serverListening;

function optionsChanged() {
	if(server && server.listening) preferences.getContents().send('refresh', 'needed');
}

function getAddresses() {
	const ni = os.networkInterfaces();
	let addresses = [];
	for (const iface in ni) {
		const ip4 = ni[iface].find(iface => iface.family === 'IPv4');
		if(!ip4.internal) addresses.push([iface, ip4.address]);
	}
	return addresses;
}

function createServer(app) {
	preferences.getContents().send('status', 'initiated');
	server = http.createServer(app);
	preferences.getContents().send('status', 'created');
	server.listen(options.port);
	server.on('listening', serverListening);
	server.on('error', serverErrored);
}

function serverListening() {
	preferences.getContents().send('status', 'binded');
	preferences.getContents().send('address', getAddresses());
}

function serverErrored(err) {
	if(err.code === 'EADDRINUSE') preferences.getContents().send('status', 'port-used');
	if(err.code === 'EACCES') preferences.getContents().send('status', 'port-err');
}

function killServer() {
	if(server && server.listening) server.close();	
}

function destroyServer() {
	preferences.getContents().send('status', 'closing');	
	killServer();
	preferences.getContents().send('status', 'closed');
}