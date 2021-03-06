const { app, BrowserWindow, Menu, shell } = require('electron');

let menu;
let template;
let mainWindow = null;


if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function execOnMainWindow(...args) {
  if (!mainWindow) {
    return initNewWindow(() => {
      mainWindow.webContents.send(...args);
    })
  }
  mainWindow.webContents.send(...args);
}

app.on('open-file', function(event, pathToOpen) {
  event.preventDefault();
  execOnMainWindow('open-filename', pathToOpen);
})

function initNewWindow(callback) {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/electron.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
    if (callback) {
      callback();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }
}


app.on('ready', () => {
  initNewWindow();

  if (process.platform === 'darwin') {
    template = [{
      label: 'Kajero',
      submenu: [{
        label: 'About Kajero',
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide Kajero',
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: 'File',
      submenu: [{
        label: 'New File',
        accelerator: 'Command+N',
        click() {
          execOnMainWindow('new-file');
        }
      }, {
        label: 'Open...',
        accelerator: 'Command+O',
        click() {
          execOnMainWindow('open-file');
        }
      }, {
        type: 'separator'
      }, {
        label: 'Save',
        accelerator: 'Command+S',
        click() {
          execOnMainWindow('save-file');
        }
      }, {
        label: 'Save As...',
        accelerator: 'Shift+Command+S',
        click() {
          execOnMainWindow('save-as-file');
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        role: 'undo'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        role: 'cut'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        role: 'copy'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        role: 'paste'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        role: 'selectall'
      }]
    }, {
      label: 'View',
      submenu: [{
        label: 'Reload',
        accelerator: 'Command+R',
        click(e, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.reload();
          }
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click(e, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click(e, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      }]
    }, {
      label: 'Window',
      role: 'window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        role: 'minimize'
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        role: 'close'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      role: 'help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://github.com/JoelOtter/kajero');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/JoelOtter/kajero/tree/master/docs#readme');
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://github.com/JoelOtter/kajero/issues');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/JoelOtter/kajero/issues');
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O'
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://github.com/JoelOtter/kajero');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/JoelOtter/kajero/tree/master/docs#readme');
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://github.com/JoelOtter/kajero/issues');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/JoelOtter/kajero/issues');
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});
