import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../entities';
import { ApiRes, Role } from '../types';
import { JwtGuard, RolesGuard, RolesOrIdGuard } from '../auth/guards';
import { Roles } from '../decorators';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
@ApiCookieAuth('cookie')
@ApiUnauthorizedResponse({ type: ApiRes })
@ApiForbiddenResponse({ type: ApiRes })
@Roles(Role.Admin)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Post /
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: ApiRes })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<ApiRes> {
    return this.usersService.create(createUserDto);
  }

  //Get /
  @ApiOkResponse({ type: User, isArray: true })
  @UseGuards(RolesGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //Get /:id
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesOrIdGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(+id);
  }

  //Patch /:id
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  //Delete /:id
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(+id);
  }
}
