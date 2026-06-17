import { toNumber } from './number'

export const normalizeKbsBoardPrice = (value: unknown): number | undefined => {
  const parsed = toNumber(value)
  return parsed === undefined ? undefined : parsed / 1000
}

export const normalizeKbsHistoricalPrice = (value: unknown): number | undefined => {
  const parsed = toNumber(value)

  if (parsed === undefined) {
    return undefined
  }

  return Number.isInteger(parsed) && parsed >= 100_000 ? parsed / 1000 : parsed
}

export const normalizeRawPrice = (value: unknown): number | undefined => toNumber(value)
