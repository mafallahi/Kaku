const path = require('path');
const ShortcutManager = require('electron-localshortcut');
const {
  app,
  BrowserWindow,
  globalShortcut
} = require('electron');

const iconsFolder = path.join(__dirname, 'src', 'public', 'images', 'icons');
const kakuIcon = path.join(iconsFolder, 'kaku.png');

if (require('electron-squirrel-startup')) {
  return;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;
let isWindowLoaded = false;

class Bootup {
  constructor() {
    this._setupBrowserWindow();
  }

  _setupBrowserWindow() {
    // This may help the black screen / option issue
    app.disableHardwareAcceleration();

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      app.quit();
    });

    // This method will be called when Electron has done everything
    // initialization and ready for creating browser windows.
    app.on('ready', () => {

      // Create the browser window.
      mainWindow = new BrowserWindow({
        'icon': kakuIcon,
        'width': 1060,
        'height': 600,
        'minWidth': 1060,
        'minHeight': 600,
        'frame': false
      });

      // and load the index.html of the app.
      mainWindow.loadURL('file://' + __dirname + '/index.html');

      // Emitted when the window is closed.
      mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
      });

      mainWindow.webContents.on('did-finish-load', () => {
        isWindowLoaded = true;
      });

      this._bindShortcuts();
    });
  }

  _bindShortcuts() {
    const localKeys = [
      'Escape'
    ];

    const globalKeys = [
      'MediaNextTrack',
      'MediaPreviousTrack',
      'MediaPlayPause'
    ];

    globalKeys.forEach(key => {
      globalShortcut.register(key, () => {
        this._emitShortcutEvent(mainWindow, isWindowLoaded, key);
      });
    });

    localKeys.forEach(key => {
      ShortcutManager.register(key, () => {
        this._emitShortcutEvent(mainWindow, isWindowLoaded, key);
      });
    });
  }

  _emitShortcutEvent(win, isLoaded, shortcut) {
    if (isLoaded) {
      win.webContents.send('key-' + shortcut);
    }
  }
}

// booting Kaku
new Bootup();
