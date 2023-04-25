import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AdvanceForm, Approvals, RetirementForm, User } from '../entities';
import { Role } from '../types';

import { QueryRunner } from 'typeorm';

export async function approve<Form extends AdvanceForm | RetirementForm>(
  approvalType,
  form: Form,
  approval: Approvals,
  user: User,
  queryRunner: QueryRunner,
  pd: User,
) {
  // @If this is supervisor approval
  if (approvalType === 'supervisor') {
    console.log('supervisor approval');

    try {
      form.approvalLevel = user.role;
      form.nextApprovalLevel =
        form.user.role >= Role.DeputyPD ? Role.Finance : Role.PD;
      form.pushedToFinance = form.nextApprovalLevel === Role.Finance;
      form.supervisorToken = null;
      // check if pd is delegating
      if (pd.delegated) {
        form.nextApprovalLevel = pd.delegate.role;
      }

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
  else if (approvalType === 'pd') {
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
  else if (approvalType === 'finance') {
    console.log('finance approval');

    try {
      form.approvalLevel = user.role;
      form.nextApprovalLevel = null;
      form.approvedByFin = true;
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
