import { Module } from '@nestjs/common';
import { AntiFraudController } from './interface/controllers/anti-fraud.controller';
import { KafkaProducer } from './infrastructure/kafka/kafka-producer';
import { AntiFraudService } from './application/services/transaction.service';

@Module({
  providers: [AntiFraudController, AntiFraudService, KafkaProducer],
})
export class AppModule {}
