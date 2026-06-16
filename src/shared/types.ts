export interface ElectronApi {
  getAppVersion: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronApi
  }
}
