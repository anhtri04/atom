import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronApi } from '@shared/types'

const electronApi: ElectronApi = {
  getAppVersion: () => ipcRenderer.invoke('app:get-version') as Promise<string>
}

contextBridge.exposeInMainWorld('electron', electronApi)
