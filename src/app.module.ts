import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from './db/data-source';
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
  ProfilePicture,
} from './entities';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BullModule } from '@nestjs/bull';

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
      ProfilePicture,
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: '/',
      // serveStaticOptions: { fallthrough: false },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
