import type { DateRangeRequest, LanguageOptions, PaginationRequest } from '../types'

export interface NewsItem {
  id: string
  symbol?: string
  title: string
  summary?: string
  content?: string
  imageUrl?: string
  source?: string
  sourceCode?: string
  sourceUrl?: string
  categoryCode?: string
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  rawHtmlContent?: string
  providerMeta?: Record<string, unknown>
}

export interface NewsRequest extends DateRangeRequest, PaginationRequest, LanguageOptions {
  symbol: string
}
