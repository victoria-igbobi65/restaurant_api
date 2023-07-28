import { Injectable, HttpException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 1024 * 1024 * 2; // 2MB

    if (!allowedTypes.includes(file.mimetype))
      throw new HttpException(
        'Invalid file type. Only JPEG and PNG files are allowed.',
        400,
      );
    if (file.size > maxSize)
      throw new HttpException('file size exceeds the 2MB allowed limit', 400);

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }
}
