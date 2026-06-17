import type { AssetType, Exchange, Market } from '../types'

export interface Instrument {
  symbol: string
  name?: string
  nameEn?: string
  exchange: Exchange
  assetType: AssetType
  market: Market
  referencePrice?: number
  ceilingPrice?: number
  floorPrice?: number
  providerMeta?: Record<string, unknown>
}

export interface SymbolSearchRequest {
  query?: string
  exchange?: Exchange
  assetType?: AssetType
  limit?: number
}
