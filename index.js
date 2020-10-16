const { app, BrowserWindow } = require('electron');

const control = require('./electron-scripts/control.js');
const preferences = require('./electron-scripts/preferences.js');
const server = require('./electron-scripts/server.js');

function createWindow () {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: false,
		fullscreenable: false,
		webPreferences: {
			nodeIntegration: true
		}
	});
	
	win.setMenuBarVisibility(false);
	
	preferences.setContents(win.webContents);
	
	control.loadControl();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		server.killServer();
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
