import type { ProviderStatus } from '../types'
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
  Shareholder,
  ShareholderRequest,
  SymbolSearchRequest
} from '../models'

export interface MarketDataService {
  getProviderStatus(): Promise<ProviderStatus[]>

  searchSymbols(request?: SymbolSearchRequest): Promise<Instrument[]>

  getQuote(symbol: string): Promise<Quote>
  getQuotes(symbols: string[]): Promise<Quote[]>

  getCandles(request: CandleRequest): Promise<Candle[]>
  getIntradayTrades(request: IntradayTradeRequest): Promise<IntradayTrade[]>

  getCompanyProfile(symbol: string): Promise<CompanyProfile>
  getIndustryPeers(request: IndustryPeersRequest): Promise<IndustryPeer[]>

  getCompanyNews(request: NewsRequest): Promise<NewsItem[]>
  getCorporateEvents(request: EventRequest): Promise<CorporateEvent[]>

  getFinancialIndicators(request: FinancialIndicatorRequest): Promise<FinancialIndicator[]>
  getFinancialStatement(request: FinancialStatementRequest): Promise<FinancialStatement>

  getOwnership(symbol: string): Promise<OwnershipSummary>
  getShareholders(request: ShareholderRequest): Promise<Shareholder[]>
}

export interface MarketDataApi extends MarketDataService {}
