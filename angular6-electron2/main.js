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

function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    // height: 600,
    height: 450,
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

  const isWindows = isPlatformWindows();
  const faviconFilenameList = isWindows
    ? ['favicon1.4bit.ico', 'favicon2.4bit.ico']
    : ['favicon1_32x32.png', 'favicon2_32x32.png', 'favicon3.32x32.png', 'favicon4.png', 'favicon5.png'];
  // const faviconFilename = isWindows ? 'favicon.ico' : 'favicon1_32x32.png';
  const faviconFilename = getRandomArrayElement(faviconFilenameList);
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
