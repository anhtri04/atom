import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronApi } from '@shared/types'
import type {
  CandleRequest,
  EventRequest,
  FinancialIndicatorRequest,
  FinancialStatementRequest,
  IndustryPeersRequest,
  IntradayTradeRequest,
  NewsRequest,
  ShareholderRequest,
  SymbolSearchRequest
} from '@shared/market-data'

const electronApi: ElectronApi = {
  getAppVersion: () => ipcRenderer.invoke('app:get-version') as Promise<string>,
  minimizeWindow: () => ipcRenderer.invoke('window:minimize') as Promise<void>,
  toggleMaximizeWindow: () => ipcRenderer.invoke('window:toggle-maximize') as Promise<void>,
  closeWindow: () => ipcRenderer.invoke('window:close') as Promise<void>,
  marketData: {
    getProviderStatus: () => ipcRenderer.invoke('market-data:get-provider-status'),
    searchSymbols: (request?: SymbolSearchRequest) => ipcRenderer.invoke('market-data:search-symbols', request),
    getQuote: (symbol: string) => ipcRenderer.invoke('market-data:get-quote', symbol),
    getQuotes: (symbols: string[]) => ipcRenderer.invoke('market-data:get-quotes', symbols),
    getCandles: (request: CandleRequest) => ipcRenderer.invoke('market-data:get-candles', request),
    getIntradayTrades: (request: IntradayTradeRequest) => ipcRenderer.invoke('market-data:get-intraday-trades', request),
    getCompanyProfile: (symbol: string) => ipcRenderer.invoke('market-data:get-company-profile', symbol),
    getIndustryPeers: (request: IndustryPeersRequest) => ipcRenderer.invoke('market-data:get-industry-peers', request),
    getCompanyNews: (request: NewsRequest) => ipcRenderer.invoke('market-data:get-company-news', request),
    getCorporateEvents: (request: EventRequest) => ipcRenderer.invoke('market-data:get-corporate-events', request),
    getFinancialIndicators: (request: FinancialIndicatorRequest) => ipcRenderer.invoke('market-data:get-financial-indicators', request),
    getFinancialStatement: (request: FinancialStatementRequest) => ipcRenderer.invoke('market-data:get-financial-statement', request),
    getOwnership: (symbol: string) => ipcRenderer.invoke('market-data:get-ownership', symbol),
    getShareholders: (request: ShareholderRequest) => ipcRenderer.invoke('market-data:get-shareholders', request)
  }
}

contextBridge.exposeInMainWorld('electron', electronApi)
