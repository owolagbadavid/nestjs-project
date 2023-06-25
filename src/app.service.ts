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
import { DataSource, Repository } from 'typeorm';
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
    private dataSource: DataSource,
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
    const seeded = await this.userRepository.find();
    const seeded2 = await this.departmentRepository.find();
    const seeded3 = await this.unitRepository.find();
    if (seeded.length > 0 || seeded2.length > 0 || seeded3.length > 0) {
      return 'already seeded';
    }

    // read mock data from json files
    let department: any = await fs.readFile(
      __dirname + '/mock-data/department.json',
      'utf-8',
    );

    let user: any = await fs.readFile(
      __dirname + '/mock-data/user.json',
      'utf-8',
    );

    let unit: any = await fs.readFile(
      __dirname + '/mock-data/unit.json',
      'utf-8',
    );

    // parse the json data
    department = JSON.parse(department);

    unit = JSON.parse(unit);

    user = JSON.parse(user);

    // create entities from the parsed data
    department = this.departmentRepository.create(department);

    unit = this.unitRepository.create(unit);

    user = this.userRepository.create(user);

    // initialize the database connection
    // await this.dataSource.initialize();

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(department);

      await queryRunner.manager.save(unit);

      console.log('department and unit saved');
      user = user.map((item) => {
        item.verified = new Date(item.verified);
        return item;
      });
      await queryRunner.manager.save(user);
      console.log('users saved');
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

      await queryRunner.manager.save(department);
      await queryRunner.manager.save(unit);
      await queryRunner.manager.save(user);

      console.log('head and supervisor saved');
      let lastUser = JSON.parse(`{
      "email": "owolagbadavid@icloud.com",
      "firstName": "Mikey",
      "lastName": "Donnno",
      "isVerified": "true",
      "unitId": 1,
      "supervisorId": 24,
      "verified": "02/25/2023",
      "departmentId": 1,
      "password": "secret",
      "role": 1
    }`);
      lastUser.verified = new Date(lastUser.verified);
      lastUser = this.userRepository.create(lastUser);
      await queryRunner.manager.save(lastUser);
      console.log('last user saved, commiting transaction');

      await queryRunner.commitTransaction();
      return 'seeded';
    } catch (error) {
      queryRunner.rollbackTransaction();
      return 'seeding error';
    } finally {
      queryRunner.release();
    }
  }
}
