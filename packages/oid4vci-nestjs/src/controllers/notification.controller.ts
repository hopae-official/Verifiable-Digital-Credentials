import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Oid4VciService } from '../services/oid4vci.service';
import { NotificationDto } from '../dto/notification.dto';

@Controller('oid4vci')
export class NotificationController {
  constructor(private readonly oid4vciService: Oid4VciService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Cache-Control', 'no-store')
  @Post('notification')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async notification(@Body() body: NotificationDto) {
    await this.oid4vciService.notification(body);
    return;
  }
}
