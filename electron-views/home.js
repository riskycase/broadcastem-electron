const { ipcRenderer } = require('electron');

document.getElementById('send').addEventListener('click', () => {
	ipcRenderer.send('home', 'send');
});

document.getElementById('receive').addEventListener('click', () => {
	ipcRenderer.send('home', 'receive');
});
