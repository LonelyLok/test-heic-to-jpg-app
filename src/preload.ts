// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('backendAPI', {
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
    convertHeicToJpeg: (inputFolder: string, outputFolder: string) => ipcRenderer.invoke('convert:heicToJpeg', inputFolder, outputFolder)
})