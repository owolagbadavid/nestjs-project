import { Module, forwardRef } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AdvanceDetails,
  AdvanceForm,
  Approvals,
  ExpenseDetails,
  RetirementForm,
  SupportingDocs,
} from '../entities';
import { UsersModule } from '../users/users.module';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from '../mail/mail.processor';

@Module({
  controllers: [FormsController],
  providers: [FormsService, MailProcessor],
  imports: [
    TypeOrmModule.forFeature([
      AdvanceDetails,
      AdvanceForm,
      ExpenseDetails,
      RetirementForm,
      SupportingDocs,
      Approvals,
    ]),
    forwardRef(() => UsersModule),
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  exports: [FormsService],
})
export class FormsModule {}
