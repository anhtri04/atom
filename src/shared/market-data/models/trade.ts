import type { PaginationRequest } from '../types'

export type TradeSide = 'buy' | 'sell' | 'unknown'

export interface IntradayTrade {
  symbol: string
  timestamp: string
  tradingDate?: string
  time?: string
  side: TradeSide
  price: number
  priceChange?: number
  matchVolume: number
  accumulatedVolume?: number
  accumulatedValue?: number
  providerMeta?: Record<string, unknown>
}

export interface IntradayTradeRequest extends PaginationRequest {
  symbol: string
}
