const {app, BrowserWindow, Menu, dialog, ipcMain, shell} = require('electron');
const fs = require('fs')
const path = require('path')

var mainWindow = null;
async function createWindow() {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  await mainWindow.loadFile('src/pages/editor/index.html')

  //mainWindow.webContents.openDevTools()

  createNewFile()

  ipcMain.on('update-content', function(event, data) {

    file.content = data;

  })

}

var file = {}
function createNewFile() {
  file = {
    name: 'novoarquivo.txt',
    content:'',
    saved: false,
    path: app.getPath('documents')+'/novoarquivo.txt'
  }
  mainWindow.webContents.send('set-file', file)
}

function writeFile(filePath) {

  try {
    fs.writeFile(filePath, file.content, function(error) {
      if (error) throw error
    })

    file.path = filePath;
    file.saved = true;
    file.name = path.basename(filePath)

    mainWindow.webContents.send('set-file', file)

  } catch (err) {
    console.log(err)
  }

}

async function saveFileAs() {

  let dialogFile = await dialog.showSaveDialog({
    defaultPath: file.path
  })

  if (dialogFile.canceled) {
    return false
  }

  writeFile(dialogFile.filePath)

}

function saveFile() {

  if (file.saved) {

    return writeFile(file.path);

  } else {

    return saveFileAs();

  }

}

function readFile(filePath) {

  try {

    return fs.readFileSync(filePath, 'utf8');

  } catch (err) {

    return '';

  }

}

async function openFile() {

  let dialogFile = await dialog.showOpenDialog({
    defaultPath: file.path
  })

  if (dialogFile.canceled) {return false};

  file = {

    name: path.basename(dialogFile.filePaths[0]),
    content: readFile(dialogFile.filePaths[0]),
    saved: true,
    path: dialogFile.filePaths[0]

  }

  mainWindow.webContents.send('set-file', file)

}

const templateMenu = [

  {
    label:'Arquivo',
    submenu: [
      {
        label:"Novo",
        accelerator: 'CmdOrCtrl+N',
        click(){
          createNewFile();
        }
      },
      {
        label:"Abrir",
        accelerator: 'CmdOrCtrl+O',
        click() {
          openFile()
        }
      },
      {
        label:"Salvar",
        accelerator: 'CmdOrCtrl+S',
        click(){
          saveFile()
        }
      },
      {
        label:"Salvar Como",
        accelerator: 'CmdOrCtrl+Shift+S',
        click(){
          saveFileAs();
        }
      },
      {
        label:'Fechar',
        role:process.plataform === 'darwin' ? 'close' : 'quit'
      }
    ]
  },
  {
    label:'Editar',
    submenu: [
      {
        label: 'Desfazer',
        role: 'undo'
      },
      {
        label: 'Refazer',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Copiar',
        role: 'copy'
      },
      {
        label: 'Recortar',
        role: 'cut'
      },
      {
        label: 'Colar',
        role: 'paste'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Github',
        click(){
          shell.openExternal('https://www.google.com/')
        }
      }
    ]
  }

]

const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu)

app.whenReady().then(createWindow)


app.on('activate', () => {

  if (BrowserWindow.gerAllWindows().lenght === 0) {

    createWindow();

  }

})
