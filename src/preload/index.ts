import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronApi } from '@shared/types'

const electronApi: ElectronApi = {
  getAppVersion: () => ipcRenderer.invoke('app:get-version') as Promise<string>,
  minimizeWindow: () => ipcRenderer.invoke('window:minimize') as Promise<void>,
  toggleMaximizeWindow: () => ipcRenderer.invoke('window:toggle-maximize') as Promise<void>,
  closeWindow: () => ipcRenderer.invoke('window:close') as Promise<void>
}

contextBridge.exposeInMainWorld('electron', electronApi)
