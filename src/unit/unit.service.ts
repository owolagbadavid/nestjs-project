import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto, UpdateUnitDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from 'src/entities';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private unitRepo: Repository<Unit>,
    private usersService: UsersService,
    private departmentService: DepartmentService,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const head = await this.usersService.findOne(createUnitDto.headId);
    const department = await this.departmentService.findOne(
      createUnitDto.departmentId,
    );

    // if user is not at least a supervisor,
    if (head.role < 1) throw new BadRequestException('Invalid headId');
    // if department is not valid
    if (!department) throw new BadRequestException('Invalid departmentId');

    const unit = this.unitRepo.create(createUnitDto);

    return this.unitRepo.save(unit);
  }

  findAll(): Promise<Unit[]> {
    return this.unitRepo.find();
  }

  async findOne(id: number) {
    const unit = await this.unitRepo.findOne({ where: { id } });

    if (!unit) throw new NotFoundException(`Unit ${id} not found`);
    return unit;
  }

  async update(id: number, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const { headId, departmentId } = updateUnitDto;
    const unit = await this.unitRepo.findOne({ where: { id } });
    if (!unit) throw new NotFoundException(`unit ${id} not found`);
    if (headId) {
      const head = await this.usersService.findOne(headId);
      // if user is not at least a supervisor,
      if (head.role < 2) throw new BadRequestException('Invalid headId');
    }

    if (departmentId) {
      const department = await this.departmentService.findOne(departmentId);
      // if department is not valid, throw an error
      if (!department) throw new BadRequestException('Invalid departmentId');
    }
    return this.unitRepo.save({ ...unit, ...updateUnitDto });
  }

  async remove(id: number): Promise<Unit> {
    const unit = await this.unitRepo.findOne({ where: { id } });
    if (!unit) throw new NotFoundException(`Unit ${id} not found`);

    return this.unitRepo.remove(unit);
  }
}
