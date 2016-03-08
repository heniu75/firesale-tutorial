'use strict'

const electron = require('electron')
const fs = require('fs')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog

let mainWindow = null

app.on('ready', _ => {
  console.log('The app is ready')

  mainWindow = new BrowserWindow()

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  openFile()

  mainWindow.on('closed', _ => {
    mainWindow = null
  })

  mainWindow.webContents.openDevTools()
})

const openFile = _ => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }
    ]
  }, files => {
    if (!files) { return }

    const file = files[0]
    fs.readFile(file, { encoding: 'utf8' }, (err, content) => {
      mainWindow.webContents.send('file-opened', file, content)
    })
  })
}
