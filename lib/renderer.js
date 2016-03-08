'use strict'

const $ = require('jquery')
const electron = require('electron')
const marked = require('marked')

const ipc = electron.ipcRenderer

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

function renderMarkdownToHtml(markdown) {
  $htmlView.html(marked(markdown))
}
