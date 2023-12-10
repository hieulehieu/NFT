import { Module } from '@nestjs/common';
import { ConnectionsModule } from '@src/connections/connections.module';
import { MarketItemsModule } from '../market-items/market-items.module';
import { CrawlsSchedule } from './crawls.schedule';
import { RepositoryModule } from './repositories/repository.module';

@Module({
  imports: [
    ConnectionsModule,
    RepositoryModule,
    MarketItemsModule,
  ],
  controllers: [],
  providers: [CrawlsSchedule],
})
export class SchedulesModule {}
