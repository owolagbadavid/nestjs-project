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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
import { User } from 'src/entities';
import { ApiRes } from 'src/types/api-response';
import { JwtGuard, RolesGuard } from 'src/auth/guards';
import { GetUser } from 'src/decorators';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/entities/roles.enum';
import { RolesOrIdGuard } from 'src/auth/guards/roles-or-id.guard';

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
  create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: User,
  ): Promise<ApiRes> {
    console.log(user);

    return this.usersService.create(createUserDto);
  }

  //Get /
  @ApiOkResponse({ type: User, isArray: true })
  @UseGuards(RolesGuard)
  @Get()
  findAll(@GetUser() user: User): Promise<User[]> {
    console.log(user);

    return this.usersService.findAll();
  }

  //Get /:id
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesOrIdGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ): Promise<User> {
    console.log(user);

    return this.usersService.findOne(+id);
  }

  //Patch /:id
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
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
  remove(@Param('id', ParseIntPipe) id: string): Promise<User> {
    return this.usersService.remove(+id);
  }
}
