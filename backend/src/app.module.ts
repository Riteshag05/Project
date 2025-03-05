import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        // url: configService.get<string>('postgresql://postgres1:1EoQITdBsL86XPKNLXWF12D0QuqrBnIC@dpg-cv3vih56l47c7389je40-a.oregon-postgres.render.com/authe_db'),
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'auth_db'),
        entities: [User],
        synchronize: true, // Only for development!
        ssl: {
          rejectUnauthorized: false, // Important for Render
        },
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}