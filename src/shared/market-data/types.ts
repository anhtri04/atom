export type MarketDataProviderId = 'kbs' | 'ssi'

export type Market = 'VN'

export type Exchange = 'HOSE' | 'HNX' | 'UPCOM' | 'DERIVATIVES' | 'UNKNOWN'

export type AssetType =
  | 'stock'
  | 'index'
  | 'etf'
  | 'fund'
  | 'bond'
  | 'covered_warrant'
  | 'derivative'
  | 'unknown'

export type CandleInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '1d' | '1w' | '1M'

export type Language = 'vi' | 'en'

export interface LanguageOptions {
  language?: Language
}

export interface PaginationRequest {
  page?: number
  pageSize?: number
}

export interface DateRangeRequest {
  from?: string
  to?: string
}

export interface ProviderResult<T> {
  provider: MarketDataProviderId
  source: string
  fetchedAt: string
  data: T
  warnings?: string[]
}

export interface ProviderStatus {
  provider: MarketDataProviderId
  name: string
  available: boolean
  checkedAt: string
  latencyMs?: number
  message?: string
}

export interface MarketDataProviderCapabilities {
  symbols: boolean
  quotes: boolean
  historicalCandles: CandleInterval[]
  intradayTrades: boolean
  companyProfile: boolean
  companyNews: boolean
  corporateEvents: boolean
  financialStatements: boolean
  financialIndicators: boolean
  ownership: boolean
  industryPeers: boolean
}

export type MarketDataRouteKey =
  | 'symbols'
  | 'quotes'
  | 'candles'
  | 'intradayTrades'
  | 'companyProfile'
  | 'news'
  | 'events'
  | 'financialStatements'
  | 'financialIndicators'
  | 'ownership'
  | 'industryPeers'

export type MarketDataRoutes = Record<MarketDataRouteKey, MarketDataProviderId[]>
