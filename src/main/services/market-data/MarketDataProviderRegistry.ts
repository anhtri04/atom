import type { MarketDataProvider, MarketDataProviderId } from '@shared/market-data'
import { MarketDataError } from '@shared/market-data'

export class MarketDataProviderRegistry {
  private readonly providers = new Map<MarketDataProviderId, MarketDataProvider>()

  register(provider: MarketDataProvider): void {
    this.providers.set(provider.id, provider)
  }

  get(providerId: MarketDataProviderId): MarketDataProvider {
    const provider = this.providers.get(providerId)

    if (!provider) {
      throw new MarketDataError('PROVIDER_UNAVAILABLE', `Market data provider not registered: ${providerId}`, providerId)
    }

    return provider
  }

  list(): MarketDataProvider[] {
    return Array.from(this.providers.values())
  }
}
