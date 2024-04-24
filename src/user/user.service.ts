import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from './dto/user.dto';
import { genSalt, hash } from 'bcryptjs';
import { RoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleModel } from './models/role.model';
import { UserEmailDto } from './dto/email-user.dto';
import { IdMongoDto } from './dto/id-mongo.dto';
import { USER } from './constants/user.constants';
import { ROLE } from './constants/role.constants';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectModel(RoleModel.name) private readonly roleModel: Model<RoleModel>,
  ) {}

  async createUser(dto: UserDTO): Promise<UserModel> {
    await this.checkDuplicateUser(dto.email);
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      ...dto,
      password: await hash(dto.password, salt),
    });

    return newUser.save();
  }

  async getDataUser({ email }: UserEmailDto): Promise<UserModel> {
    const checkReserve = await this.userModel.findOne({ email });
    if (!checkReserve) throw new NotFoundException(USER.NOT_FOUND);
    return checkReserve;
  }

  async updateUser(
    userId: IdMongoDto,
    updateDto: UpdateUserDto,
  ): Promise<UserModel> {
    const user = await this.userModel.findById({ _id: userId.id });
    if (!user) throw new NotFoundException(USER.NOT_FOUND);
    if (Object.keys(updateDto).length === 0) {
      throw new BadRequestException(USER.EMPTY);
    }
    await this.checkDuplicateUser(updateDto.email);
    return this.userModel.findByIdAndUpdate(userId.id, updateDto, {
      new: true,
    });
  }

  async deleteUser(userId: IdMongoDto): Promise<void> {
    const user = await this.userModel.findById({ _id: userId.id });
    if (!user) throw new NotFoundException(USER.NOT_FOUND);
    return this.userModel.findByIdAndDelete(userId.id);
  }

  async deleteUserFromEmail(email: string) {
    return this.userModel.deleteOne({ email });
  }

  //--------------------- Методы для ролей--------------------/
  async createUserRole(dto: RoleDto): Promise<RoleModel> {
    await this.checkDuplicateRole(dto.name);
    return new this.roleModel(dto).save();
  }

  async updateUserRole(
    roleId: IdMongoDto,
    dto: UpdateRoleDto,
  ): Promise<RoleModel> {
    const role = await this.roleModel.findById({
      _id: roleId.id,
    });
    if (!role) throw new NotFoundException(ROLE.NOT_FOUND);
    await this.checkDuplicateRole(dto.name);
    return this.roleModel
      .findByIdAndUpdate(roleId.id, {
        ...dto,
      })
      .exec();
  }

  async deleteUserRole(roleId: IdMongoDto): Promise<void> {
    const role = await this.roleModel.findById({
      _id: roleId.id,
    });
    if (!role) throw new NotFoundException(ROLE.NOT_FOUND);
    return this.roleModel.findByIdAndDelete(roleId.id);
  }

  //--------------------- Вспомогательные методы --------------------/
  private async checkDuplicateUser(email: string): Promise<boolean> {
    const role = await this.userModel.findOne({ email });
    if (role) {
      throw new ConflictException(USER.DUPLICATE);
    }
    return !!role;
  }

  private async checkDuplicateRole(name: string): Promise<boolean> {
    const role = await this.roleModel.find({ name: name }, 'name').exec();
    if (role.length !== 0) {
      throw new ConflictException(ROLE.DUPLICATE);
    }
    return !!role;
  }
}
