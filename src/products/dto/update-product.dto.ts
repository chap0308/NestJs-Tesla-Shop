// import { PartialType } from '@nestjs/mapped-types';//*usar esto, luego para la documentacion el de abajo
import { PartialType } from '@nestjs/swagger';//?documentacion, aún así funciona
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
