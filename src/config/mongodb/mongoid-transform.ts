import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { STATUS } from '../constants/default';

export const SafeMongoIdTransform = ({ value }) => {
  try {
    if (
      Types.ObjectId.isValid(value) &&
      new Types.ObjectId(value).toString() === value
    ) {
      return value;
    }
  } catch (error) {
    throw new BadRequestException(STATUS.ID_VALIDATION_FAIL);
  }
};
