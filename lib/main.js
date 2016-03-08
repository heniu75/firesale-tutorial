'use strict'

const electron = require('electron')
const fs = require('fs')

const generateTemplate = require('./menu-template')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const Menu = electron.Menu

let mainWindow = null

app.on('ready', _ => {
  console.log('The app is ready')

  mainWindow = new BrowserWindow({
    width: 1200
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.on('closed', _ => {
    mainWindow = null
  })

  mainWindow.webContents.openDevTools()

  // TODO: fix quit, save with contents - main calls renderer, calls save
  const menuContents = Menu.buildFromTemplate(generateTemplate(app, { openFile, saveFile }))
  Menu.setApplicationMenu(menuContents)
})

app.on('open-file', (evt, file) => {
  app.addRecentDocument(file)
  fs.readFile(file, { encoding: 'utf8' }, (err, content) => {
    mainWindow.webContents.send('file-opened', file, content)
  })
})

const openFile = _ => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }
    ]
  }, files => {
    if (!files) return

    const file = files[0]

    app.addRecentDocument(file)

    fs.readFile(file, { encoding: 'utf8' }, (err, content) => {
      mainWindow.webContents.send('file-opened', file, content)
    })
  })
}

const saveFile = content => {
  console.log("content", content)
  dialog.showSaveDialog(mainWindow, {
    title: 'Save Markdown',
    defaultPath: app.getPath('desktop'),
    filters: [
      { name: 'Markdown files', extensions: ['md'] }
    ]
  }, fileName => {
    if (!fileName) return

    fs.writeFile(fileName, content)
  })
}

exports.openFile = openFile
exports.saveFile = saveFile
