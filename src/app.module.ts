import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,//*esto hace que se actualicen las entidades si hay algun cambio en el archivo entities, SECCION 10-122
      synchronize: true,//*esto hace que se sincronice automaticamente los cambios con la base de datos
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),

    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessagesWsModule
  ],
})
export class AppModule {}
