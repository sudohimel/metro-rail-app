import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { OtpDto } from './dto/otp.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.userService.signUp(createUserDto);
  }

  @Post('signUpConfirmation')
  async confirmSignUp(@Body() otpDto: OtpDto): Promise<{ message: string }> {
    return this.userService.confirmSignUp(otpDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ message: string; token?: string }> {
    return this.userService.login(loginUserDto);
  }

  @Post('loginConfirmation')
  async confirmLogin(@Body() otpDto: OtpDto): Promise<{ message: string; token?: string }> {
    return this.userService.confirmLogin(otpDto);
  }
}
