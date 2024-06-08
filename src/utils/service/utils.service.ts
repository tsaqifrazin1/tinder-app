import * as bcrypt from 'bcrypt';

export class UtilService {
  static async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  static async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compareSync(password, hash);
  }
}
