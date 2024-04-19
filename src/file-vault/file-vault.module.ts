import { Module } from '@nestjs/common';
import { FilesController } from './file-vault.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { FileVaultService } from './file-vault.service';

@Module({
  controllers: [FilesController],
  providers: [FileVaultService],
  imports: [
    ConfigModule,
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: `${path}/${configService.get<string>('UPLOAD_DIRECTORY')}`,
          serveRoot: '/static',
          exclude: ['/static/(.*)'],
          index: false,
        },
      ],
    }),
  ],
})
export class FileVaultModule {}
