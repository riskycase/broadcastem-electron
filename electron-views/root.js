const { ipcRenderer } = require('electron');

let script, main;

document.getElementById('back').addEventListener('click', () => {
	ipcRenderer.send('navigator', 'back');
});

document.getElementById('preferences').addEventListener('click', () => {
	ipcRenderer.send('navigator', 'preferences');
});
