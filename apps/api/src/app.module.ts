import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ResultsModule } from './modules/results/results.module';

@Module({
  imports: [CoreModule, ResultsModule],
})
export class AppModule {}
