import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { MailModule } from './mail/mail.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({ inject: [ConfigService], useFactory: (c: ConfigService) => ({
      type: 'mysql', host: c.get('DB_HOST'), port: Number(c.get('DB_PORT', 3306)), username: c.get('DB_USER'),
      password: c.get('DB_PASSWORD'), database: c.get('DB_NAME'), autoLoadEntities: true, synchronize: false,
    })}),
    UsersModule, AuthModule, ClientsModule, InvoicesModule, PaymentsModule, MailModule, SchedulerModule,
  ],
})
export class AppModule {}
