import {
  SSI_CAPABILITIES,
  formatVietnameseDate,
  nowIso,
  parseVietnameseDate,
  toInteger,
  toNumber,
  type Candle,
  type CandleRequest,
  type CompanyProfile,
  type CorporateEvent,
  type EventRequest,
  type Exchange,
  type FinancialIndicator,
  type FinancialIndicatorRequest,
  type IndustryPeer,
  type IndustryPeersRequest,
  type MarketDataProvider,
  type NewsItem,
  type NewsRequest,
  type OwnershipSummary,
  type ProviderResult,
  type Shareholder,
  type ShareholderRequest
} from '@shared/market-data'
import { buildUrl, fetchJson } from '../http'

const BASE_URL = 'https://iboard-api.ssi.com.vn/statistics/company/ssmi'

type SsiEnvelope<T> = {
  code?: string
  message?: string
  data: T
  paging?: unknown
  status?: string
}

const providerResult = <T>(data: T): ProviderResult<T> => ({
  provider: 'ssi',
  source: 'SSI iBoard / SSI Securities',
  fetchedAt: nowIso(),
  data
})

const exchangeOf = (value?: string): Exchange => {
  if (value === 'HOSE' || value === 'HNX' || value === 'UPCOM') return value
  return 'UNKNOWN'
}

const ssiUrl = (path: string, params?: Record<string, string | number | undefined>): string => buildUrl(BASE_URL, path, params)

export class SsiMarketDataProvider implements MarketDataProvider {
  readonly id = 'ssi'
  readonly name = 'SSI iBoard'
  readonly source = 'iboard-api.ssi.com.vn'
  readonly capabilities = SSI_CAPABILITIES

  async getCandles(request: CandleRequest): Promise<ProviderResult<Candle[]>> {
    const response = await fetchJson<SsiEnvelope<Array<Record<string, unknown>>>>(
      'ssi',
      ssiUrl('/stock-info', {
        symbol: request.symbol,
        page: 1,
        pageSize: request.limit ?? 1000,
        fromDate: request.from ? formatVietnameseDate(request.from) : undefined,
        toDate: request.to ? formatVietnameseDate(request.to) : undefined
      })
    )

    return providerResult(
      response.data.map((row) => ({
        symbol: request.symbol,
        interval: '1d',
        time: parseVietnameseDate(String(row.tradingDate ?? '')) ?? String(row.tradingDate ?? ''),
        open: toNumber(row.open) ?? 0,
        high: toNumber(row.high) ?? 0,
        low: toNumber(row.low) ?? 0,
        close: toNumber(row.close) ?? 0,
        volume: toInteger(row.volume) ?? 0,
        value: toNumber(row.totalMatchVal),
        adjustedClose: toNumber(row.closePriceAdjusted),
        providerMeta: row
      }))
    )
  }

  async getCompanyProfile(symbol: string): Promise<ProviderResult<CompanyProfile>> {
    const response = await fetchJson<SsiEnvelope<Record<string, unknown>>>('ssi', ssiUrl('/company-profile', { symbol, language: 'vn' }))
    const data = response.data

    return providerResult({
      symbol,
      companyName: data.companyName as string | undefined,
      exchange: exchangeOf(data.exchange as string | undefined),
      industryName: data.industryName as string | undefined,
      sector: data.sector as string | undefined,
      subSector: data.subSector as string | undefined,
      foundingDate: data.foundingDate as string | undefined,
      listingDate: data.listingDate as string | undefined,
      charterCapital: toNumber(data.charterCapital),
      listedShares: toNumber(data.quantity),
      outstandingShares: toNumber(data.issueShare),
      freeFloatRatio: toNumber(data.freeFloatRate),
      businessDescription: data.companyProfile as string | undefined,
      rawHtmlDescription: data.companyProfile as string | undefined,
      address: data.address as string | undefined,
      phone: data.telephone as string | undefined,
      fax: data.fax as string | undefined,
      email: data.email as string | undefined,
      website: data.website as string | undefined,
      providerMeta: data
    })
  }

  async getIndustryPeers(request: IndustryPeersRequest): Promise<ProviderResult<IndustryPeer[]>> {
    const response = await fetchJson<SsiEnvelope<Array<Record<string, unknown>>>>(
      'ssi',
      ssiUrl('/company-in-same-industry', { symbol: request.symbol, language: request.language ?? 'vn', page: request.page ?? 1, pageSize: request.pageSize ?? 100 })
    )

    return providerResult(
      response.data.map((row) => ({
        symbol: String(row.symbol ?? ''),
        companyName: row.companyName as string | undefined,
        exchange: exchangeOf(row.exchange as string | undefined),
        currentPrice: toNumber(row.currentPrice),
        referencePrice: toNumber(row.referencePrice),
        floorPrice: toNumber(row.floorPrice),
        ceilingPrice: toNumber(row.ceilingPrice),
        change: toNumber(row.priceChange),
        changePercent: toNumber(row.perPriceChange),
        matchVolume: toInteger(row.matchVolume),
        providerMeta: row
      }))
    )
  }

  async getCompanyNews(request: NewsRequest): Promise<ProviderResult<NewsItem[]>> {
    const response = await fetchJson<SsiEnvelope<Array<Record<string, unknown>>>>(
      'ssi',
      ssiUrl('/company-news', {
        symbol: request.symbol,
        page: request.page ?? 1,
        pageSize: request.pageSize ?? 10,
        fromDate: request.from ? formatVietnameseDate(request.from) : undefined,
        toDate: request.to ? formatVietnameseDate(request.to) : undefined,
        language: request.language ?? 'vn'
      })
    )

    return providerResult(
      response.data.map((row) => ({
        id: String(row.newId ?? row.newsSourceLink ?? row.title),
        symbol: row.symbol as string | undefined,
        title: String(row.title ?? ''),
        summary: row.shortContent as string | undefined,
        content: row.fullContent as string | undefined,
        rawHtmlContent: row.fullContent as string | undefined,
        imageUrl: row.imageUrl as string | undefined,
        source: row.newsSource as string | undefined,
        sourceCode: row.sourceCode as string | undefined,
        sourceUrl: row.newsSourceLink as string | undefined,
        categoryCode: row.categoryCode as string | undefined,
        createdAt: parseVietnameseDate(String(row.createDate ?? '')),
        updatedAt: parseVietnameseDate(String(row.updateDate ?? '')),
        publishedAt: parseVietnameseDate(String(row.publicDate ?? '')),
        providerMeta: row
      }))
    )
  }

  async getCorporateEvents(request: EventRequest): Promise<ProviderResult<CorporateEvent[]>> {
    const response = await fetchJson<SsiEnvelope<Array<Record<string, unknown>>>>(
      'ssi',
      ssiUrl('/corporate-actions', {
        symbol: request.symbol,
        page: request.page ?? 1,
        pageSize: request.pageSize ?? 10,
        fromDate: request.from ? formatVietnameseDate(request.from) : undefined,
        toDate: request.to ? formatVietnameseDate(request.to) : undefined,
        language: request.language ?? 'vn'
      })
    )

    return providerResult(
      response.data.map((row) => ({
        symbol: String(row.symbol ?? request.symbol),
        type: 'unknown',
        title: String(row.eventTitle ?? row.eventName ?? ''),
        name: row.eventName as string | undefined,
        description: row.eventDescription as string | undefined,
        rawHtmlDescription: row.eventDescription as string | undefined,
        exchange: row.exchange as string | undefined,
        exRightDate: parseVietnameseDate(String(row.exrightDate ?? '')),
        recordDate: parseVietnameseDate(String(row.recordDate ?? '')),
        issueDate: parseVietnameseDate(String(row.issueDate ?? '')),
        publicDate: parseVietnameseDate(String(row.publicDate ?? '')),
        value: toNumber(row.value),
        ratio: row.ratio as string | undefined,
        code: (row.eventListCode ?? row.eventCode) as string | undefined,
        providerMeta: row
      }))
    )
  }

  async getFinancialIndicators(request: FinancialIndicatorRequest): Promise<ProviderResult<FinancialIndicator[]>> {
    const response = await fetchJson<SsiEnvelope<Array<Record<string, unknown>>>>(
      'ssi',
      ssiUrl('/finance-indicator', { symbol: request.symbol, page: request.page ?? 1, pageSize: request.pageSize ?? 10 })
    )

    return providerResult(
      response.data.map((row) => ({
        symbol: request.symbol,
        year: toInteger(row.yearReport) ?? 0,
        quarter: toInteger(row.lengthReport),
        revenue: toNumber(row.revenue),
        profit: toNumber(row.profit),
        netProfit: toNumber(row.netProfit),
        assets: toNumber(row.asset),
        marketCap: toNumber(row.marketCap),
        eps: toNumber(row.eps),
        dilutedEps: toNumber(row.dilutedEPS),
        pe: toNumber(row.pe),
        pb: toNumber(row.pb),
        roe: toNumber(row.roe),
        roa: toNumber(row.roa),
        grossProfitMargin: toNumber(row.grossProfitMargin),
        netProfitMargin: toNumber(row.netProfitMargin),
        debtEquity: toNumber(row.debtEquity),
        sharesOutstanding: toNumber(row.sharesOutstanding),
        bookValuePerShare: toNumber(row.bv),
        beta: toNumber(row.beta),
        dividendYield: toNumber(row.dividendYield),
        providerMeta: row
      }))
    )
  }

  async getOwnership(symbol: string): Promise<ProviderResult<OwnershipSummary>> {
    const response = await fetchJson<SsiEnvelope<Array<Record<string, unknown>>>>('ssi', ssiUrl('/share-holder-summary', { symbol, language: 'vn' }))
    const row = response.data[0] ?? {}
    return providerResult({
      symbol,
      foreign: { volume: toNumber(row.foreignerVolume), percentage: toNumber(row.foreignerPercentage) },
      state: { volume: toNumber(row.stateVolume), percentage: toNumber(row.statePercentage) },
      other: { volume: toNumber(row.otherVolume), percentage: toNumber(row.otherPercentage) },
      asOfDate: row.publicDate as string | undefined,
      providerMeta: row
    })
  }

  async getShareholders(request: ShareholderRequest): Promise<ProviderResult<Shareholder[]>> {
    const response = await fetchJson<SsiEnvelope<Array<Record<string, unknown>>>>(
      'ssi',
      ssiUrl('/share-holder-detail', { symbol: request.symbol, language: request.language ?? 'vn', page: request.page ?? 1, pageSize: request.pageSize ?? 100 })
    )

    return providerResult(
      response.data.map((row) => ({
        symbol: row.symbol as string | undefined,
        name: String(row.name ?? ''),
        quantity: toNumber(row.quantity),
        percentage: toNumber(row.percentage),
        publicDate: row.publicDate as string | undefined,
        ownershipTypeCode: row.ownerShipTypeCode as string | undefined,
        typeCode: row.type as string | undefined,
        providerMeta: row
      }))
    )
  }
}
