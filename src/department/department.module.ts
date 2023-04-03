import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../entities';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [TypeOrmModule.forFeature([Department]), UsersModule],
  exports: [DepartmentService],
})
export class DepartmentModule {}
