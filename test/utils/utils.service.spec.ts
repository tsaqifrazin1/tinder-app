import { UtilService } from 'utils/service/utils.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compareSync: jest.fn(),
}));

describe('UtilsService', () => {
  let service: UtilService;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    service = new UtilService();
    expect(service).toBeDefined();
  });

  describe('generateHash', () => {
    it('should return a hash', async () => {
      const password = 'password';
      const salt = 'salt';
      const hash = 'hash';
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hash);

      const result = await UtilService.generateHash(password);

      expect(result).toBe(hash);
      expect(bcrypt.genSalt).toBeCalledWith(10);
      expect(bcrypt.hash).toBeCalledWith(password, salt);
    });
  });

  describe('compareHash', () => {
    it('should return true', async () => {
      const password = 'password';
      const hash = 'hash';
      (bcrypt.compareSync as jest.Mock).mockResolvedValue(true);

      const result = await UtilService.compareHash(password, hash);

      expect(result).toBeTruthy();
      expect(bcrypt.compareSync).toBeCalledWith(password, hash);
    });

    it('should return false', async () => {
      const password = 'password';
      const hash = 'hash';
      (bcrypt.compareSync as jest.Mock).mockResolvedValue(false);

      const result = await UtilService.compareHash(password, hash);

      expect(result).toBeFalsy();
      expect(bcrypt.compareSync).toBeCalledWith(password, hash);
    });
  });
});
