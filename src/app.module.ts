import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const ENV = process.env.NODE;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const {
          directory,
          fileName: fName,
          level,
        } = configService.get<Record<string, string>>('logger');
        const fileName =
          fName || `${configService.get('name')}.${configService.get('env')}`;
        const { format, transports } = winston;
        const { combine, timestamp, ms, uncolorize } = format;
        const trans = [];
        trans.push(
          new DailyRotateFile({
            filename: `${fileName}.%DATE%.log`,
            dirname: `${process.cwd()}/${directory}`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
          }),
        );
        if (configService.get('env') !== 'production') {
          trans.push(
            new transports.Console({
              level: 'debug',
              format: combine(
                timestamp(),
                ms(),
                nestWinstonModuleUtilities.format.nestLike(),
              ),
            }),
          );
        }

        return {
          level,
          format: combine(
            timestamp(),
            ms(),
            nestWinstonModuleUtilities.format.nestLike(),
            uncolorize(),
          ),
          transports: trans,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
