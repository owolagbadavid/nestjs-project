import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  ApprovalOrRejectionDto,
  AdvanceFormDto,
  RetirementFormDto,
  FormFilterDto,
  FormRelationDto,
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
} from '../entities';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { randomBytes } from 'crypto';
import {
  reject,
  approve,
  setDefaults,
  checkBalance,
  compareAdvanceNRetirement,
  compareDetailsAmount,
  compareDetailsNTotalAmount,
} from '../utils';
import { FormType, Role } from '../types';
import { MailService } from '../mail/mail.service';

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
    private mailService: MailService,
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
    const staffName = `${user.firstName} ${user.lastName}`;

    advanceForm = setDefaults(advanceForm);
    try {
      await queryRunner.manager.save(advanceForm);

      //TODO: Send email notification to supervisor

      await this.mailService.sendSupervisorToken(
        user.supervisor,
        staffName,
        advanceForm,
        FormType.ADVANCE,
      );

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
  async findAllAdvanceForms(formFilterDto: FormFilterDto) {
    const advanceForms = await this.advanceFormRepo.find({
      where: { ...formFilterDto },
    });

    return advanceForms.map((form) => new SerializedAdvanceForm(form));
  }
  // $find all retirement forms
  async findAllRetirementForms(formFilterDto: FormFilterDto) {
    const retirementForms = await this.retirementFormRepo.find({
      where: { ...formFilterDto },
    });

    return retirementForms.map((form) => new SerializedRetirementForm(form));
  }
  // $find one advance form with its details
  async findOneAdvanceForm(
    id: number,
    relationDto: FormRelationDto,
    form?: AdvanceForm,
  ) {
    if (form) return new SerializedAdvanceForm(form);

    const advanceForm = await this.advanceFormRepo.findOne({
      where: { id },
      relations: {
        details: true,
        ...relationDto,
      },
    });

    // const agg = await this.advanceFormRepo.query(
    //   `
    //   SELECT date_part('month', "updatedAt") AS month, COUNT(*) AS count
    //   FROM advance_form
    //   GROUP BY month;

    //   `,
    // );
    // console.log(agg);
    // console.log('mike');

    if (!advanceForm) throw new NotFoundException('No advance form found');
    return new SerializedAdvanceForm(advanceForm);
  }
  // $find one retirement form with its details and supporting documents
  async findOneRetirementForm(
    id: number,
    relationDto: FormRelationDto,
    form?: RetirementForm,
  ) {
    if (form) return new SerializedRetirementForm(form);

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
          fileName: true,
          documentDescription: true,
          mimeType: true,
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
    form?: AdvanceForm,
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

    // @Already Fetched from Guard
    let advanceForm = form;

    if (!advanceForm) throw new NotFoundException(`Advance form ${id} found`);

    if (advanceForm.approvedByFin)
      throw new ForbiddenException('Form has already been approved');

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
    form?: RetirementForm,
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
    // @Already Fetched from Guard
    let retirementForm = form;

    if (!retirementForm) throw new NotFoundException('Form not found');

    if (retirementForm.approvedByFin)
      throw new ForbiddenException('Form has already been approved');

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
    form: AdvanceForm,
  ) {
    const supportingDocs: SupportingDocs[] = [];
    // user = await this.usersService.findUserAndSupervisor(user.id);
    // @fetched from guard
    const advance = form;
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
    if (!advance) throw new NotFoundException('Form not found');

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
    await approve(advance, approval, user, queryRunner, approvalDto.token);

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

    if (!retirement) throw new NotFoundException('Form not found');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const approval = this.approvalsRepo.create({
      ...approvalDto,
      approvedBy: user,
      retirementApproved: retirement,
      level: user.role,
      type: ApprovalsFor.RETIREMENT,
    });

    // @handles all types of approval(supervisor, pd, finance)
    await approve(retirement, approval, user, queryRunner, approvalDto.token);

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

    if (!advance) throw new NotFoundException('Form not found');

    // @handles reject for all levels
    advance = await reject(advance, user, rejectionDto);
    await this.advanceFormRepo.save(advance);
    return;
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

    if (!retirement) throw new NotFoundException('Form not found');

    // @handles reject for all levels
    retirement = await reject(retirement, user, rejectionDto);

    await this.retirementFormRepo.save(retirement);
    return;
  }

  // $get all directReports advance forms(can take a filter query)
  async getMyDirectReportsAdvanceForms(
    user: User,
    formFilterDto: FormFilterDto,
  ) {
    const advanceForms = await this.advanceFormRepo.find({
      where: { user: { supervisorId: user.id }, ...formFilterDto },
    });

    return advanceForms.map((form) => new SerializedAdvanceForm(form));
  }

  // $get all directReports retirement forms(can take a filter query)
  async getMyDirectReportsRetirementForms(
    user: User,
    formFilterDto: FormFilterDto,
  ) {
    const retirementForms = await this.retirementFormRepo.find({
      where: { user: { supervisorId: user.id }, ...formFilterDto },
    });

    return retirementForms.map((form) => new SerializedRetirementForm(form));
  }

  // $finance preApproval remark
  async advanceRemark(id: number, remark: string, financeGoAhead: boolean) {
    const advance = await this.findOneAdvanceForm(id, { user: true });

    advance.preApprovalRemarkByFinance = remark;
    advance.financeGoAhead = financeGoAhead;

    await this.advanceFormRepo.save(advance);
    // TODO: send notification to user

    return;
  }

  // $finance preApproval remark
  async retirementRemark(id: number, remark: string, financeGoAhead: boolean) {
    const retirement = await this.findOneRetirementForm(id, { user: true });

    retirement.preApprovalRemarkByFinance = remark;
    retirement.financeGoAhead = financeGoAhead;

    await this.retirementFormRepo.save(retirement);
    // TODO: send notification to user

    return;
  }

  // $pd delegates to Deputy
  async delegateAdvanceApproval(id: number) {
    let advance = await this.findOneAdvanceForm(id, {
      user: true,
    });

    advance =
      advance.nextApprovalLevel === Role.PD && advance.approvalLevel !== 0
        ? advance
        : null;

    if (!advance) throw new ForbiddenException('Cant delegate approval');

    advance.delegatedByPD = true;
    advance.nextApprovalLevel = Role.DeputyPD;

    await this.advanceFormRepo.save(advance);

    return;
  }

  // $pd delegates to Deputy
  async delegateRetirementApproval(id: number) {
    let retirement = await this.findOneRetirementForm(id, {
      user: true,
    });

    retirement =
      retirement.nextApprovalLevel === Role.PD && retirement.approvalLevel !== 0
        ? retirement
        : null;

    if (!retirement) throw new ForbiddenException('Cant delegate approval');

    retirement.delegatedByPD = true;
    retirement.nextApprovalLevel = Role.DeputyPD;

    await this.retirementFormRepo.save(retirement);

    return;
  }
}
