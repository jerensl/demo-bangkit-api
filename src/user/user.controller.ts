import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './interface/user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signupUser(@Body() userDataDTO: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userDataDTO);
  }

  @Get('info')
  getuser(@Req() request: Request): string {
    return `Hello, ${request['user']?.email}. Welcome.....`;
  }
}
