import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export class BaseController {
  protected transformObject<T>(type: new () => T, data: Partial<T>, options?: ClassTransformOptions) {
    return plainToInstance(type, data, options);
  }

  protected transformArray<T>(type: new () => T, data: Partial<T>[], options?: ClassTransformOptions) {
    return plainToInstance(type, data, options);
  }
}
