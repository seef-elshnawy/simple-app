import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
export class HelperService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(
    hashPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

   generateSessionCode() {
    return crypto
      .randomBytes(Math.ceil((12 * 3) / 4))
      .toString('base64')
      .slice(0, 12)
      .replace(/\+/g, '0')
      .replace(/\//g, '0');
  }
}
