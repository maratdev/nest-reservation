import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileResponseDto } from './dto/file-response.dto';
import { FileVaultService } from './file-vault.service';
import { MFile } from './classes/mfile.class';
import { extension } from 'mime-types';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FileVaultService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto[]> {
    const saveArray: MFile[] = [new MFile(file)];
    const fileExtension = extension(file.mimetype);

    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebp(file.buffer);
      saveArray.push(
        new MFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer,
          mimetype: fileExtension,
        }),
      );
    }
    return this.filesService.saveFile(saveArray);
  }
}
