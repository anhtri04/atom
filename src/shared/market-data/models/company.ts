import type { Exchange, LanguageOptions, PaginationRequest } from '../types'

export interface CompanyLeader {
  name: string
  position?: string
  positionCode?: string
  personId?: string
}

export interface RelatedCompany {
  symbol?: string
  name: string
  role?: string
  roleCode?: string
  ownershipRatio?: number
  charterCapital?: number
}

export interface CompanyProfile {
  symbol: string
  companyName?: string
  companyNameEn?: string
  exchange?: Exchange
  industryName?: string
  sector?: string
  subSector?: string
  foundingDate?: string
  listingDate?: string
  charterCapital?: number
  listedShares?: number
  outstandingShares?: number
  freeFloatRatio?: number
  businessDescription?: string
  address?: string
  phone?: string
  fax?: string
  email?: string
  website?: string
  leaders?: CompanyLeader[]
  subsidiaries?: RelatedCompany[]
  rawHtmlDescription?: string
  providerMeta?: Record<string, unknown>
}

export interface CompanyProfileRequest extends LanguageOptions {
  symbol: string
}

export interface RelatedCompaniesRequest extends PaginationRequest, LanguageOptions {
  symbol: string
}

export interface IndustryPeer {
  symbol: string
  companyName?: string
  exchange?: Exchange
  currentPrice?: number
  referencePrice?: number
  floorPrice?: number
  ceilingPrice?: number
  change?: number
  changePercent?: number
  matchVolume?: number
  providerMeta?: Record<string, unknown>
}

export interface IndustryPeersRequest extends PaginationRequest, LanguageOptions {
  symbol: string
}
