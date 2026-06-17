import type { MarketDataApi } from './market-data'

export interface ElectronApi {
  getAppVersion: () => Promise<string>
  minimizeWindow: () => Promise<void>
  toggleMaximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  marketData?: MarketDataApi
}

declare global {
  interface Window {
    electron: ElectronApi
  }
}
