const { BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

const control = require('./control.js');
const server = require('./server.js');
const preferences = require('./preferences.js');

ipcMain.on('input', (event, element, ...args) => {
	if (element === 'clear-all') clearList();
	else if (element === 'done') control.loadControl();
});

ipcMain.on('remove', (event, index) => {
	server.options.files.splice(index, 1);
	control.refreshNeeded();
	if(server.options.files.length) createCards();
	else control.loadControl();
});

ipcMain.on('list', (event, index) => {
	shell.openPath(server.options.files[index]);
});

function clearList() {
	server.options.files = [];
	control.refreshNeeded();
	control.loadControl();
}

module.exports.loadFileEditor = function () {
	if(server.options.files.length) {
		BrowserWindow.fromWebContents(preferences.getContents()).loadFile(path.resolve(__dirname, '../electron-views/fileEditor.html'))
		.then(() => {
			createCards();
		});
	}
};

function createCards(value,index) {
	preferences.getContents().send('list', server.options.files.map((value, index) => `
		<div class="uk-card uk-padding-small" style="height: 90px">
			<div class="uk-float uk-float-left" onclick="listClicked(${index})">
				<span class="uk-text-large">${path.basename(value)}</span>
				<br>
				<span class="uk-text-small">${value}</span>
			</div>
			<div class="uk-float uk-float-right" onclick="removeClicked(${index})">
				<a>Remove</a>
			</div>
		</div>
	`));
}