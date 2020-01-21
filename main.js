// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog, Menu} = require('electron')
const jetpack = require('fs-jetpack');
const path = require('path')

// process.env.NODE_ENV = 'development'
process.env.NODE_ENV = 'production'


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null
    app.quit()
  })
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // Insert menu
  Menu.setApplicationMenu(mainMenu)
}

const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label:'Set Env var',
        click(){
          process.env.MY_ENV_VAR = 'teste'
          console.log(process.env.MY_ENV_VAR)
        }
      },
      {
        label: 'Create file at home dir',
        click(){
          const homeDir = app.getPath('home')
          const dest = jetpack.dir(homeDir);
          const obj = { greet: "Hello World!" }
          dest.write('file.json', obj)
        }
      },
      {
        label:'Open file dialog',
        click(){
          dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
          }, (files) => {
            if (files) {
              console.log(files)
              document.getElementById('selected-dir').innerHTML = `You selected: ${files}`
              // event.sender.send('selected-directory', files)
            }
          })
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
]
// If OSX, add empty object to menu
// if(process.platform === 'darwin'){
//   mainMenuTemplate.unshift({});
// }

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
