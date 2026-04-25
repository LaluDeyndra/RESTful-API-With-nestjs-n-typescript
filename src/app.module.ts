import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const createTypeOrmConfig = (): TypeOrmModuleOptions => {
  const dbType = (process.env.DB_TYPE || 'sqlite') as 'mysql' | 'sqlite';

  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: process.env.DB_NAME || 'dev.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }

  return {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_nestjs',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  };
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot(createTypeOrmConfig()),
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
