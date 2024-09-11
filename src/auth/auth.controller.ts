import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Internal')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/sign-in')
  signIn(): Promise<{
    accesToken: string;
  }> {
    return this.authService.signIn();
  }
}
