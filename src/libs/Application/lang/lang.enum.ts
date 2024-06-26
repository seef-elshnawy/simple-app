import { registerEnumType } from '@nestjs/graphql';

export enum languagesEnum {
  AR = 'Arabic',
  EN = 'English',
  FR = 'French',
  DU = 'Dutch',
}

registerEnumType(languagesEnum, { name: 'languagesEnum' });
