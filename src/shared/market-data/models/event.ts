import type { DateRangeRequest, LanguageOptions, PaginationRequest } from '../types'

export type CorporateEventType =
  | 'agm'
  | 'dividend'
  | 'issuance'
  | 'insider_trading'
  | 'other'
  | 'unknown'

export interface CorporateEvent {
  id?: string
  symbol: string
  type: CorporateEventType
  title: string
  name?: string
  description?: string
  exchange?: string
  exRightDate?: string
  recordDate?: string
  issueDate?: string
  publicDate?: string
  value?: number
  ratio?: string
  code?: string
  rawHtmlDescription?: string
  providerMeta?: Record<string, unknown>
}

export interface EventRequest extends DateRangeRequest, PaginationRequest, LanguageOptions {
  symbol: string
  type?: CorporateEventType
}
