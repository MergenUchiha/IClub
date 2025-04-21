// import { plainToInstance } from 'class-transformer';
// import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
// import { ValidationException } from './validation.exception';
// import { validate } from 'src/config/env.validation';

// @Injectable()
// export class ValidationPipe implements PipeTransform<any> {
//     async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
//         if (!metadata.metatype || metadata.metatype === Object) {
//             return value;
//         }

//         const obj = plainToInstance(metadata.metatype, value);
//         const errors = await validate(obj);

//         if (errors.length) {
//             let messages = errors.map((err) => {
//                 return `${err.property} - ${Object.values(err.constraints || {}).join(', ')}`;
//             });

//             throw new ValidationException(messages);
//         }

//         return obj;
//     }
// }
