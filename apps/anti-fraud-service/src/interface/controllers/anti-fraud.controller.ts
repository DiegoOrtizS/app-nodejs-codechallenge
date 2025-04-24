import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from '../../application/services/transaction.service';
import { Transaction } from '../../domain/entities/transaction.entity';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('transaction-created')
  async handleTransaction(@Payload() message: { value: Transaction }) {
    console.log('🔥 Received from Kafka:', message.value);
    await this.antiFraudService.validateTransaction(message.value);
  }
}
