import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(
      new BadRequestException('Разрешены только изображения (jpg, jpeg, png)'),
      false,
    );
  }
  callback(null, true);
};
