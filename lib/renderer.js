'use strict'

const $ = require('jquery')
const electron = require('electron')
const marked = require('marked')

const ipc = electron.ipcRenderer
const remote = electron.remote

const mainProcess = remote.require('./main')

const $markdownView = $('.raw-markdown')
const $htmlView = $('.rendered-html')
const $openFileButton = $('#open-file')
const $saveFileButton = $('#save-file')
const $copyHtmlButton = $('#copy-html')

ipc.on('file-opened', (event, file, content) => {
  $markdownView.text(content)
  renderMarkdownToHtml(content)
})

$markdownView.on('keyup', _ => {
  renderMarkdownToHtml($markdownView.val())
})

$openFileButton.on('click', _ => {
  mainProcess.openFile()
})

function renderMarkdownToHtml(markdown) {
  $htmlView.html(marked(markdown))
}
