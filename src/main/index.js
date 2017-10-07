import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
ipcMain.on('encode', (event, typeList, inputPath, outPath) => {
  let name = path.basename(inputPath).split('.')
  let filename = name[0]
  let command_1 = ffmpeg(inputPath)
  .videoCodec('libx264')
  .addOptions(['-qmin 0', '-qmax 50','-minrate 500k', '-maxrate 2000k', '-crf 24'])
  .videoBitrate(2000)
  .size('?x720')
  .audioCodec('aac')
  .audioBitrate(128)
  .output(`${outPath}/${filename}_x264.mp4`)
  .on('error', function(err, stdout, stderr) {
    dialog.showErrorBox('mp4 error', err.message)
  })
  .on('progress', function(progress) {
    console.log('Processing_mp4: ' + Math.ceil(progress.percent) + '% done');
    event.sender.send('mp4-reply', Math.ceil(progress.percent))
  })
  .on('end', function(stdout, stderr) {
    console.log('mp4 Transcoding succeeded !');
    event.sender.send('mp4-done', null)
    typeList.indexOf('webm') !== -1 ? command_2.run() : typeList.indexOf('ogv') !== -1 ? command_3.run() : event.sender.send('All-done', null)
  })

  let command_2 = ffmpeg(inputPath)
  .videoCodec('libvpx-vp9')
  .addOptions(['-qmin 0', '-qmax 50','-minrate 500k', '-maxrate 2000k', '-crf 24','-cpu-used 5'])
  .videoBitrate(2000)
  .size('?x720')
  .audioCodec('libvorbis')
  .audioBitrate(128)
  .output(`${outPath}/${filename}_vp9.webm`)
  .on('error', function(err, stdout, stderr) {
    dialog.showErrorBox('webm error', err.message)
  })
  .on('progress', function(progress) {
    console.log('Processing_webm: ' + Math.ceil(progress.percent) + '% done');
    event.sender.send('webm-reply', Math.ceil(progress.percent))
  })
  .on('end', function(stdout, stderr) {
    console.log('webm Transcoding succeeded !');
    event.sender.send('webm-done', null)
    typeList.indexOf('ogv') !== -1 ? command_3.run() : event.sender.send('All-done', null)
  })

  let command_3 = ffmpeg(inputPath)
  .videoCodec('libtheora')
  .size('?x720')
  .addOptions(['-qscale:v 6'])
  .audioCodec('libvorbis')
  .audioBitrate(128)
  .output(`${outPath}/${filename}_theora.ogv`)
  .on('error', function(err, stdout, stderr) {
    dialog.showErrorBox('ogv error', err.message)
  })
  .on('progress', function(progress) {
    console.log('Processing_ogv: ' + Math.ceil(progress.percent) + '% done');
    event.sender.send('ogv-reply', Math.ceil(progress.percent))
  })
  .on('end', function(stdout, stderr) {
    console.log('ogv Transcoding succeeded !');
    event.sender.send('ogv-done', null)
    event.sender.send('All-done', null)
  })

  ipcMain.once('kill-encode', (event, arg) => {
      console.log('Ffmpeg has been killed');
    command_1.kill()
    command_2.kill()
    command_3.kill()
  })

  if(typeList.indexOf('mp4') !== -1){
    command_1.run()
  }else{
    if(typeList.indexOf('webm') !== -1){
      command_2.run()
    }else{
      if(typeList.indexOf('ogv') !== -1){
        command_3.run()
      }else{
        return null
      }
    }
  }
  // typeList.indexOf('webm') !== -1 ? command_2.run() : null
  // typeList.indexOf('ogv') !== -1 ? command_3.run() : null
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
