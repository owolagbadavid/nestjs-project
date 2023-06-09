import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  Department,
  ProfilePicture,
  SerializedUser,
  Unit,
  User,
} from '../entities';
import {
  DataSource,
  FindManyOptions,
  LessThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { randomBytes } from 'crypto';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from './dto';
import { SuperUserDto } from '../auth/dtos';
import { ApiRes } from '../types/api-response';
import { MailService } from '../mail/mail.service';
import { FormsService } from '../forms/forms.service';
import { FormType, Role } from '../types';
import { UserRelationDto } from './dto/user-relation.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Unit) private unitRepository: Repository<Unit>,
    @InjectRepository(ProfilePicture)
    private profilePictureRepository: Repository<ProfilePicture>,
    private mailService: MailService,
    private formsService: FormsService,
    private dataSource: DataSource,
  ) {}

  // $Create New User
  async create(createUserDto: CreateUserDto) /*: Promise<ApiRes>*/ {
    const emailAlreadyExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (emailAlreadyExists) {
      throw new BadRequestException('email already exists');
    }

    const verificationToken = randomBytes(40).toString('hex');
    const user = this.userRepository.create({
      ...createUserDto,
      verificationToken,
    });

    const { supervisorId, unitId, departmentId } = createUserDto;
    if (supervisorId) {
      const supervisor = await this.userRepository.findOne({
        where: { id: supervisorId },
      });

      if (!supervisor)
        throw new BadRequestException(
          `Supervisor ${supervisorId} does not exist`,
        );

      user.supervisor = supervisor;
    }
    if (departmentId) {
      const department = await this.departmentRepository.findOne({
        where: { id: departmentId },
      });

      if (!department)
        throw new BadRequestException(
          `Department ${departmentId} does not exist`,
        );
      user.department = department;
    }

    if (unitId) {
      const unit = await this.unitRepository.findOne({
        where: { id: unitId },
      });

      if (!unit) throw new BadRequestException(`Unit ${unitId} does not exist`);

      user.unit = unit;
    }
    await this.userRepository.save(user);

    // send email to the user
    await this.mailService.sendUserConfirmation(user, verificationToken);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Please check your email to verify your account',
      verificationToken,
    };
  }

  // $Create Super User e.g Administrator
  async createSuperUser(superUserDto: SuperUserDto): Promise<ApiRes> {
    const emailAlreadyExists = await this.userRepository.findOne({
      where: { email: superUserDto.email },
    });

    if (emailAlreadyExists) {
      throw new BadRequestException('email already exists');
    }

    const isVerified = true;
    const verified = new Date();

    const details = { isVerified, verified };

    const user = this.userRepository.create({
      ...superUserDto,
      ...details,
    });

    const { supervisorId, unitId, departmentId } = superUserDto;
    if (supervisorId) {
      const supervisor = await this.userRepository.findOne({
        where: { id: supervisorId },
      });

      if (!supervisor)
        throw new BadRequestException(
          `Supervisor ${supervisorId} does not exist`,
        );

      user.supervisor = supervisor;
    }
    if (departmentId) {
      const department = await this.departmentRepository.findOne({
        where: { id: departmentId },
      });

      if (!department)
        throw new BadRequestException(
          `Department ${departmentId} does not exist`,
        );
      user.department = department;
    }

    if (unitId) {
      const unit = await this.unitRepository.findOne({
        where: { id: unitId },
      });

      if (!unit) throw new BadRequestException(`Unit ${unitId} does not exist`);

      user.unit = unit;
    }

    await this.userRepository.save(user);

    // send email to the user

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Account created successfully',
    };
  }

  //Find All Users
  async findAll(filterDto: UserFilterDto): Promise<User[]> {
    const filter: FindManyOptions<User> = { where: [{}, {}] };
    if (filterDto.role || filterDto.role === 0) {
      (filter.where[0] as any).role = MoreThanOrEqual(filterDto.role);
      (filter.where[1] as any).role = MoreThanOrEqual(filterDto.role);
    }
    if (filterDto.dept) {
      this.departmentRepository.findOne({ where: { id: filterDto.dept } });
      (filter.where[1] as any).departmentId = filterDto.dept;
    }
    if (filterDto.unit) {
      this.unitRepository.findOne({ where: { id: filterDto.unit } });
      (filter.where[1] as any).unitId = filterDto.unit;
    }
    console.log(filter, filterDto);
    const users = await this.userRepository.find({
      ...filter,
    });

    return users.map((user) => {
      return new SerializedUser(user);
      //  (({
      //   password,
      //   passwordToken,
      //   passwordTokenExpiration,
      //   verificationToken,
      //   ...rest
      // }) => rest)(user);
    });
  }

  //Find One User
  async findOne(id: number, relationDto: UserRelationDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { ...relationDto },
    });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return new SerializedUser(user);
    // (({
    //   password,
    //   passwordToken,
    //   passwordTokenExpiration,
    //   verificationToken,
    //   ...rest
    // }) => rest)(user);
  }

  async getMe(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return new SerializedUser(user);
  }

  //Find One User by email
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  //Update User
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<SerializedUser> {
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    const { supervisorId, unitId, departmentId } = updateUserDto;
    if (supervisorId) {
      const supervisor = await this.userRepository.findOne({
        where: { id: supervisorId },
      });

      if (!supervisor)
        throw new BadRequestException(
          `Supervisor ${supervisorId} does not exist`,
        );

      user.supervisor = supervisor;
    }
    if (departmentId) {
      const department = await this.departmentRepository.findOne({
        where: { id: departmentId },
      });

      if (!department)
        throw new BadRequestException(
          `Department ${departmentId} does not exist`,
        );
      user.department = department;
    }

    if (unitId) {
      const unit = await this.unitRepository.findOne({
        where: { id: unitId },
      });

      if (!unit) throw new BadRequestException(`Unit ${unitId} does not exist`);

      user.unit = unit;
    }

    user = await this.userRepository.save({ ...user, ...updateUserDto });

    return new SerializedUser(user);
  }

  //Delete User
  async remove(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    return this.userRepository.remove(user);
  }

  //$ find staff
  async findStaff(role: Role) {
    const users = await this.userRepository.find({
      where: { role },
      relations: { delegate: true },
    });
    return users.map((user) => new SerializedUser(user));
  }

  //$ delegate all user tasks to another user
  async delegateUser(user: User, delegateId: number) {
    //find user

    const delegate = await this.findOne(delegateId, {});
    user.delegated = true;
    user = this.userRepository.create({ ...user });
    user.delegate = delegate;
    //find all advance forms linked to the user
    let advanceForms = await this.formsService.findAllAdvanceForms(
      {
        nextApprovalLevel: LessThan(user.role),
      },
      { user: true },
    );

    //find all retirement forms linked to the user
    let retirementForms = await this.formsService.findAllRetirementForms(
      {
        nextApprovalLevel: LessThan(user.role),
      },
      { user: true },
    );

    if (user.role < 3) {
      advanceForms = advanceForms.filter(
        (form) => form.user.supervisorId === user.id,
      );

      retirementForms = retirementForms.filter(
        (form) => form.user.supervisorId === user.id,
      );
    }
    advanceForms = advanceForms.map((form) =>
      this.formsService.createFormEntity(FormType.ADVANCE, form),
    );
    retirementForms = retirementForms.map((form) =>
      this.formsService.createFormEntity(FormType.RETIREMENT, form),
    );

    advanceForms.forEach((form) => (form.nextApprovalLevel = delegate.role));
    retirementForms.forEach((form) => (form.nextApprovalLevel = delegate.role));

    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(advanceForms);
      await queryRunner.manager.save(retirementForms);
      // queryRunner.manager.save(delegate);
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (error) {
      // @since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      // @you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  //$ undelegate a user
  async undelegateUser(user: User) {
    //find user

    user.delegated = false;
    user.delegate.delegator = null;
    user.delegate = null;
    user = this.userRepository.create({ ...user });

    //find all advance forms linked to the user
    let advanceForms = await this.formsService.findAllAdvanceForms(
      {
        nextApprovalLevel: LessThan(user.role),
      },
      { user: true },
    );

    //find all retirement forms linked to the user
    let retirementForms = await this.formsService.findAllRetirementForms(
      {
        nextApprovalLevel: LessThan(user.role),
      },
      { user: true },
    );

    if (user.role < 3) {
      advanceForms = advanceForms.filter(
        (form) => form.user.supervisorId === user.id,
      );

      retirementForms = retirementForms.filter(
        (form) => form.user.supervisorId === user.id,
      );
    }
    advanceForms = advanceForms.map((form) =>
      this.formsService.createFormEntity(FormType.ADVANCE, form),
    );
    retirementForms = retirementForms.map((form) =>
      this.formsService.createFormEntity(FormType.RETIREMENT, form),
    );

    advanceForms.forEach((form) => (form.nextApprovalLevel = user.role));
    retirementForms.forEach((form) => (form.nextApprovalLevel = user.role));

    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(advanceForms);
      await queryRunner.manager.save(retirementForms);
      // queryRunner.manager.save(delegate);
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (error) {
      // @since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      // @you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  // upload profile picture
  async uploadProfilePicture(user: User, file: Express.Multer.File) {
    // check if it is a valid image
    if (!file.mimetype.startsWith('image'))
      throw new BadRequestException('Invalid image file');

    // make the picture an instance of ProfilePicture Entity
    const profilePicture = this.profilePictureRepository.create({
      fileName: file.filename,
      mimeType: file.mimetype,
      encoding: file.encoding,
      file: file.buffer,
      user,
    });

    // update user profile picture
    await this.userRepository.save({ ...user, profilePicture });
  }
}
