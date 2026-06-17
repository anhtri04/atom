import type { MarketDataProviderId } from './types'

export type MarketDataErrorCode =
  | 'PROVIDER_UNAVAILABLE'
  | 'UNSUPPORTED_OPERATION'
  | 'SYMBOL_NOT_FOUND'
  | 'BAD_REQUEST'
  | 'RATE_LIMITED'
  | 'BLOCKED'
  | 'NON_JSON_RESPONSE'
  | 'NORMALIZATION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export class MarketDataError extends Error {
  readonly code: MarketDataErrorCode
  readonly provider?: MarketDataProviderId
  readonly cause?: unknown

  constructor(code: MarketDataErrorCode, message: string, provider?: MarketDataProviderId, cause?: unknown) {
    super(message)
    this.name = 'MarketDataError'
    this.code = code
    this.provider = provider
    this.cause = cause
  }
}

export const isMarketDataError = (error: unknown): error is MarketDataError => error instanceof MarketDataError
