const { ipcRenderer } = require('electron');

document.getElementById('cancel').addEventListener('click', () => {
	ipcRenderer.send('input', 'cancel');
});

document.getElementById('save').addEventListener('click', () => {
	ipcRenderer.send('input', 'save', {color: color, darkMode: darkMode});
});

document.getElementById('github').addEventListener('click', () => {
	ipcRenderer.send('input', 'github');
});

document.getElementById('author').addEventListener('click', () => {
	ipcRenderer.send('input', 'author');
});

ipcRenderer.on('load', (event, theme) => {
	if(theme.darkMode) {
		document.getElementById('dark-mode-enable').setAttribute('hidden', '');
		document.getElementById('dark-mode-disable').removeAttribute('hidden');
	}
	else {
		document.getElementById('dark-mode-enable').removeAttribute('hidden');
		document.getElementById('dark-mode-disable').setAttribute('hidden', '');
	}
	setTheme(theme.color);
});

UIkit.util.on('#dark-mode-enable', 'show', function () {
	document.body.setAttribute('class', "uk-dark");
	darkMode = false;
});
UIkit.util.on('#dark-mode-disable', 'show', function () {
	document.body.setAttribute('class', "uk-background-secondary uk-light");
	darkMode = true;
});

function setTheme(theme) {
	color = theme;
	document.getElementById('banner').setAttribute('class', 'uk-navbar uk-padding-small background-'+theme);
	document.querySelectorAll('.background-active').forEach((value) => {
		document.getElementById(value.id).setAttribute('class', document.getElementById(value.id).getAttribute('class').replace(/ {0,}background-active {0,}/,''));
	});
	let idOfElement = 'banner-theme-'+theme;
	document.getElementById(idOfElement).setAttribute('class', document.getElementById(idOfElement).getAttribute('class')+' background-active');
}