import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';  // activación del archivo .env
import { MailerModule } from '@nestjs-modules/mailer';  // importación del sistema de mails
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { DBsModule } from './db/db.module';
import { EmailMiddleware } from './middlewares/email.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // transport: `smtps://${configService.get<string>('SMTP_USERNAME')}:${configService.get<string>('SMTP_PASSWORD')}@${configService.get<string>('SMTP_HOST')}`,
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('SMTP_USERNAME'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('SMTP_USERNAME')}>`,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    DBsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EmailMiddleware)
      .forRoutes({ path: 'email', method: RequestMethod.POST });
  }
}