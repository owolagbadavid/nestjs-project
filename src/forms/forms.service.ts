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

  // $create advance form
  async createAdvanceForm(
    createAdvanceFormDto: CreateAdvanceFormDto,
    user: User,
  ) {
    user = await this.usersService.findUserAndSupervisor(user.id);

    createAdvanceFormDto.details = createAdvanceFormDto.details.map((item) =>
      this.advanceDetailsRepo.create(item),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const advanceForm = this.advanceFormRepo.create({
        ...createAdvanceFormDto,
        user,
      });
      advanceForm.supervisorToken = randomBytes(10).toString('hex');
      // TODO: send token to supervisor

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

  // $create retirement form
  async createRetirementForm(
    createRetirementFormDto: CreateRetirementFormDto,
    user: User,
    files,
  ) {
    const supportingDocs: SupportingDocs[] = [];
    user = await this.usersService.findUserAndSupervisor(user.id);

    createRetirementFormDto.details = createRetirementFormDto.details.map(
      (item) => this.expenseDetailsRepo.create(item),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i <= files.length - 1; i++) {
        supportingDocs.push(
          this.supportingDocsRepo.create({
            file: files[i].buffer,
            documentDescription: createRetirementFormDto.filesDescription[i],
          }),
        );
      }
      const retirementForm = this.retirementFormRepo.create({
        ...createRetirementFormDto,
        user,
        supportingDocs,
      });
      retirementForm.type = RetirementType.CASH;
      retirementForm.supervisorToken = randomBytes(10).toString('hex');
      // TODO: send token to supervisor

      await queryRunner.manager.save(retirementForm);

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
  // $find all advance forms
  findAllAdvanceForms() {
    return this.advanceFormRepo.find();
  }
  // $find all retirement forms
  findAllRetirementForms() {
    return this.retirementFormRepo.find();
  }
  // $find one advance form with its details
  async findOneAdvanceForm(id: number) {
    const advanceForm = await this.advanceFormRepo.findOne({
      where: { id },
      relations: {
        details: true,
      },
    });
    if (!advanceForm) throw new NotFoundException('No advance form found');
    return advanceForm;
  }
  // $find one retirement form with its details and supporting documents
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
  // $update advance form
  async updateAdvanceForm(
    id: number,
    updateAdvanceFormDto: UpdateAdvanceFormDto,
    user: User,
  ) {
    user = await this.usersService.findUserAndSupervisor(user.id);

    let advanceForm = await this.advanceFormRepo.findOne({
      where: { id },
    });

    if (!advanceForm) throw new NotFoundException(`Advance form ${id} found`);

    advanceForm = this.advanceFormRepo.create({
      ...advanceForm,
      ...updateAdvanceFormDto,
      user,
    });
    advanceForm.supervisorToken = randomBytes(10).toString('hex');
    // TODO: send token to supervisor
    console.log(advanceForm);

    return this.advanceFormRepo.save(advanceForm);

    //TODO: Send email notification to supervisor
  }
  // $update retirement form
  async updateRetirementForm(
    id: number,
    updateRetirementFormDto: UpdateRetirementFormDto,
    files,
    user: User,
  ) {
    user = await this.usersService.findUserAndSupervisor(user.id);
    const supportingDocs: SupportingDocs[] = [];

    let retirementForm = await this.retirementFormRepo.findOne({
      where: { id },
    });

    if (!retirementForm)
      throw new NotFoundException(`Retirement form ${id} found`);

    for (let i = 0; i <= files.length - 1; i++) {
      supportingDocs.push(
        this.supportingDocsRepo.create({
          file: files[i].buffer,
          documentDescription: updateRetirementFormDto.filesDescription[i],
        }),
      );
    }

    retirementForm = this.retirementFormRepo.create({
      ...retirementForm,
      ...updateRetirementFormDto,
      user,
      supportingDocs,
    });
    retirementForm.supervisorToken = randomBytes(10).toString('hex');
    // TODO: send token to supervisor
    console.log(retirementForm);

    return this.retirementFormRepo.save(retirementForm);

    //TODO: Send email notification to supervisor
  }

  removeAdvanceForm(id: number) {
    return `This action removes a #${id} form`;
  }

  removeRetirementForm(id: number) {
    return `This action removes a #${id} form`;
  }
  // $retire an advance (create an advance retirement form)
  async retireAdvancedForm(
    id: number,
    createRetirementFormDto: CreateRetirementFormDto,
    user: User,
    files,
  ) {
    const supportingDocs: SupportingDocs[] = [];
    user = await this.usersService.findUserAndSupervisor(user.id);
    const advance = await this.findOneAdvanceForm(id);

    createRetirementFormDto.details = createRetirementFormDto.details.map(
      (item) => this.expenseDetailsRepo.create(item),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i <= files.length - 1; i++) {
        supportingDocs.push(
          this.supportingDocsRepo.create({
            file: files[i].buffer,
            documentDescription: createRetirementFormDto.filesDescription[i],
          }),
        );
      }
      const retirementForm = this.retirementFormRepo.create({
        ...createRetirementFormDto,
        user,
        supportingDocs,
      });
      retirementForm.advance = advance;
      retirementForm.type = RetirementType.ADVANCE;
      retirementForm.supervisorToken = randomBytes(10).toString('hex');
      // TODO: send token to supervisor

      await queryRunner.manager.save(retirementForm);

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
}
