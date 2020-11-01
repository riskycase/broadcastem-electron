const { ipcMain } = require('electron');

ipcMain.on('home', (event, element) => {
	console.log(element);
});
