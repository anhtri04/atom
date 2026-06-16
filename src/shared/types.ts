export interface ElectronApi {
  getAppVersion: () => Promise<string>
  minimizeWindow: () => Promise<void>
  toggleMaximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronApi
  }
}
