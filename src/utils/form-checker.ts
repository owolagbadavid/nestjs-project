import { BadRequestException } from '@nestjs/common';
import { AdvanceForm } from 'src/entities';
import {
  AdvanceDetailsDto,
  AdvanceFormDto,
  ExpenseDetailsDto,
  RetirementFormDto,
} from 'src/forms/dto';

export function compareDetailsNTotalAmount(
  form: AdvanceFormDto | RetirementFormDto,
) {
  const totalAmount = form.totalAmount;

  const amountFromDetails = form.details.reduce((acc, detail) => {
    return acc + detail.rate * detail.number;
  }, 0);

  return totalAmount === amountFromDetails;
}

export function compareDetailsAmount(
  details: (ExpenseDetailsDto | AdvanceDetailsDto)[],
) {
  return details.every(
    (detail) => detail.amount === detail.number * detail.rate,
  );
}

export function compareAdvanceNRetirement(
  advanceForm: AdvanceForm,
  retirementForm: RetirementFormDto,
) {
  return advanceForm.totalAmount - retirementForm.totalAmount;
}

export function checkBalance(calculatedBalance: number, userBalance: number) {
  if (calculatedBalance !== userBalance)
    throw new BadRequestException('Balance is incorrect');
}
