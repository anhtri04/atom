import type { MarketDataProviderCapabilities, MarketDataProviderId, ProviderResult } from '../types'
import type {
  Candle,
  CandleRequest,
  CompanyProfile,
  CorporateEvent,
  EventRequest,
  FinancialIndicator,
  FinancialIndicatorRequest,
  FinancialStatement,
  FinancialStatementRequest,
  IndustryPeer,
  IndustryPeersRequest,
  Instrument,
  IntradayTrade,
  IntradayTradeRequest,
  NewsItem,
  NewsRequest,
  OwnershipSummary,
  Quote,
  RelatedCompaniesRequest,
  Shareholder,
  ShareholderRequest,
  SymbolSearchRequest
} from '../models'
import type { Exchange, LanguageOptions } from '../types'

export interface MarketDataProvider {
  id: MarketDataProviderId
  name: string
  source: string
  capabilities: MarketDataProviderCapabilities

  searchSymbols?(request?: SymbolSearchRequest): Promise<ProviderResult<Instrument[]>>
  getSymbolsByExchange?(exchange: Exchange): Promise<ProviderResult<Instrument[]>>
  getSymbolsByGroup?(groupCode: string): Promise<ProviderResult<string[]>>

  getQuotes?(symbols: string[]): Promise<ProviderResult<Quote[]>>
  getCandles?(request: CandleRequest): Promise<ProviderResult<Candle[]>>
  getIntradayTrades?(request: IntradayTradeRequest): Promise<ProviderResult<IntradayTrade[]>>

  getCompanyProfile?(symbol: string, options?: LanguageOptions): Promise<ProviderResult<CompanyProfile>>
  getRelatedCompanies?(request: RelatedCompaniesRequest): Promise<ProviderResult<CompanyProfile['subsidiaries']>>
  getIndustryPeers?(request: IndustryPeersRequest): Promise<ProviderResult<IndustryPeer[]>>

  getCompanyNews?(request: NewsRequest): Promise<ProviderResult<NewsItem[]>>
  getCorporateEvents?(request: EventRequest): Promise<ProviderResult<CorporateEvent[]>>

  getFinancialStatements?(request: FinancialStatementRequest): Promise<ProviderResult<FinancialStatement>>
  getFinancialIndicators?(request: FinancialIndicatorRequest): Promise<ProviderResult<FinancialIndicator[]>>

  getOwnership?(symbol: string): Promise<ProviderResult<OwnershipSummary>>
  getShareholders?(request: ShareholderRequest): Promise<ProviderResult<Shareholder[]>>
}
