import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { OtpDto } from './dto/otp.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { randomInt } from 'crypto';
import * as jwt from 'jsonwebtoken'; // For generating JWT token

@Injectable()
export class UserService {
  private userrr: { [key: string]: any }[] = [];
  private temp_otp: { phoneNumber: string; otp: string; createdAt: Date }[] = [];
  private temp_otp_confirm_request: { phoneNumber: string; otp: string }[] = [];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Sign up logic
  async signUp(createUserDto: CreateUserDto): Promise<{ message: string }> {
    if (!createUserDto) {
      throw new BadRequestException('Fill up the form correctly.');
    }
    const { phoneNumber } = createUserDto;

    // Save user data in temporary storage
    this.userrr.push(createUserDto);

    // Generate OTP
    const otp = randomInt(100000, 999999).toString();
    this.temp_otp.push({ phoneNumber, otp, createdAt: new Date() });

    // Clear OTP and user data if not used within 3 minutes
    setTimeout(() => {
      this.temp_otp = this.temp_otp.filter(
        (entry) => entry.phoneNumber !== phoneNumber,
      );
      this.userrr = this.userrr.filter(
        (entry) => entry.phoneNumber !== phoneNumber,
      );
    }, 180000);

    return { message: `OTP sent to ${phoneNumber}. OTP: ${otp}` }; // Include OTP for testing purposes
  }

  async confirmSignUp(otpDto: OtpDto): Promise<{ message: string }> {
    const { phoneNumber, otp } = otpDto;

    // Save confirmation request in temporary storage
    this.temp_otp_confirm_request.push({ phoneNumber, otp });

    // Compare OTPs
    const matchingOtp = this.temp_otp.find(
      (entry) => entry.phoneNumber === phoneNumber && entry.otp === otp,
    );

    if (!matchingOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Find user data in temporary storage
    const userData = this.userrr.find(
      (entry) => entry.phoneNumber === phoneNumber,
    );

    if (!userData) {
      throw new BadRequestException('User data not found');
    }

    // Save user to database
    await this.userRepository.save(userData);

    // Clear temporary storage
    this.userrr = this.userrr.filter((entry) => entry.phoneNumber !== phoneNumber);
    this.temp_otp = this.temp_otp.filter(
      (entry) => entry.phoneNumber !== phoneNumber,
    );
    this.temp_otp_confirm_request = this.temp_otp_confirm_request.filter(
      (entry) => entry.phoneNumber !== phoneNumber,
    );

    return { message: 'User signed up successfully' };
  }

  // Login logic
  async login(loginUserDto: LoginUserDto): Promise<{ message: string; token?: string }> {
    const { phoneNumber, password } = loginUserDto;

  // Validate presence of phone number
  if (!phoneNumber && !password) {
    throw new BadRequestException('Phone number and Password is required for login');
  }

    // Use query builder to check both phoneNumber and password
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.phoneNumber = :phoneNumber', { phoneNumber })
      .andWhere('user.password = :password', { password })
      .getOne();

    // If the user is not found or password doesn't match, throw an error
    if (!user) {
      throw new BadRequestException('Invalid phone number or password');
    }

    // Generate OTP
    const otp = randomInt(100000, 999999).toString();
    this.temp_otp.push({ phoneNumber, otp, createdAt: new Date() });

    // Clear OTP if not used within 3 minutes
    setTimeout(() => {
      this.temp_otp = this.temp_otp.filter((entry) => entry.phoneNumber !== phoneNumber);
    }, 180000);

    return { message: `OTP sent to ${phoneNumber}. OTP: ${otp}` }; 
  }

  async confirmLogin(otpDto: OtpDto): Promise<{ message: string; token?: string }> {
    const { phoneNumber, otp } = otpDto;

    // Compare OTPs
    const matchingOtp = this.temp_otp.find(
      (entry) => entry.phoneNumber === phoneNumber && entry.otp === otp,
    );

    if (!matchingOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Generate JWT token
    const payload = { phoneNumber };
    const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });

    // Clear OTP after successful login
    this.temp_otp = this.temp_otp.filter((entry) => entry.phoneNumber !== phoneNumber);

    return { message: 'Login successful', token };
  }
}
