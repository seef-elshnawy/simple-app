import { UserVerificationCodeUseCaseEnum } from '@src/libs/utils/user.enum';
import { User } from '../user/entities/user.entity';

export interface VerificationCodeAndExpirationDate {
  verificationCode: string;
  expiryDateAfterHour: Date;
}

export interface ValidVerificationCodeOrErrorInput {
  user: User;
  verificationCode: string;
  useCase: UserVerificationCodeUseCaseEnum;
}


