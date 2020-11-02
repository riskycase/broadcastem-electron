const { ipcMain } = require('electron');

const navigator = require('./navigator.js');

ipcMain.on('home', (event, element) => {
	if (element === 'send') navigator.load('control');
});

module.exports.load = () => {};
