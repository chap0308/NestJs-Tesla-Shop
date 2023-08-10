import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Product } from './entities';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';

import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';



@ApiTags("Products")//?esto es para la documentacion: colocar al ultimo
//*PARA AUTHENTICAR: POSTMAN --> Authorization --> Bearer Token y colocar el token
@Controller('products')//*aumenta la url: localhost:3000/api/products
// @Auth()//*si colocamos acá el auth, todos los metodos de esta clase podrán ser llamados por los que tengan un token valido
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()//*SOLO LOS QUE ESTÉN AUTENTICADOS PODRÁN CREAR PRODUCTOS, por default todos los registrados tiene el rol de "user"
  //*si no viene ningun rol, entonces lo dejamos pasar. Es decir que si no viene ningun argumento, es porque no es necesario tener un rol para ejecutar esta funcion.
  //!Pero sí necesita de un token válido para ejecutarlo. Para obtener un token, necesitas ser un usuario.

  //?esto es para la documentacion: colocar al ultimo
  @ApiResponse({ status: 201, description: 'Product was created', type: Product  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  //?

  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,//*para saber quien creó el producto
  ) {
    return this.productsService.create(createProductDto, user );//*colocamos el segundo argumento "user"
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    // console.log(paginationDto)
    return this.productsService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param( 'term' ) term: string) {
    return this.productsService.findOnePlain( term );
  }

  @Patch(':id')
  @Auth( ValidRoles.admin )//*A pesar de estar auntenticado, solo los que tengan el rol de admin podrán ejecutarlo. 
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,//! el user lo obtenemos del decorador @Auth
  ) {
    console.log(user);//*importante
    return this.productsService.update( id, updateProductDto, user );
  }

  @Delete(':id')
  @Auth( ValidRoles.admin )
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.productsService.remove( id );
  }
}
