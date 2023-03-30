import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  ApprovalOrRejectionDto,
  AdvanceFormDto,
  RetirementFormDto,
  FilterDto,
  RelationDto,
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
  Approvals,
  ApprovalsFor,
  SerializedAdvanceForm,
  SerializedRetirementForm,
  Role,
} from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { randomBytes } from 'crypto';
import { reject, approve, setDefaults } from 'src/utils';
import {
  checkBalance,
  compareAdvanceNRetirement,
  compareDetailsAmount,
  compareDetailsNTotalAmount,
} from 'src/utils/form-checker';

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
    @InjectRepository(Approvals) private approvalsRepo: Repository<Approvals>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  // $create advance form
  async createAdvanceForm(createAdvanceFormDto: AdvanceFormDto, user: User) {
    // user = await this.usersService.findUserAndSupervisor(user.id);

    // @checks if details and total amount are correct
    if (
      !(
        compareDetailsAmount(createAdvanceFormDto.details) &&
        compareDetailsNTotalAmount(createAdvanceFormDto)
      )
    )
      throw new BadRequestException('Details do not add up');

    // @Make the details instance of advance details
    createAdvanceFormDto.details = createAdvanceFormDto.details.map((item) =>
      this.advanceDetailsRepo.create(item),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let advanceForm = this.advanceFormRepo.create({
      ...createAdvanceFormDto,
      user,
    });
    advanceForm.supervisorToken = randomBytes(10).toString('hex');
    // TODO: send token to supervisor
    advanceForm = setDefaults(advanceForm);
    try {
      await queryRunner.manager.save(advanceForm);

      //TODO: Send email notification to supervisor

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // @since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      // @you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return 'Form created successfully';
  }

  // $create retirement form
  async createRetirementForm(
    createRetirementFormDto: RetirementFormDto,
    user: User,
    files: Express.Multer.File[],
  ) {
    // @checks if details and total amount are correct
    if (
      !(
        compareDetailsAmount(createRetirementFormDto.details) &&
        compareDetailsNTotalAmount(createRetirementFormDto)
      )
    )
      throw new BadRequestException('Details do not add up');

    checkBalance(
      createRetirementFormDto.totalAmount,
      createRetirementFormDto.balanceToStaff,
    );
    createRetirementFormDto.balanceToOrganization = 0;

    const supportingDocs: SupportingDocs[] = [];
    // user = await this.usersService.findUserAndSupervisor(user.id);

    // @Make the details instance of advance details
    createRetirementFormDto.details = createRetirementFormDto.details.map(
      (item) => this.expenseDetailsRepo.create(item),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    // @make the files instance of supportingDocs
    for (let i = 0; i <= files.length - 1; i++) {
      supportingDocs.push(
        this.supportingDocsRepo.create({
          file: files[i].buffer,
          documentDescription: createRetirementFormDto.filesDescription[i],
          fileName: files[i].originalname,
          encoding: files[i].encoding,
          mimeType: files[i].mimetype,
        }),
      );
    }
    let retirementForm = this.retirementFormRepo.create({
      ...createRetirementFormDto,
      user,
      supportingDocs,
    });
    retirementForm.type = RetirementType.CASH;
    retirementForm.supervisorToken = randomBytes(10).toString('hex');
    // TODO: send token to supervisor
    retirementForm = setDefaults(retirementForm);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(retirementForm);

      //TODO: Send email notification to supervisor

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // @since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      // @you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return 'Form created successfully';
  }
  // $find all advance forms
  async findAllAdvanceForms(filterDto: FilterDto) {
    const advanceForms = await this.advanceFormRepo.find({
      where: { ...filterDto },
    });

    return advanceForms.map((form) => new SerializedAdvanceForm(form));
  }
  // $find all retirement forms
  async findAllRetirementForms(filterDto: FilterDto) {
    const retirementForms = await this.retirementFormRepo.find({
      where: { ...filterDto },
    });

    return retirementForms.map((form) => new SerializedRetirementForm(form));
  }
  // $find one advance form with its details
  async findOneAdvanceForm(id: number, relationDto: RelationDto) {
    const advanceForm = await this.advanceFormRepo.findOne({
      where: { id },
      relations: {
        details: true,
        ...relationDto,
      },
    });
    if (!advanceForm) throw new NotFoundException('No advance form found');
    return new SerializedAdvanceForm(advanceForm);
  }
  // $find one retirement form with its details and supporting documents
  async findOneRetirementForm(id: number, relationDto: RelationDto) {
    const retirementForm = await this.retirementFormRepo.findOne({
      where: { id },
      relations: {
        details: true,
        supportingDocs: true,
        advance: true,
        ...relationDto,
      },
      select: {
        supportingDocs: {
          id: true,
        },
      },
    });
    if (!retirementForm)
      throw new NotFoundException('No retirement form found');

    return new SerializedRetirementForm(retirementForm);
  }
  // $update advance form
  async updateAdvanceForm(
    id: number,
    updateAdvanceFormDto: AdvanceFormDto,
    user: User,
  ) {
    // user = await this.usersService.findUserAndSupervisor(user.id);

    // @checks if details and total amount are correct
    if (
      !(
        compareDetailsAmount(updateAdvanceFormDto.details) &&
        compareDetailsNTotalAmount(updateAdvanceFormDto)
      )
    )
      throw new BadRequestException('Details do not add up');

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
    advanceForm = setDefaults(advanceForm);
    // TODO: send token to supervisor

    return this.advanceFormRepo.save(advanceForm);

    //TODO: Send email notification to supervisor
  }
  // $update retirement form
  async updateRetirementForm(
    id: number,
    updateRetirementFormDto: RetirementFormDto,
    files: Express.Multer.File[],
    user: User,
  ) {
    // user = await this.usersService.findUserAndSupervisor(user.id);

    // @checks if details and total amount are correct
    if (
      !(
        compareDetailsAmount(updateRetirementFormDto.details) &&
        compareDetailsNTotalAmount(updateRetirementFormDto)
      )
    )
      throw new BadRequestException('Details do not add up');

    const supportingDocs: SupportingDocs[] = [];

    let retirementForm = await this.retirementFormRepo.findOne({
      where: { id },
    });

    if (retirementForm.advance) {
      const balance = compareAdvanceNRetirement(
        retirementForm.advance,
        updateRetirementFormDto,
      );

      if (balance < 0) {
        checkBalance(Math.abs(balance), updateRetirementFormDto.balanceToStaff);
        updateRetirementFormDto.balanceToOrganization = 0;
      } else {
        checkBalance(balance, updateRetirementFormDto.balanceToOrganization);
        updateRetirementFormDto.balanceToStaff = 0;
      }
    } else {
      checkBalance(
        updateRetirementFormDto.totalAmount,
        updateRetirementFormDto.balanceToStaff,
      );
      updateRetirementFormDto.balanceToOrganization = 0;
    }

    if (!retirementForm)
      throw new NotFoundException(`Retirement form ${id} found`);

    // @make files instances of supportingDocs
    for (let i = 0; i <= files.length - 1; i++) {
      supportingDocs.push(
        this.supportingDocsRepo.create({
          file: files[i].buffer,
          documentDescription: updateRetirementFormDto.filesDescription[i],
          fileName: files[i].originalname,
          encoding: files[i].encoding,
          mimeType: files[i].mimetype,
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
    retirementForm = setDefaults(retirementForm);
    // TODO: send token to supervisor

    return this.retirementFormRepo.save(retirementForm);

    //TODO: Send email notification to supervisor
  }
  // $delete advance from
  async removeAdvanceForm(id: number) {
    const form = await this.advanceFormRepo.findOne({ where: { id } });
    if (!form) throw new NotFoundException(`Advance form ${id} not found`);

    return this.advanceFormRepo.remove(form);
  }
  // $delete retirement from
  async removeRetirementForm(id: number) {
    const form = await this.retirementFormRepo.findOne({
      where: { id },
    });
    if (!form) throw new NotFoundException(`Retirement form ${id} not found`);

    return this.retirementFormRepo.remove(form);
  }
  // $retire an advance (create an advance retirement form)
  async retireAdvancedForm(
    id: number,
    createRetirementFormDto: RetirementFormDto,
    user: User,
    files: Express.Multer.File[],
  ) {
    const supportingDocs: SupportingDocs[] = [];
    // user = await this.usersService.findUserAndSupervisor(user.id);

    const advance = await this.findOneAdvanceForm(id, {});

    // @checks if details and total amount are correct
    if (
      !(
        compareDetailsAmount(createRetirementFormDto.details) &&
        compareDetailsNTotalAmount(createRetirementFormDto)
      )
    )
      throw new BadRequestException('Details do not add up');
    const balance = compareAdvanceNRetirement(advance, createRetirementFormDto);

    if (balance < 0) {
      checkBalance(Math.abs(balance), createRetirementFormDto.balanceToStaff);
      createRetirementFormDto.balanceToOrganization = 0;
    } else {
      checkBalance(balance, createRetirementFormDto.balanceToOrganization);
      createRetirementFormDto.balanceToStaff = 0;
    }

    createRetirementFormDto.details = createRetirementFormDto.details.map(
      (item) => this.expenseDetailsRepo.create(item),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    for (let i = 0; i <= files.length - 1; i++) {
      supportingDocs.push(
        this.supportingDocsRepo.create({
          file: files[i].buffer,
          documentDescription: createRetirementFormDto.filesDescription[i],
          fileName: files[i].originalname,
          encoding: files[i].encoding,
          mimeType: files[i].mimetype,
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

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
  // $approve advance form
  async approveAdvance(
    id: number,
    user: User,
    approvalDto: ApprovalOrRejectionDto,
  ) {
    const advance = await this.advanceFormRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const approval = this.approvalsRepo.create({
      ...approvalDto,
      approvedBy: user,
      advanceApproved: advance,
      level: user.role,
      type: ApprovalsFor.ADVANCE,
    });

    // @handles all types of approval(supervisor, pd, finance)
    await approve(advance, approval, user, queryRunner);

    //! console.log
    console.log(advance);

    return 'approve advance form';
  }
  // $approve retirement form
  async approveRetirement(
    id: number,
    user: User,
    approvalDto: ApprovalOrRejectionDto,
  ) {
    const retirement = await this.retirementFormRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const approval = this.approvalsRepo.create({
      ...approvalDto,
      approvedBy: user,
      advanceApproved: retirement,
      level: user.role,
      type: ApprovalsFor.RETIREMENT,
    });

    // @handles all types of approval(supervisor, pd, finance)
    await approve(retirement, approval, user, queryRunner);

    // !console.log
    console.log(retirement);
    return 'approve Retirement form';
  }

  // $reject advance form
  async rejectAdvance(
    id: number,
    user: User,
    rejectionDto: ApprovalOrRejectionDto,
  ) {
    let advance = await this.advanceFormRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    // @handles reject for all levels
    advance = await reject(advance, user, rejectionDto);

    return this.advanceFormRepo.save(advance);
  }

  // $reject retirement form
  async rejectRetirement(
    id: number,
    user: User,
    rejectionDto: ApprovalOrRejectionDto,
  ) {
    let retirement = await this.retirementFormRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    // @handles reject for all levels
    retirement = await reject(retirement, user, rejectionDto);

    return this.retirementFormRepo.save(retirement);
  }

  // $get all directReports advance forms(can take a filter query)
  async getMyDirectReportsAdvanceForms(user: User, filterDto: FilterDto) {
    const advanceForms = await this.advanceFormRepo.find({
      where: { user: { supervisorId: user.id }, ...filterDto },
    });

    return advanceForms.map((form) => new SerializedAdvanceForm(form));
  }

  // $get all directReports retirement forms(can take a filter query)
  async getMyDirectReportsRetirementForms(user: User, filterDto: FilterDto) {
    const retirementForms = await this.retirementFormRepo.find({
      where: { user: { supervisorId: user.id }, ...filterDto },
    });

    return retirementForms.map((form) => new SerializedRetirementForm(form));
  }

  // $finance preApproval remark
  async advanceRemark(id: number, remark: string) {
    const advance = await this.findOneAdvanceForm(id, { user: true });

    advance.preApprovalRemarkByFinance = remark;

    await this.advanceFormRepo.save(advance);
    // TODO: send notification to user

    return;
  }

  // $finance preApproval remark
  async retirementRemark(id: number, remark: string) {
    const retirement = await this.findOneRetirementForm(id, { user: true });

    retirement.preApprovalRemarkByFinance = remark;

    await this.retirementFormRepo.save(retirement);
    // TODO: send notification to user

    return;
  }

  // $pd delegates to Deputy
  async delegateAdvanceApproval(id: number) {
    const advance = await this.findOneAdvanceForm(id, {
      user: true,
      nextApproalLevel: Role.PD,
    });
    advance.delegatedByPD = true;
    advance.nextApprovalLevel = Role.DeputyPD;

    await this.advanceFormRepo.save(advance);

    return;
  }

  // $pd delegates to Deputy
  async delegateRetirementApproval(id: number) {
    const retirement = await this.findOneRetirementForm(id, {
      user: true,
      nextApproalLevel: Role.PD,
    });
    retirement.delegatedByPD = true;
    retirement.nextApprovalLevel = Role.DeputyPD;

    await this.retirementFormRepo.save(retirement);

    return;
  }
}
