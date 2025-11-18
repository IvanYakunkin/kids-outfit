import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/common/file-filters';

export function ImageFilesInterceptor(
  fieldName: string,
  maxCount = 10,
  maxSizeMB = 5,
) {
  return FilesInterceptor(fieldName, maxCount, {
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
}
