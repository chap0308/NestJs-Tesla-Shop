//* nest g res products --no-spec
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from './../auth/auth.module';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]),//*ES NECESARIO PARA CADA CREAR CADA TABLA DE NUESTRAS ENTIDADES
    //! para usar un controller o service de otro modulo se necesita importar el MODULO y ser exportado de su propio modulo
    AuthModule,//*IMPORTANTE IMPORTAR SI QUEREMOS USAR EL DECORADOR Auth()
  ],
  //* por defecto los dtos y types se pueden usar sin la necesidad de ser exportardos
  exports: [
    ProductsService,//* pero los controllers o services sí necesitan ser exportados
    TypeOrmModule,//* en caso de que alguien quiere usar los entities o inyectar el Respository
  ]
})
export class ProductsModule {}
