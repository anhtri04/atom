import type { MarketDataProviderCapabilities, MarketDataRoutes } from './types'

export const KBS_CAPABILITIES: MarketDataProviderCapabilities = {
  symbols: true,
  quotes: true,
  historicalCandles: ['1m', '5m', '15m', '30m', '1h', '1d', '1w', '1M'],
  intradayTrades: true,
  companyProfile: true,
  companyNews: true,
  corporateEvents: true,
  financialStatements: true,
  financialIndicators: true,
  ownership: false,
  industryPeers: false
}

export const SSI_CAPABILITIES: MarketDataProviderCapabilities = {
  symbols: false,
  quotes: false,
  historicalCandles: ['1d'],
  intradayTrades: false,
  companyProfile: true,
  companyNews: true,
  corporateEvents: true,
  financialStatements: false,
  financialIndicators: true,
  ownership: true,
  industryPeers: true
}

export const DEFAULT_MARKET_DATA_ROUTES: MarketDataRoutes = {
  symbols: ['kbs'],
  quotes: ['kbs'],
  candles: ['kbs', 'ssi'],
  intradayTrades: ['kbs'],
  companyProfile: ['ssi', 'kbs'],
  news: ['ssi', 'kbs'],
  events: ['ssi', 'kbs'],
  financialStatements: ['kbs'],
  financialIndicators: ['ssi', 'kbs'],
  ownership: ['ssi'],
  industryPeers: ['ssi']
}
