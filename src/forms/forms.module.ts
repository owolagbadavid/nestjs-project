import { Module } from '@nestjs/common';
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
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [FormsController],
  providers: [FormsService],
  imports: [
    TypeOrmModule.forFeature([
      AdvanceDetails,
      AdvanceForm,
      ExpenseDetails,
      RetirementForm,
      SupportingDocs,
      Approvals,
    ]),
    UsersModule,
    MailModule,
  ],
  exports: [FormsService],
})
export class FormsModule {}
