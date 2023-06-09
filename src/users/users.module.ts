import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Department, ProfilePicture, Unit, User } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { FormsModule } from '../forms/forms.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Department, Unit, ProfilePicture]),
    MailModule,
    forwardRef(() => FormsModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
