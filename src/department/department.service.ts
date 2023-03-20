import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/entities';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
    private usersService: UsersService,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const head = await this.usersService.findOne(createDepartmentDto.headId);
    // if user role is not at least an HOD
    if (head.role < 2) throw new BadRequestException('Invalid headId');
    const department = this.departmentRepo.create(createDepartmentDto);

    return this.departmentRepo.save(department);
  }

  findAll(): Promise<Department[]> {
    return this.departmentRepo.find();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepo.findOne({ where: { id } });

    if (!department) throw new NotFoundException(`Department ${id} not found`);
    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const { headId } = updateDepartmentDto;
    const department = await this.departmentRepo.findOne({ where: { id } });
    if (!department) throw new NotFoundException(`Department ${id} not found`);
    if (headId) {
      const head = await this.usersService.findOne(updateDepartmentDto.headId);
      if (head.role < 2) throw new BadRequestException('Invalid headId');
    }

    return this.departmentRepo.save({ ...department, ...updateDepartmentDto });
  }

  async remove(id: number): Promise<Department> {
    const department = await this.departmentRepo.findOne({ where: { id } });
    if (!department) throw new NotFoundException(`department ${id} not found`);

    return this.departmentRepo.remove(department);
  }
}
