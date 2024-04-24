import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { AUTH } from './constants/auth.constants';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(email: string) {
    return this.userService.getDataUser({ email });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email' | 'role'>> {
    const user = await this.findUser(email);
    if (!user) throw new UnauthorizedException(AUTH.USER_NOT_FOUND_ERROR);
    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException(AUTH.WRONG_PASSWORD_ERROR);
    return { email: user.email, role: user.role };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
