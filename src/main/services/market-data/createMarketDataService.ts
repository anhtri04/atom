import type { MarketDataService } from '@shared/market-data'
import { MarketDataProviderRegistry } from './MarketDataProviderRegistry'
import { MarketDataServiceImpl } from './MarketDataServiceImpl'
import { KbsMarketDataProvider } from './providers/kbs/KbsMarketDataProvider'
import { SsiMarketDataProvider } from './providers/ssi/SsiMarketDataProvider'

export const createMarketDataService = (): MarketDataService => {
  const registry = new MarketDataProviderRegistry()
  registry.register(new KbsMarketDataProvider())
  registry.register(new SsiMarketDataProvider())
  return new MarketDataServiceImpl(registry)
}
