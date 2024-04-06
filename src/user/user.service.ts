import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/user.dto';
import { genSalt, hash } from 'bcryptjs';
import { RoleDto } from './dto/role.dto';
import { RoleModel } from './models/role.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectModel(RoleModel.name) private readonly roleModel: Model<RoleModel>,
  ) {}

  async createUser(dto: CreateUserDTO) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      ...dto,
      password: await hash(dto.password, salt),
    });

    return newUser.save();
  }

  async createUserRole(dto: RoleDto) {
    const newRole = new this.roleModel(dto);

    return newRole.save();
  }
}
