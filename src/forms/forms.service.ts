import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateAdvanceFormDto,
  CreateRetirementFormDto,
  UpdateAdvanceFormDto,
  UpdateRetirementFormDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AdvanceDetails,
  AdvanceForm,
  ExpenseDetails,
  RetirementForm,
  RetirementType,
  SupportingDocs,
  User,
} from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { randomBytes } from 'crypto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(AdvanceForm)
    private advanceFormRepo: Repository<AdvanceForm>,
    @InjectRepository(AdvanceDetails)
    private advanceDetailsRepo: Repository<AdvanceDetails>,
    @InjectRepository(ExpenseDetails)
    private expenseDetailsRepo: Repository<ExpenseDetails>,
    @InjectRepository(RetirementForm)
    private retirementFormRepo: Repository<RetirementForm>,
    @InjectRepository(SupportingDocs)
    private supportingDocsRepo: Repository<SupportingDocs>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}
  async createAdvanceForm(
    createAdvanceFormDto: CreateAdvanceFormDto,
    user: User,
  ) {
    const supervisor = await this.usersService.findOne(user.supervisorId);

    createAdvanceFormDto.details = createAdvanceFormDto.details.map((item) =>
      this.advanceDetailsRepo.create(item),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of createAdvanceFormDto.details) {
        await queryRunner.manager.save(item);
      }

      const advanceForm = this.advanceFormRepo.create(createAdvanceFormDto);
      advanceForm.user = user;
      advanceForm.approvalLevel = 0;
      advanceForm.nextApprovalLevel = supervisor.role;
      advanceForm.supervisorToken = randomBytes(10).toString('hex');

      await queryRunner.manager.save(advanceForm);
      //TODO: Send email notification to supervisor

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return 'Form created successfully';
  }

  async createRetirementForm(
    createRetirementFormDto: CreateRetirementFormDto,
    user: User,
    files,
  ) {
    const supervisor = await this.usersService.findOne(user.supervisorId);

    createRetirementFormDto.details = createRetirementFormDto.details.map(
      (item) => this.expenseDetailsRepo.create(item),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of createRetirementFormDto.details) {
        await queryRunner.manager.save(item);
      }

      const retirementForm = this.retirementFormRepo.create(
        createRetirementFormDto,
      );
      retirementForm.user = user;
      retirementForm.approvalLevel = 0;
      retirementForm.nextApprovalLevel = supervisor.role;
      retirementForm.supervisorToken = randomBytes(10).toString('hex');
      retirementForm.type = RetirementType.CASH;

      await queryRunner.manager.save(retirementForm);

      for (let i = 0; i <= files.length - 1; i++) {
        const doc = this.supportingDocsRepo.create({
          file: files[i].buffer,
          documentDescription: createRetirementFormDto.filesDescription[i],
          retirementForm,
        });
        await queryRunner.manager.save(doc);
      }
      console.log(createRetirementFormDto, files);

      //TODO: Send email notification to supervisor

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return 'Form created successfully';
  }

  findAllAdvanceForms() {
    return this.advanceFormRepo.find();
  }

  findAllRetirementForms() {
    return this.retirementFormRepo.find();
  }

  async findOneAdvanceForm(id: number) {
    const advanceForm = await this.advanceFormRepo.findOne({
      where: { id },
      relations: ['details'],
    });
    if (!advanceForm) throw new NotFoundException('No advance form found');
    return advanceForm;
  }

  async findOneRetirementForm(id: number) {
    const retirementForm = await this.retirementFormRepo.findOne({
      where: { id },
      relations: {
        details: true,
        supportingDocs: true,
      },
      select: {
        supportingDocs: {
          id: true,
        },
      },
    });
    if (!retirementForm)
      throw new NotFoundException('No retirement form found');
    return retirementForm;
  }

  async updateAdvanceForm(
    id: number,
    updateAdvanceFormDto: UpdateAdvanceFormDto,
  ) {
    const advanceForm = await this.advanceFormRepo.findOne({ where: { id } });
    advanceForm.supervisorToken = randomBytes(10).toString('hex');

    if (!advanceForm) throw new NotFoundException(`Advance form ${id} found`);
    return this.advanceFormRepo.save({
      ...advanceForm,
      ...updateAdvanceFormDto,
    });
  }

  async updateRetirementForm(
    id: number,
    updateRetirementFormDto: UpdateRetirementFormDto,
  ) {
    const retirementForm = await this.retirementFormRepo.findOne({
      where: { id },
    });
    retirementForm.supervisorToken = randomBytes(10).toString('hex');

    if (!retirementForm)
      throw new NotFoundException(`Retirement form ${id} found`);
    return this.retirementFormRepo.save({
      ...retirementForm,
      ...updateRetirementFormDto,
    });
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
