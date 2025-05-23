import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import fs from 'node:fs';
import convert from 'heic-convert';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

async function convertHeicToJpeg(inputFolder: string, outputFolder: string) {
  const files = await fs.promises.readdir(inputFolder);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const { name } = path.parse(file);
    const inputPath = path.join(inputFolder, file);

    if (ext === '.heic') {
      // read HEIC, convert to JPEG
      const outputPath = path.join(outputFolder, `${name}.jpg`);
      const inputBuffer = await fs.promises.readFile(inputPath);
      const outputBuffer = await convert({
        buffer: new Uint8Array(inputBuffer),
        format: 'JPEG',
        quality: 1,
      });
      await fs.promises.writeFile(outputPath, Buffer.from(outputBuffer));
      console.log(`Converted HEIC to JPG: ${file}`);
    } else {
      const outputPath = path.join(outputFolder, file);
      await fs.promises.copyFile(inputPath, outputPath);
      console.log(`Copied: ${file}`);
    }
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: app.getPath('home') 
  });
  return canceled ? null : filePaths[0];
});

ipcMain.handle(
  'convert:heicToJpeg',
  async (event, inputFolder: string, outputFolder: string) => {
    await convertHeicToJpeg(inputFolder, outputFolder);
  }
);
