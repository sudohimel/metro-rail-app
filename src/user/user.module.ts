import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';  
import { JwtStrategy } from '../auth/jwt.strategy';  

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,  
      signOptions: { expiresIn: '1h' },  
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [TypeOrmModule],
})
export class UserModule {}
