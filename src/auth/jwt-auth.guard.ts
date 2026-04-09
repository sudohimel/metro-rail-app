import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      throw new UnauthorizedException('JWT token missing');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;  // Store decoded data (user info) in the request object
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired JWT token');
    }
  }
}
