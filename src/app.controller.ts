import { Controller, Get, Post, Delete, Put, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { DBService } from './db/db.service'

import { DataEmail } from './interfaces';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: DBService
  ) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('world')
  getWorld(): object {
    return this.appService.getWorld();
  }

  @Post('email')
  sendWelcomeEmail(@Body() emailInProgress: DataEmail): object {
    this.appService.sendEmail(emailInProgress, false);
    this.appService.sendEmail(emailInProgress, true);
    return this.dbService.saveEmail(emailInProgress);
  }
}
