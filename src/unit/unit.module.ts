import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { Unit } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DepartmentModule } from '../department/department.module';

@Module({
  controllers: [UnitController],
  providers: [UnitService],
  imports: [TypeOrmModule.forFeature([Unit]), UsersModule, DepartmentModule],
})
export class UnitModule {}
