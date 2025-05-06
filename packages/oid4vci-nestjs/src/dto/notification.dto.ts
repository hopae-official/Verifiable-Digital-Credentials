import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationEventEnum } from '../types/notification';

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  notification_id: string;

  @IsEnum(NotificationEventEnum)
  @IsNotEmpty()
  event: NotificationEventEnum;

  @IsString()
  @IsOptional()
  event_description?: string;
}
