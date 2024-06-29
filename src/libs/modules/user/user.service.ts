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

  findAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOneUser(id: number, lang: languagesEnum): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      loadEagerRelations: true,
    });
    if (!user) throw new ForbiddenException('user not found');
    let filteruser = user.translations.filter((l) => l.LanguageCode === lang);
    if (!filteruser || filteruser.length === 0)
      filteruser = user.translations.filter(
        (l) => l.LanguageCode === languagesEnum.EN,
      );
    const fulluserIncludedName = Object.assign(user, filteruser[0]);
    // console.log(fulluserIncludedName)
    if (!user) throw new ForbiddenException('user not found');
    return user;
  }

  async updateUser(id: number, updateUserInput: UpdateUserInput) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) throw new ForbiddenException('user not found');
      await this.userRepo.update(user.id, updateUserInput);
    } catch (err) {
      throw err;
    }
    return 'user updated successfull';
  }

  async removeUser(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) throw new ForbiddenException('user not found');
      await this.userRepo.delete(id);
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

  async changeUserLang(user: User, input: changeLanguageInput) {
    await this.userRepo.update({id:user.id}, {
      lang: input.lang,
    });
    return 'lang updated successfull'
  }
}
