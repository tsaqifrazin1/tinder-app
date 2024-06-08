import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorDTO } from 'src/common/dto/error.dto';

interface ErrorObject {
  message: string;
  description?: string;
  statusCode?: HttpStatus;
}

export function ApiErrorDecorator(
  args: ErrorObject[] | ErrorObject,
  options?: ApiResponseOptions,
) {
  let schema: Record<string, any>, statusCode: number, description: string;
  if (Array.isArray(args)) {
    statusCode = args[0].statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    description = args.map((item) => item.description).join(', ');

    const anyOf = args.map((item) => ({
      properties: {
        message: {
          type: 'string',
          default: item.message,
        },
        status_code: {
          type: 'number',
          default: item.statusCode,
        },
        date: {
          type: 'date',
          default: new Date(),
        },
      },
    }));

    schema = {
      anyOf,
    };
  } else {
    statusCode = args.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    description = args.description ?? 'Internal server error';

    schema = {
      properties: {
        message: {
          type: 'string',
          default: args.message,
        },
        status_code: {
          type: 'number',
          default: args.statusCode,
        },
        date: {
          type: 'date',
          default: new Date(),
        },
      },
    };
  }

  return applyDecorators(
    ApiResponse({
      ...options,
      status: statusCode,
      description: description,
      schema,
    }),
  );
}
