import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTranslation } from './entities/translationUser.entity';
import {
  UserTranslationInput,
  changeLanguageInput,
} from './dto/create-user-translation.dto';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserTranslation)
    private userTranslation: Repository<UserTranslation>,
  ) {}

  findAllAccounts(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOneAccount(id: number, lang: languagesEnum): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      loadEagerRelations: true,
    });
    let filterAccount = user.translations.filter(
      (l) => l.LanguageCode === lang,
    );
    if (!filterAccount || filterAccount.length === 0)
      filterAccount = user.translations.filter(
        (l) => l.LanguageCode === languagesEnum.EN,
      );
    const fullAccountIncludedName = Object.assign(user, filterAccount[0]);
    // console.log(fullAccountIncludedName)
    if (!user) throw new ForbiddenException('account not found');
    return user;
  }

  async updateAccount(id: number, updateUserInput: UpdateUserInput) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) throw new ForbiddenException('account not found');
      await this.userRepo.update(user, updateUserInput);
    } catch (err) {
      throw err;
    }
    return 'account updated successfull';
  }

  async removeAccount(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) throw new ForbiddenException('account not found');
      await this.userRepo.delete(user);
      return 'user deleted successfull';
    } catch (err) {
      throw err;
    }
  }

  async translateUserFields(
    user: User,
    userTranslationInput: UserTranslationInput,
    lang: languagesEnum,
  ) {
    const translationsThatUserHave = await this.userTranslation.findOne({
      where: { base: user, LanguageCode: lang },
    });
    console.log(translationsThatUserHave);
    if (translationsThatUserHave) {
      translationsThatUserHave.firstName = userTranslationInput.firstName;
      translationsThatUserHave.lastName = userTranslationInput.lastName;
      return this.userTranslation.save(translationsThatUserHave);
    }
    return this.userTranslation.save({
      ...userTranslationInput,
      LanguageCode: lang,
      base: user,
    });
  }

  changeUserLang(user: User, input: changeLanguageInput) {
    user.lang = input.lang;
    return this.userRepo.save(user);
  }
}
