import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  AdvanceForm,
  Approvals,
  RetirementForm,
  Role,
  User,
} from 'src/entities';
import { QueryRunner } from 'typeorm';

export async function approve<Form extends AdvanceForm | RetirementForm>(
  form: Form,
  approval: Approvals,
  user: User,
  queryRunner: QueryRunner,
) {
  // @If this is supervisor approval
  if (
    form.approvalLevel === 0 &&
    form.nextApprovalLevel === user.role &&
    form.user.supervisorId === user.id
  ) {
    console.log('supervisor approval');

    try {
      form.approvalLevel = user.role;
      form.nextApprovalLevel =
        form.approvalLevel >= Role.PD ? Role.Finance : Role.PD;
      form.pushedToFinance = form.nextApprovalLevel === Role.Finance;
      await queryRunner.manager.save(form);
      await queryRunner.manager.save(approval);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // @since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }
  }
  // @If this is PD approval
  else if (
    (user.role === Role.PD &&
      form.nextApprovalLevel === Role.PD &&
      form.approvalLevel > 0) ||
    (form.nextApprovalLevel === Role.PD &&
      form.delegatedByPD &&
      user.role === Role.DeputyPD &&
      form.approvalLevel > 0)
  ) {
    console.log('pd approval');

    try {
      form.approvalLevel = user.role;
      form.nextApprovalLevel = Role.Finance;
      form.pushedToFinance = form.nextApprovalLevel === Role.Finance;
      await queryRunner.manager.save(form);
      await queryRunner.manager.save(approval);
      // @commit changes to the database
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // @since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }
  }
  // @If this is finance approval
  else if (
    form.pushedToFinance &&
    form.nextApprovalLevel === Role.Finance &&
    user.role === Role.Finance
  ) {
    console.log('finance approval');

    try {
      form.approvalLevel = user.role;
      form.nextApprovalLevel = null;
      form.remarkByFin = approval.remark;

      await queryRunner.manager.save(form);
      await queryRunner.manager.save(approval);
      // @commit changes to the database
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // @since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }
  } else {
    throw new ForbiddenException();
  }
}
