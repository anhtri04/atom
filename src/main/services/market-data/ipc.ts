import { ipcMain } from 'electron'
import type {
  CandleRequest,
  EventRequest,
  FinancialIndicatorRequest,
  FinancialStatementRequest,
  IndustryPeersRequest,
  IntradayTradeRequest,
  MarketDataService,
  NewsRequest,
  ShareholderRequest,
  SymbolSearchRequest
} from '@shared/market-data'

export const registerMarketDataIpc = (service: MarketDataService): void => {
  ipcMain.handle('market-data:get-provider-status', () => service.getProviderStatus())
  ipcMain.handle('market-data:search-symbols', (_event, request?: SymbolSearchRequest) => service.searchSymbols(request))
  ipcMain.handle('market-data:get-quote', (_event, symbol: string) => service.getQuote(symbol))
  ipcMain.handle('market-data:get-quotes', (_event, symbols: string[]) => service.getQuotes(symbols))
  ipcMain.handle('market-data:get-candles', (_event, request: CandleRequest) => service.getCandles(request))
  ipcMain.handle('market-data:get-intraday-trades', (_event, request: IntradayTradeRequest) => service.getIntradayTrades(request))
  ipcMain.handle('market-data:get-company-profile', (_event, symbol: string) => service.getCompanyProfile(symbol))
  ipcMain.handle('market-data:get-industry-peers', (_event, request: IndustryPeersRequest) => service.getIndustryPeers(request))
  ipcMain.handle('market-data:get-company-news', (_event, request: NewsRequest) => service.getCompanyNews(request))
  ipcMain.handle('market-data:get-corporate-events', (_event, request: EventRequest) => service.getCorporateEvents(request))
  ipcMain.handle('market-data:get-financial-indicators', (_event, request: FinancialIndicatorRequest) => service.getFinancialIndicators(request))
  ipcMain.handle('market-data:get-financial-statement', (_event, request: FinancialStatementRequest) => service.getFinancialStatement(request))
  ipcMain.handle('market-data:get-ownership', (_event, symbol: string) => service.getOwnership(symbol))
  ipcMain.handle('market-data:get-shareholders', (_event, request: ShareholderRequest) => service.getShareholders(request))
}
