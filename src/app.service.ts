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
import * as fs from 'fs/promises';

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

  async seed() {
    let department: any = await fs.readFile(
      __dirname + '/mock-data/department.json',
      'utf-8',
    );

    department = JSON.parse(department);

    (department = this.departmentRepository.create(department)),
      await this.departmentRepository.save(department);

    let unit: any = await fs.readFile(
      __dirname + '/mock-data/unit.json',
      'utf-8',
    );

    unit = JSON.parse(unit);
    unit = this.unitRepository.create(unit);
    await this.unitRepository.save(unit);

    let user: any = await fs.readFile(
      __dirname + '/mock-data/user.json',
      'utf-8',
    );

    user = JSON.parse(user);

    user = this.userRepository.create(user);
    user = user.map((item) => {
      item.verified = new Date(item.verified);
      return item;
    });
    await this.userRepository.save(user);
    unit[0].head = user[1];
    unit[1].head = user[1 + 8];
    department[0].head = user[2];
    department[1].head = user[2 + 8];

    user[0].supervisor = user[1];
    user[1].supervisor = user[2];
    user[2].supervisor = user[3];
    user[3].supervisor = user[4];
    user[4].supervisor = user[5];
    user[0 + 8].supervisor = user[1 + 8];
    user[1 + 8].supervisor = user[2 + 8];
    user[user.length - 1].supervisor = user[user.length - 2];
    user[user.length - 2].supervisor = user[4];

    await this.departmentRepository.save(department);
    await this.unitRepository.save(unit);
    await this.userRepository.save(user);

    let lastUser = JSON.parse(`{
      "email": "owolagbadavid@icloud.com",
      "firstName": "Mikey",
      "lastName": "Donnno",
      "isVerified": "true",
      "unitId": 1,
      "verified": "11/21/2022",
      "departmentId": 1,
      "password": "secret",
      "role": 2
    }`);
    lastUser = this.userRepository.create(lastUser);
    await this.userRepository.save(lastUser);

    return 'seeded';
  }
}
