import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAllAccounts(): Promise<User[]> {
    return this.userRepo.find();
  }

   findOneAccount(id: number): Promise<User> {
    const user = this.userRepo.findOne({ where: { id } });
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
}
