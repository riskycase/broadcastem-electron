let color, darkMode;

function applyTheme(theme) {
	if(theme.darkMode) {
		document.body.setAttribute('class', "uk-background-secondary uk-light");
	}
	else {
		document.body.setAttribute('class', "uk-dark");
	}
	document.getElementById('banner').setAttribute('class', 'uk-navbar uk-padding-small background-'+theme.color);
	color = theme.color;
	darkMode = theme.darkMode;
}
