import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() { email, password }: AuthDto) {
    await this.authService.validateUser(email, password);
    return this.authService.login({ email, password });
  }
}
