import type { AssetType, CandleInterval, DateRangeRequest } from '../types'

export interface Candle {
  symbol: string
  interval: CandleInterval
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  value?: number
  adjustedClose?: number
  providerMeta?: Record<string, unknown>
}

export interface CandleRequest extends DateRangeRequest {
  symbol: string
  interval: CandleInterval
  assetType?: AssetType
  adjusted?: boolean
  limit?: number
}
