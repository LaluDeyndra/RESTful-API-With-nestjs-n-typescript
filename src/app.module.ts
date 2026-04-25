import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const createTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const dbType = configService.get<'mysql' | 'sqlite'>('DB_TYPE', 'mysql');

  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: configService.get<string>('DB_NAME', 'dev.sqlite'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }

  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
    username: configService.get<string>('DB_USER', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_NAME', 'db_nestjs'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  };
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createTypeOrmConfig(configService),
    }),
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
