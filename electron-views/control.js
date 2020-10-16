const { ipcRenderer } = require('electron');

document.getElementById('preferences').addEventListener('click', () => {
	ipcRenderer.send('input', 'preferences');
});

document.getElementById('file-select').addEventListener('click', () => {
	ipcRenderer.send('input', 'file-select');
});

document.getElementById('folder-select').addEventListener('click', () => {
	ipcRenderer.send('input', 'folder-select');
});

document.getElementById('selected-files').addEventListener('click', () => {
	ipcRenderer.send('click', 'selected-files');
});

document.getElementById('list-select').addEventListener('click', () => {
	ipcRenderer.send('input', 'list-select');
});

document.getElementById('dest-select').addEventListener('click', () => {
	ipcRenderer.send('input', 'dest-select');
});

document.getElementById('port').addEventListener('input', () => {
	ipcRenderer.send('input', 'port', document.getElementById('port').value);
});

document.getElementById('start-server').addEventListener('click', () => {
	ipcRenderer.send('input', 'start-server');
});

document.getElementById('kill-server').addEventListener('click', () => {
	ipcRenderer.send('input', 'kill-server');
});

document.getElementById('refresh-server').addEventListener('click', () => {
	ipcRenderer.send('input', 'refresh-server');
});

document.getElementById('version').addEventListener('click', () => {
	ipcRenderer.send('input', 'version');
});

ipcRenderer.on('status', (event, message) => {
	if(message === 'initiating') {
		document.getElementById('message').innerHTML = 'Creating server configuration';
	}
	else if(message === 'initiated') {
		document.getElementById('message').innerHTML = 'Parsing as HTTP server';
	}
	else if(message === 'created') {
		document.getElementById('message').innerHTML = 'Binding server to specified port';
	}
	else if(message === 'port-err') {
		document.getElementById('message').innerHTML = 'Can\'t use the selected port, try changing port or run with elevated permissions';
	}
	else if(message === 'port-used') {
		document.getElementById('message').innerHTML = 'The selected port is already being used by another process';
	}
	else if(message === 'binded') {
		document.getElementById('message').innerHTML = 'Server ready';
		document.getElementById('start-server').style.display = 'none';
		document.getElementById('kill-server').style.display = 'inline-block';
	}
	else if(message === 'closing') {
		document.getElementById('message').innerHTML = 'Shutting down server';
	}
	else if(message === 'closed') {
		document.getElementById('message').innerHTML = 'Server closed';
		document.getElementById('ip-address').innerHTML = '';
		document.getElementById('start-server').style.display = 'inline-block';
		document.getElementById('kill-server').style.display = 'none';
		document.getElementById('refresh-server').style.display = 'none';
		document.getElementById('server-refresh').style.display = 'none';
	}
});

ipcRenderer.on('address', (event, message) => {
	document.getElementById('ip-address').innerHTML = message.map(value => value.join(': ') + ':' + document.getElementById('port').value).join('<br>');
});

ipcRenderer.on('version', (event, message) => {
	document.getElementById('version').innerHTML = message;
});

ipcRenderer.on('update', (event, message) => {
	parseOptions(message);
});

ipcRenderer.on('refresh', (event, message) => {
	refresh(message);
});

ipcRenderer.on('load', (event, message) => {
	parseOptions(message.options);
	refresh(message.refreshNeeded);
	document.getElementById('version').innerHTML = message.version;
});

function refresh(refreshNeeded) {
	if(refreshNeeded === 'needed') {
		document.getElementById('refresh-server').style.display = 'inline-block';
		document.getElementById('server-refresh').style.display = 'inline-block';
	}
	else if(refreshNeeded === 'done') {
		document.getElementById('refresh-server').style.display = 'none';
		document.getElementById('server-refresh').style.display = 'none';
	}
}

function parseOptions(options) {
	document.getElementById('selected-dest').innerHTML = options.dest;
	if(options.list !== '') document.getElementById('selected-list').innerHTML = options.list;
	else document.getElementById('selected-list').innerHTML = 'No list file selected!';
	document.getElementById('version').innerHTML = options.port;
	if(options.files.length) {
		if(options.files.length === 1) document.getElementById('selected-files').innerHTML = '1 file selected. <u>Click to view/edit.</u>';
		else document.getElementById('selected-files').innerHTML = options.files.length +' files selected. <u>Click to view/edit.</u>';
	}
	else document.getElementById('selected-files').innerHTML = 'No files selected';
	if(options.version === 'latest') document.getElementById('version').setAttribute("uk-tooltip","Latest version");
	else if(options.version === 'old') document.getElementById('version').setAttribute("uk-tooltip","Newer version available, click to view");
	document.getElementById('port').value = options.port;
}
