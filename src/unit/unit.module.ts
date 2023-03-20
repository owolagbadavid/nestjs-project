import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { Unit } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { DepartmentModule } from 'src/department/department.module';

@Module({
  controllers: [UnitController],
  providers: [UnitService],
  imports: [TypeOrmModule.forFeature([Unit]), UsersModule, DepartmentModule],
})
export class UnitModule {}
