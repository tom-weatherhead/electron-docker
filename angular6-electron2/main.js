const os = require('os');
const { app, BrowserWindow, ipcMain, Tray } = require('electron');

let win;

ipcMain.on('consoleLog', function(event, data) {
	console.log(data);
});

ipcMain.on('consoleError', function(event, data) {
	console.error(data);
});

function isPlatformWindows () {
  const platform = os.platform();

  //console.log('platform is', platform);

  //const isWindows = platform === 'win32';
  return platform === 'win32';
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    // height: 600,
    height: 500,
    backgroundColor: '#ffffff',
    // icon: `file://${__dirname}/dist/assets/logo.png`
    icon: 'assets/logo.png'
  });

  // win.loadURL(`file://${__dirname}/dist/index.html`);
	win.loadFile('dist/index.html');

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  });

  // const platform = os.platform();

  // console.log('platform is', platform);

  // const isWindows = platform === 'win32';
  const isWindows = isPlatformWindows();
  const faviconFilename = isWindows ? 'favicon.ico' : 'favicon1_32x32.png';
	//const tray = new Tray('./assets/favicon.ico'); // Windows 10
	//const tray = new Tray('./assets/favicon1_32x32.png'); // Ubuntu 18.04
	const tray = new Tray('./dist/assets/' + faviconFilename);

	tray.on('click', () => {
		win.isVisible() ? win.hide() : win.show();
	});
}

// Create window on electron intialization
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // macOS specific close process
  // if (win === null) {
  if (!win) {
    createWindow();
  }
});
