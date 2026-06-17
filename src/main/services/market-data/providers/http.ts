import { MarketDataError, type MarketDataProviderId } from '@shared/market-data'

export const fetchJson = async <T>(provider: MarketDataProviderId, url: string, init?: RequestInit): Promise<T> => {
  let response: Response

  try {
    response = await fetch(url, init)
  } catch (error) {
    throw new MarketDataError('NETWORK_ERROR', `Network request failed: ${url}`, provider, error)
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (!response.ok) {
    const code = response.status === 403 ? 'BLOCKED' : response.status === 404 ? 'SYMBOL_NOT_FOUND' : 'BAD_REQUEST'
    throw new MarketDataError(code, `Provider ${provider} returned HTTP ${response.status}`, provider)
  }

  if (!contentType.includes('application/json')) {
    throw new MarketDataError('NON_JSON_RESPONSE', `Provider ${provider} returned non-JSON response`, provider)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    throw new MarketDataError('NON_JSON_RESPONSE', `Failed to parse JSON from provider ${provider}`, provider, error)
  }
}

export const buildUrl = (baseUrl: string, path: string, params?: Record<string, string | number | undefined>): string => {
  const url = new URL(`${baseUrl}${path}`)

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}
