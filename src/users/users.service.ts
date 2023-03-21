import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Department, Unit, User } from 'src/entities';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { CreateUserDto, UpdateUserDto } from './dto';
import { SuperUserDto } from 'src/auth/dtos';
import { ApiRes } from 'src/types/api-response';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Unit) private unitRepository: Repository<Unit>,
    private mailService: MailService,
  ) {}

  // Create New User
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

  // Create Super User e.g Administrator
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
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users.map((user) => {
      return (({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        password,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        passwordToken,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        passwordTokenExpiration,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        verificationToken,
        ...rest
      }) => rest)(user);
    });
  }

  //Find One User
  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return (({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordToken,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordTokenExpiration,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      verificationToken,
      ...rest
    }) => rest)(user);
  }

  //Find One User Unfiltered
  async findOneUnfiltered(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    return user;
  }
  //Find One User by email
  async findOneUnfilteredByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  //Update User
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
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

    return (({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordToken,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordTokenExpiration,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      verificationToken,
      ...rest
    }) => rest)(user);
  }

  //Delete User
  async remove(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    return this.userRepository.remove(user);
  }
}
