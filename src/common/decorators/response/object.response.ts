import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiObjectResponse = <
  DataDto extends Type<unknown> | Type<unknown>[],
>(
  options: ApiResponseOptions,
  dataDtos: DataDto,
) => {
  const dataTypes = Array.isArray(dataDtos)
    ? dataDtos
    : dataDtos !== undefined
    ? [dataDtos]
    : null;

  const schemas =
    dataDtos !== undefined && dataTypes?.length
      ? dataTypes.map((dataDto) => ({
          $ref: getSchemaPath(dataDto),
        }))
      : null;

  const properties = {
    message: {
      type: 'string',
      default: options.description,
    },
    statusCode: {
      type: 'number',
      default: options.status,
    },
    date: {
      type: 'string',
      default: new Date().toISOString(),
    },
  };

  if (!schemas) {
    return applyDecorators(
      ApiResponse({
        ...options,
        status: options.status,
        description: options.description,
        schema: {
          properties,
        },
      }),
    );
  }

  properties['data'] = {
    oneOf: schemas,
  };
  return applyDecorators(
    ApiExtraModels(...(<[]>dataTypes)),
    ApiResponse({
      ...options,
      status: options.status,
      description: options.description,
      schema: {
        properties,
      },
    }),
  );
};
