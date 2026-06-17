export const toNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined
  }

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : undefined
}

export const toNumberOrNull = (value: unknown): number | null => toNumber(value) ?? null

export const toInteger = (value: unknown): number | undefined => {
  const parsed = toNumber(value)
  return parsed === undefined ? undefined : Math.trunc(parsed)
}

export const toRatio = (value: unknown): number | undefined => toNumber(value)
