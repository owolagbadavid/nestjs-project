import { InternalServerErrorException } from '@nestjs/common';
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
    form.nextApprovalLevel === Role.PD ||
    (form.nextApprovalLevel === Role.PD && form.delegatedByPD)
  ) {
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
  else if (form.pushedToFinance && form.nextApprovalLevel === Role.Finance) {
    try {
      form.approvalLevel = user.role;
      form.nextApprovalLevel = null;

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
}