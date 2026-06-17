import type { Exchange } from '../types'

export interface PriceLevel {
  price: number
  volume: number
}

export interface Quote {
  symbol: string
  exchange?: Exchange
  timestamp: string
  referencePrice?: number
  ceilingPrice?: number
  floorPrice?: number
  open?: number
  high?: number
  low?: number
  last?: number
  average?: number
  change?: number
  changePercent?: number
  matchVolume?: number
  totalVolume?: number
  totalValue?: number
  bid?: PriceLevel[]
  ask?: PriceLevel[]
  foreignBuyVolume?: number
  foreignSellVolume?: number
  foreignRoom?: number
  status?: string
  providerMeta?: Record<string, unknown>
}

export interface QuoteRequest {
  symbols: string[]
}
