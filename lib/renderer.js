'use strict'

const $ = require('jquery')
const electron = require('electron')
const marked = require('marked')

const clipboard = electron.clipboard
const ipc = electron.ipcRenderer
const remote = electron.remote
const shell = electron.shell

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

$saveFileButton.on('click', _ => {
  mainProcess.saveFile($markdownView.val())
})

$copyHtmlButton.on('click', _ => {
  clipboard.writeText($htmlView.html())
})

$(document).on('click', 'a[href^="http"]', evt => {
  evt.preventDefault()
  shell.openExternal(this.href)
})

function renderMarkdownToHtml(markdown) {
  $htmlView.html(marked(markdown))
}
