const { ipcRenderer } = require('electron');

function listClicked(index) {
	ipcRenderer.send('list', index);
}

function removeClicked(index) {
	ipcRenderer.send('remove', index);
}

ipcRenderer.on('list', (event, message) => {
	document.getElementById('list').innerHTML = message.join('\n');
});

document.getElementById('clear-all').addEventListener('click', () => {
	ipcRenderer.send('input', 'clear-all');
});

document.getElementById('done').addEventListener('click', () => {
	ipcRenderer.send('input', 'done');
});