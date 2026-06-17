import {
  DEFAULT_MARKET_DATA_ROUTES,
  MarketDataError,
  type Candle,
  type CandleRequest,
  type CompanyProfile,
  type CorporateEvent,
  type EventRequest,
  type FinancialIndicator,
  type FinancialIndicatorRequest,
  type FinancialStatement,
  type FinancialStatementRequest,
  type IndustryPeer,
  type IndustryPeersRequest,
  type Instrument,
  type IntradayTrade,
  type IntradayTradeRequest,
  type MarketDataProvider,
  type MarketDataProviderId,
  type MarketDataRouteKey,
  type MarketDataRoutes,
  type MarketDataService,
  type NewsItem,
  type NewsRequest,
  type OwnershipSummary,
  type ProviderStatus,
  type Quote,
  type Shareholder,
  type ShareholderRequest,
  type SymbolSearchRequest
} from '@shared/market-data'
import { MarketDataProviderRegistry } from './MarketDataProviderRegistry'

type ProviderCall<T> = (provider: MarketDataProvider) => Promise<T> | undefined

export class MarketDataServiceImpl implements MarketDataService {
  constructor(
    private readonly registry: MarketDataProviderRegistry,
    private readonly routes: MarketDataRoutes = DEFAULT_MARKET_DATA_ROUTES
  ) {}

  async getProviderStatus(): Promise<ProviderStatus[]> {
    return this.registry.list().map((provider) => ({
      provider: provider.id,
      name: provider.name,
      available: true,
      checkedAt: new Date().toISOString(),
      message: provider.source
    }))
  }

  async searchSymbols(request?: SymbolSearchRequest): Promise<Instrument[]> {
    return this.tryProviders('symbols', (provider) => provider.searchSymbols?.(request).then((result) => result.data))
  }

  async getQuote(symbol: string): Promise<Quote> {
    const quotes = await this.getQuotes([symbol])
    const quote = quotes[0]

    if (!quote) {
      throw new MarketDataError('SYMBOL_NOT_FOUND', `No quote returned for ${symbol}`)
    }

    return quote
  }

  async getQuotes(symbols: string[]): Promise<Quote[]> {
    return this.tryProviders('quotes', (provider) => provider.getQuotes?.(symbols).then((result) => result.data))
  }

  async getCandles(request: CandleRequest): Promise<Candle[]> {
    return this.tryProviders('candles', (provider) => provider.getCandles?.(request).then((result) => result.data))
  }

  async getIntradayTrades(request: IntradayTradeRequest): Promise<IntradayTrade[]> {
    return this.tryProviders('intradayTrades', (provider) => provider.getIntradayTrades?.(request).then((result) => result.data))
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    return this.tryProviders('companyProfile', (provider) => provider.getCompanyProfile?.(symbol).then((result) => result.data))
  }

  async getIndustryPeers(request: IndustryPeersRequest): Promise<IndustryPeer[]> {
    return this.tryProviders('industryPeers', (provider) => provider.getIndustryPeers?.(request).then((result) => result.data))
  }

  async getCompanyNews(request: NewsRequest): Promise<NewsItem[]> {
    return this.tryProviders('news', (provider) => provider.getCompanyNews?.(request).then((result) => result.data))
  }

  async getCorporateEvents(request: EventRequest): Promise<CorporateEvent[]> {
    return this.tryProviders('events', (provider) => provider.getCorporateEvents?.(request).then((result) => result.data))
  }

  async getFinancialIndicators(request: FinancialIndicatorRequest): Promise<FinancialIndicator[]> {
    return this.tryProviders('financialIndicators', (provider) => provider.getFinancialIndicators?.(request).then((result) => result.data))
  }

  async getFinancialStatement(request: FinancialStatementRequest): Promise<FinancialStatement> {
    return this.tryProviders('financialStatements', (provider) => provider.getFinancialStatements?.(request).then((result) => result.data))
  }

  async getOwnership(symbol: string): Promise<OwnershipSummary> {
    return this.tryProviders('ownership', (provider) => provider.getOwnership?.(symbol).then((result) => result.data))
  }

  async getShareholders(request: ShareholderRequest): Promise<Shareholder[]> {
    return this.tryProviders('ownership', (provider) => provider.getShareholders?.(request).then((result) => result.data))
  }

  private async tryProviders<T>(route: MarketDataRouteKey, call: ProviderCall<T>): Promise<T> {
    const providerIds = this.routes[route]
    const errors: unknown[] = []

    for (const providerId of providerIds) {
      try {
        const provider = this.registry.get(providerId)
        const result = call(provider)

        if (!result) {
          errors.push(new MarketDataError('UNSUPPORTED_OPERATION', `${providerId} does not support ${route}`, providerId))
          continue
        }

        return await result
      } catch (error) {
        errors.push(error)
      }
    }

    throw this.toFinalError(route, providerIds, errors)
  }

  private toFinalError(route: MarketDataRouteKey, providerIds: MarketDataProviderId[], errors: unknown[]): MarketDataError {
    const lastError = errors.at(-1)

    if (lastError instanceof MarketDataError) {
      return lastError
    }

    return new MarketDataError(
      'PROVIDER_UNAVAILABLE',
      `No market data provider could satisfy ${route}. Tried: ${providerIds.join(', ')}`,
      providerIds[0],
      lastError
    )
  }
}
