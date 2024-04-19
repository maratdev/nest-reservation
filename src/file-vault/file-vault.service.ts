import { Inject, Injectable } from '@nestjs/common';
import { FileResponseDto } from './dto/file-response.dto';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './classes/mfile.class';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

@Injectable()
export class FileVaultService {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  private dateFolder = format(new Date(), 'yyyy/MM/dd');
  private directoryPath = this.config.get('UPLOAD_DIRECTORY');

  private getUploadDirectoryPath(): string {
    return join(`${path}/${this.directoryPath}/`, this.dateFolder);
  }

  async saveFile(files: MFile[]): Promise<FileResponseDto[]> {
    const uploadDirectoryPath = this.getUploadDirectoryPath();
    const filename = randomUUID();
    const res: FileResponseDto[] = [];

    for (const file of files) {
      const fileExtension = file.originalname.split('.')[1];
      await ensureDir(uploadDirectoryPath);
      await writeFile(
        `${uploadDirectoryPath}/${filename}.${fileExtension}`,
        file.buffer,
      );
      res.push({
        url: `${this.dateFolder}/${filename}.${fileExtension}`,
        name: file.originalname,
        mimetype: fileExtension,
      });
    }
    return res;
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).resize(500).webp().toBuffer();
  }
}
