import {
  KBS_CAPABILITIES,
  normalizeKbsBoardPrice,
  normalizeKbsHistoricalPrice,
  nowIso,
  toInteger,
  toNumber,
  type Candle,
  type CandleInterval,
  type CandleRequest,
  type CompanyProfile,
  type CorporateEvent,
  type EventRequest,
  type Exchange,
  type FinancialIndicator,
  type FinancialIndicatorRequest,
  type FinancialStatement,
  type FinancialStatementRequest,
  type Instrument,
  type IntradayTrade,
  type IntradayTradeRequest,
  type MarketDataProvider,
  type NewsItem,
  type NewsRequest,
  type ProviderResult,
  type Quote,
  type SymbolSearchRequest
} from '@shared/market-data'
import { buildUrl, fetchJson } from '../http'

const BASE_URL = 'https://kbbuddywts.kbsec.com.vn/iis-server/investment'

const intervalMap: Record<CandleInterval, string> = {
  '1m': '1P',
  '5m': '5P',
  '15m': '15P',
  '30m': '30P',
  '1h': '60P',
  '1d': 'day',
  '1w': 'week',
  '1M': 'month'
}

const indexSymbols = new Set(['VNINDEX', 'HNXINDEX', 'UPCOMINDEX', 'VN30', 'HNX30', 'VN100'])

type KbsSymbol = {
  symbol?: string
  name?: string
  nameEn?: string
  exchange?: string
  type?: string
  re?: number
  ceiling?: number
  floor?: number
}

type KbsCandleResponse = Record<string, Array<{ t?: string; o?: string | number; h?: string | number; l?: string | number; c?: string | number; v?: string | number }>>

type KbsBoardRow = Record<string, string | number | undefined>

type KbsEnvelopeNews = Array<{ ArticleID?: number; Title?: string; Head?: string; PublishTime?: string; URL?: string }>

const ddmmyyyy = (iso?: string): string | undefined => {
  if (!iso) return undefined
  const [year, month, day] = iso.slice(0, 10).split('-')
  return year && month && day ? `${day}-${month}-${year}` : undefined
}

const providerResult = <T>(data: T): ProviderResult<T> => ({
  provider: 'kbs',
  source: 'KB Securities (KBS)',
  fetchedAt: nowIso(),
  data
})

const exchangeOf = (value?: string): Exchange => {
  if (value === 'HOSE' || value === 'HNX' || value === 'UPCOM') return value
  return 'UNKNOWN'
}

export class KbsMarketDataProvider implements MarketDataProvider {
  readonly id = 'kbs'
  readonly name = 'KB Securities'
  readonly source = 'kbbuddywts.kbsec.com.vn'
  readonly capabilities = KBS_CAPABILITIES

  async searchSymbols(request?: SymbolSearchRequest): Promise<ProviderResult<Instrument[]>> {
    const rows = await fetchJson<KbsSymbol[]>('kbs', `${BASE_URL}/stock/search/data`)
    const query = request?.query?.trim().toUpperCase()
    const instruments = rows
      .map((row) => ({
        symbol: row.symbol ?? '',
        name: row.name,
        nameEn: row.nameEn,
        exchange: exchangeOf(row.exchange),
        assetType: row.type === 'stock' ? 'stock' : 'unknown',
        market: 'VN',
        referencePrice: toNumber(row.re),
        ceilingPrice: toNumber(row.ceiling),
        floorPrice: toNumber(row.floor),
        providerMeta: row as Record<string, unknown>
      }) satisfies Instrument)
      .filter((item) => item.symbol)
      .filter((item) => !query || item.symbol.includes(query) || item.name?.toUpperCase().includes(query) || item.nameEn?.toUpperCase().includes(query))
      .filter((item) => !request?.exchange || item.exchange === request.exchange)
      .filter((item) => !request?.assetType || item.assetType === request.assetType)

    return providerResult(request?.limit ? instruments.slice(0, request.limit) : instruments)
  }

  async getSymbolsByExchange(exchange: Exchange): Promise<ProviderResult<Instrument[]>> {
    return this.searchSymbols({ exchange })
  }

  async getSymbolsByGroup(groupCode: string): Promise<ProviderResult<string[]>> {
    const data = await fetchJson<string[]>('kbs', `${BASE_URL}/index/${encodeURIComponent(groupCode)}/stocks`)
    return providerResult(data)
  }

  async getQuotes(symbols: string[]): Promise<ProviderResult<Quote[]>> {
    const data = await fetchJson<KbsBoardRow[]>('kbs', `${BASE_URL}/stock/iss`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-lang': 'vi', 'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8' },
      body: JSON.stringify({ code: symbols.join(',') })
    })

    return providerResult(
      data.map((row) => ({
        symbol: String(row.SB ?? ''),
        exchange: exchangeOf(String(row.EX ?? '')),
        timestamp: typeof row.t === 'number' ? new Date(row.t).toISOString() : nowIso(),
        referencePrice: normalizeKbsBoardPrice(row.RE),
        ceilingPrice: normalizeKbsBoardPrice(row.CL),
        floorPrice: normalizeKbsBoardPrice(row.FL),
        open: normalizeKbsBoardPrice(row.OP),
        high: normalizeKbsBoardPrice(row.HI),
        low: normalizeKbsBoardPrice(row.LO),
        last: normalizeKbsBoardPrice(row.CP),
        average: normalizeKbsBoardPrice(row.AP),
        change: normalizeKbsBoardPrice(row.CH),
        changePercent: toNumber(row.CHP),
        matchVolume: toInteger(row.CV),
        totalVolume: toInteger(row.TT),
        totalValue: toNumber(row.TV),
        bid: [
          { price: normalizeKbsBoardPrice(row.B1) ?? 0, volume: toInteger(row.V1) ?? 0 },
          { price: normalizeKbsBoardPrice(row.B2) ?? 0, volume: toInteger(row.V2) ?? 0 },
          { price: normalizeKbsBoardPrice(row.B3) ?? 0, volume: toInteger(row.V3) ?? 0 }
        ],
        ask: [
          { price: normalizeKbsBoardPrice(row.S1) ?? 0, volume: toInteger(row.U1) ?? 0 },
          { price: normalizeKbsBoardPrice(row.S2) ?? 0, volume: toInteger(row.U2) ?? 0 },
          { price: normalizeKbsBoardPrice(row.S3) ?? 0, volume: toInteger(row.U3) ?? 0 }
        ],
        foreignBuyVolume: toInteger(row.FB),
        foreignSellVolume: toInteger(row.FR),
        foreignRoom: toNumber(row.FS),
        status: row.ST === undefined ? undefined : String(row.ST),
        providerMeta: row
      }))
    )
  }

  async getCandles(request: CandleRequest): Promise<ProviderResult<Candle[]>> {
    const interval = intervalMap[request.interval]
    const section = indexSymbols.has(request.symbol.toUpperCase()) || request.assetType === 'index' ? 'index' : 'stocks'
    const url = buildUrl(BASE_URL, `/${section}/${encodeURIComponent(request.symbol)}/data_${interval}`, {
      sdate: ddmmyyyy(request.from),
      edate: ddmmyyyy(request.to)
    })
    const data = await fetchJson<KbsCandleResponse>('kbs', url)
    const rows = data[`data_${interval}`] ?? data.data_day ?? []

    return providerResult(
      rows.map((row) => ({
        symbol: request.symbol,
        interval: request.interval,
        time: row.t ?? '',
        open: normalizeKbsHistoricalPrice(row.o) ?? 0,
        high: normalizeKbsHistoricalPrice(row.h) ?? 0,
        low: normalizeKbsHistoricalPrice(row.l) ?? 0,
        close: normalizeKbsHistoricalPrice(row.c) ?? 0,
        volume: toInteger(row.v) ?? 0,
        providerMeta: row
      }))
    )
  }

  async getIntradayTrades(request: IntradayTradeRequest): Promise<ProviderResult<IntradayTrade[]>> {
    type Row = Record<string, string | number | undefined>
    const url = buildUrl(BASE_URL, `/trade/history/${encodeURIComponent(request.symbol)}`, { page: request.page, limit: request.pageSize })
    const response = await fetchJson<{ data?: Row[] }>('kbs', url)
    return providerResult(
      (response.data ?? []).map((row) => ({
        symbol: String(row.SB ?? request.symbol),
        timestamp: String(row.t ?? ''),
        tradingDate: row.TD === undefined ? undefined : String(row.TD),
        time: row.FT === undefined ? undefined : String(row.FT),
        side: row.LC === 'B' ? 'buy' : row.LC === 'S' ? 'sell' : 'unknown',
        price: normalizeKbsBoardPrice(row.FMP) ?? 0,
        priceChange: normalizeKbsBoardPrice(row.FCV),
        matchVolume: toInteger(row.FV) ?? 0,
        accumulatedVolume: toInteger(row.AVO),
        accumulatedValue: toNumber(row.AVA),
        providerMeta: row
      }))
    )
  }

  async getCompanyProfile(symbol: string): Promise<ProviderResult<CompanyProfile>> {
    const data = await fetchJson<Record<string, unknown>>('kbs', buildUrl(BASE_URL, `/stockinfo/profile/${encodeURIComponent(symbol)}`, { l: 1 }))
    return providerResult({
      symbol,
      companyName: data.TY as string | undefined,
      exchange: exchangeOf(data.EX as string | undefined),
      foundingDate: data.FD as string | undefined,
      listingDate: data.LD as string | undefined,
      charterCapital: toNumber(data.CC),
      listedShares: toNumber(data.VL),
      outstandingShares: toNumber(data.KLCPLH),
      freeFloatRatio: toNumber(data.KLCPNY),
      businessDescription: data.SM as string | undefined,
      address: data.ADD as string | undefined,
      phone: data.PHONE as string | undefined,
      fax: data.FAX as string | undefined,
      email: data.EMAIL as string | undefined,
      website: data.URL as string | undefined,
      providerMeta: data
    })
  }

  async getCompanyNews(request: NewsRequest): Promise<ProviderResult<NewsItem[]>> {
    const url = buildUrl(BASE_URL, `/stockinfo/news/${encodeURIComponent(request.symbol)}`, { l: 1, p: request.page, s: request.pageSize })
    const data = await fetchJson<KbsEnvelopeNews>('kbs', url)
    return providerResult(data.map((row) => ({ id: String(row.ArticleID ?? row.URL ?? row.Title), symbol: request.symbol, title: row.Title ?? '', summary: row.Head, sourceUrl: row.URL, publishedAt: row.PublishTime, providerMeta: row as Record<string, unknown> })))
  }

  async getCorporateEvents(request: EventRequest): Promise<ProviderResult<CorporateEvent[]>> {
    const url = buildUrl(BASE_URL, `/stockinfo/event/${encodeURIComponent(request.symbol)}`, { l: 1, p: request.page, s: request.pageSize })
    const data = await fetchJson<Array<Record<string, unknown>>>('kbs', url)
    return providerResult(data.map((row) => ({ symbol: request.symbol, type: request.type ?? 'unknown', title: String(row.Title ?? row.EventTitle ?? row.Name ?? ''), description: row.Head as string | undefined, providerMeta: row })))
  }

  async getFinancialStatements(request: FinancialStatementRequest): Promise<ProviderResult<FinancialStatement>> {
    const kbsType = request.type === 'income_statement' ? 'KQKD' : request.type === 'balance_sheet' ? 'CDKT' : request.type === 'cash_flow' ? 'LCTT' : request.type === 'ratios' ? 'CSTC' : 'BCTT'
    const term = request.period === 'year' ? 1 : 2
    const url = buildUrl(BASE_URL, `/stock/finance-info/${encodeURIComponent(request.symbol)}`, { type: kbsType, termtype: term, termType: term, code: request.symbol, page: request.page ?? 1, pageSize: request.pageSize ?? 4, unit: 1, languageid: 1 })
    const data = await fetchJson<{ Head?: Array<Record<string, unknown>>; Content?: Record<string, Array<Record<string, unknown>>> }>('kbs', url)
    const items = Object.values(data.Content ?? {}).flat()
    return providerResult({
      symbol: request.symbol,
      type: request.type,
      period: request.period,
      periods: (data.Head ?? []).map((head) => ({ year: toInteger(head.YearPeriod) ?? 0, label: head.TermName as string | undefined, reportDate: head.ReportDate as string | undefined })),
      items: items.map((item) => ({ name: String(item.Name ?? ''), nameEn: item.NameEn as string | undefined, unit: item.Unit as string | undefined, level: toInteger(item.Levels), values: [toNumber(item.Value1) ?? null, toNumber(item.Value2) ?? null, toNumber(item.Value3) ?? null, toNumber(item.Value4) ?? null], providerMeta: item })),
      currency: 'VND',
      unitMultiplier: 1,
      providerMeta: data as Record<string, unknown>
    })
  }

  async getFinancialIndicators(request: FinancialIndicatorRequest): Promise<ProviderResult<FinancialIndicator[]>> {
    const statement = await this.getFinancialStatements({ symbol: request.symbol, type: 'ratios', period: request.period ?? 'quarter', page: request.page, pageSize: request.pageSize })
    return providerResult(statement.data.periods.map((period) => ({ symbol: request.symbol, year: period.year, providerMeta: { sourceStatement: statement.data.type } })))
  }
}
