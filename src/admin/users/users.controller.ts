import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('/admin/users/')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  async findAll(@Request() req): Promise<{ data: UserEntity[] }> {
    const items = await this.usersService.findAll();
    return { data: plainToInstance(UserEntity, items) };
  }
}
