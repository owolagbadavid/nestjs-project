import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'src/db/data-source';
import { ConfigModule } from '@nestjs/config';
import { DepartmentModule } from './department/department.module';
import { UnitModule } from './unit/unit.module';
import { MailModule } from './mail/mail.module';
import { FormsModule } from './forms/forms.module';
import {
  User,
  Department,
  Unit,
  AdvanceForm,
  AdvanceDetails,
  RetirementForm,
  ExpenseDetails,
  Approvals,
  SupportingDocs,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([
      User,
      Department,
      Unit,
      AdvanceForm,
      AdvanceDetails,
      RetirementForm,
      ExpenseDetails,
      Approvals,
      SupportingDocs,
    ]),
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DepartmentModule,
    UnitModule,
    MailModule,
    FormsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
