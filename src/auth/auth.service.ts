import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../user/models/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { AUTH } from './constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) throw new UnauthorizedException(AUTH.USER_NOT_FOUND_ERROR);
    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException(AUTH.WRONG_PASSWORD_ERROR);
    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}