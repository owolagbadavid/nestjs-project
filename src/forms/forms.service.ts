import { Injectable } from '@nestjs/common';

import {
  CreateAdvanceFormDto,
  CreateRetirementFormDto,
  UpdateAdvanceFormDto,
  UpdateRetirementFormDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdvanceDetails, AdvanceForm, User } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(AdvanceForm)
    private advanceFormRepo: Repository<AdvanceForm>,
    @InjectRepository(AdvanceDetails)
    private advanceDetailsRepo: Repository<AdvanceDetails>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}
  async createAdvanceForm(
    createAdvanceFormDto: CreateAdvanceFormDto,
    user: User,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const supervisor = await this.usersService.findOne(user.supervisorId);
    createAdvanceFormDto.approvalLevel = 0;
    createAdvanceFormDto.nextApprovalLevel = supervisor.role;
    createAdvanceFormDto.details = createAdvanceFormDto.details.map((item) =>
      this.advanceDetailsRepo.create(item),
    );

    try {
      for (const item of createAdvanceFormDto.details) {
        await queryRunner.manager.save(item);
      }

      const advanceForm = this.advanceFormRepo.create(createAdvanceFormDto);

      await queryRunner.manager.save(advanceForm);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return 'Form created successfully';
  }

  createRetirementForm(createRetirementFormDto: CreateRetirementFormDto) {
    return 'This action adds a new form';
  }

  findAllAdvanceForms() {
    return this.advanceDetailsRepo.find();
  }

  findAllRetirementForms() {
    return `This action returns all forms`;
  }

  findOneAdvanceForm(id: number) {
    return `This action returns a #${id} form`;
  }

  findOneRetirementForm(id: number) {
    return `This action returns a #${id} form`;
  }

  updateAdvanceForm(id: number, updateAdvanceFormDto: UpdateAdvanceFormDto) {
    return `This action updates a #${id} form`;
  }

  updateRetirementForm(
    id: number,
    updateRetirementFormDto: UpdateRetirementFormDto,
  ) {
    return `This action updates a #${id} form`;
  }

  removeAdvanceForm(id: number) {
    return `This action removes a #${id} form`;
  }

  removeRetirementForm(id: number) {
    return `This action removes a #${id} form`;
  }

  retireAdvancedForm(
    id: number,
    createRetirementFormDto: CreateRetirementFormDto,
  ) {
    return 'This action retires an advanced form';
  }
}
