import { app, BrowserWindow, ipcMain } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
// ffmpeg.setFfmpegPath('/ffmpeg/bin/ffmpeg.exe')
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
  let command_1 = ffmpeg(inputPath).videoCodec('libx264').output('outputfile.mp4')
  .on('error', function(err, stdout, stderr) {
    console.log('Cannot process video: ' + err.message);
  })
  .on('progress', function(progress) {
    console.log('Processing_mp4: ' + Math.ceil(progress.percent) + '% done');
    event.sender.send('mp4-reply', Math.ceil(progress.percent))
  })
  .on('end', function(stdout, stderr) {
    console.log('Transcoding succeeded !');
    event.sender.send('done-reply', null)
  })

  let command_2 = ffmpeg(inputPath).videoCodec('libvpx-vp9').output('outputfile.webm')
  .on('error', function(err, stdout, stderr) {
    console.log('Cannot process video: ' + err.message);
  })
  .on('progress', function(progress) {
    console.log('Processing_webm: ' + Math.ceil(progress.percent) + '% done');
    event.sender.send('webm-reply', Math.ceil(progress.percent))
  })
  .on('end', function(stdout, stderr) {
    console.log('Transcoding succeeded !');
    event.sender.send('done-reply', null)
  })
  
  let command_3 = ffmpeg(inputPath).videoCodec('libtheora').output('outputfile.ogv')
  .on('error', function(err, stdout, stderr) {
    console.log('Cannot process video: ' + err.message);
  })
  .on('progress', function(progress) {
    console.log('Processing_ogv: ' + Math.ceil(progress.percent) + '% done');
    event.sender.send('ogv-reply', Math.ceil(progress.percent))
  })
  .on('end', function(stdout, stderr) {
    console.log('Transcoding succeeded !');
    event.sender.send('done-reply', null)
  })
  
  ipcMain.on('kill-encode', (event, arg) => {
      console.log('Ffmpeg has been killed');
    command_1.kill()  
    command_2.kill()  
    command_3.kill()  
  })
  typeList.indexOf('mp4') !== -1 ? command_1.run() : null
  typeList.indexOf('webm') !== -1 ? command_2.run() : null
  typeList.indexOf('ogv') !== -1 ? command_3.run() : null
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
