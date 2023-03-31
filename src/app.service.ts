import { Injectable } from '@nestjs/common';
import {
  User,
  Department,
  Unit,
  AdvanceForm,
  AdvanceDetails,
  RetirementForm,
  ExpenseDetails,
  Approvals,
  SupportingDocs,
} from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Unit) private unitRepository: Repository<Unit>,
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
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  fileUpload() {
    return 'file upload';
  }

  create() {
    return 'create it';
  }

  seed() {
    this.userRepository.create([]);
  }
}
