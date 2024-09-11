import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(): Promise<{ accesToken: string }> {
    return {
      accesToken: await this.jwtService.signAsync({}),
    };
  }
}
