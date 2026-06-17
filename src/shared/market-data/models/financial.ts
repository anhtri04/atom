import type { PaginationRequest } from '../types'

export type FinancialPeriod = 'year' | 'quarter'

export type FinancialStatementType = 'income_statement' | 'balance_sheet' | 'cash_flow' | 'ratios' | 'summary'

export interface FinancialPeriodInfo {
  year: number
  quarter?: number
  label?: string
  beginDate?: string
  endDate?: string
  reportDate?: string
  auditedStatus?: string
  consolidatedStatus?: string
}

export interface FinancialStatementLineItem {
  code?: string
  name: string
  nameEn?: string
  unit?: string
  level?: number
  parentCode?: string
  values: Array<number | null>
  providerMeta?: Record<string, unknown>
}

export interface FinancialStatement {
  symbol: string
  type: FinancialStatementType
  period: FinancialPeriod
  periods: FinancialPeriodInfo[]
  items: FinancialStatementLineItem[]
  currency?: string
  unitMultiplier?: number
  providerMeta?: Record<string, unknown>
}

export interface FinancialStatementRequest extends PaginationRequest {
  symbol: string
  type: FinancialStatementType
  period: FinancialPeriod
  periods?: number
}

export interface FinancialIndicator {
  symbol: string
  year: number
  quarter?: number
  revenue?: number
  profit?: number
  netProfit?: number
  assets?: number
  marketCap?: number
  eps?: number
  dilutedEps?: number
  pe?: number
  pb?: number
  roe?: number
  roa?: number
  grossProfitMargin?: number
  netProfitMargin?: number
  debtEquity?: number
  sharesOutstanding?: number
  bookValuePerShare?: number
  beta?: number
  dividendYield?: number
  providerMeta?: Record<string, unknown>
}

export interface FinancialIndicatorRequest extends PaginationRequest {
  symbol: string
  period?: FinancialPeriod
}
