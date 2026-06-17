import type { LanguageOptions, PaginationRequest } from '../types'

export interface OwnershipBucket {
  volume?: number
  percentage?: number
}

export interface OwnershipSummary {
  symbol: string
  foreign?: OwnershipBucket
  state?: OwnershipBucket
  other?: OwnershipBucket
  asOfDate?: string
  providerMeta?: Record<string, unknown>
}

export interface Shareholder {
  symbol?: string
  name: string
  quantity?: number
  percentage?: number
  publicDate?: string
  ownershipTypeCode?: string
  typeCode?: string
  providerMeta?: Record<string, unknown>
}

export interface ShareholderRequest extends PaginationRequest, LanguageOptions {
  symbol: string
}
