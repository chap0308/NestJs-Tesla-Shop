import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';//*yarn add uuid, yarn add -D @types/uuid
import { ProductImage, Product } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');//*Cuando se utiliza logger, se pueden registrar diferentes tipos de mensajes, como información, advertencias, errores, etc. 

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    //*una "fuente de datos" (DataSource) es una abstracción que representa una conexión a la base de datos.
    private readonly dataSource: DataSource//* es responsable de configurar y administrar la conexión a la base de datos subyacente, lo que permite que el ORM realice operaciones
                                          //*como consultas, inserciones, actualizaciones y eliminaciones de objetos mapeados a tablas de la base de datos.

  ) {}

  async create(createProductDto: CreateProductDto, user: User) {

    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({//*solo crea la instacia del producto
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image }) ),
        user,//*USUARIO QUE CREA EL PRODUCTO
      });
      
      await this.productRepository.save( product );//*guarda en la base de datos
      //? return product;//? se ve con el id y url dentro de un objeto
      return { ...product, images };//*aplanar los datos, para que se vean de otra manera. Se ve solo el url
    } catch (error) {
      this.handleDBExceptions(error);
    }
    
    
  }

  async findAll(paginationDto : PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products= await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {//*para las relaciones
        images: true,//*esta es la variable del dto
      }
    });
    //*destructiong
    return products.map( ({images, ...rest}) => ({
      ...rest,
      images: images.map( image => image.url )
    }));
    //*para entederlo mejor:
    // return products.map( (product) => ({
    //   ...product,
    //   images: product.images.map( image => image.url )
    // }));

  }

  async findOne(term: string) {

    let product: Product;

    if ( isUUID(term) ) {
      // product = await this.productRepository.findOne({ where:{id:term}, relations:{ images:true } });
      product = await this.productRepository.findOneBy({ id: term });//*para que cargue usamos eaguer en el entity de la propiedad imagen
    } else {
      //*BUSCAR POR QUERY, SIMILAR A HACER CONSULTAS SQL
      const queryBuilder = this.productRepository.createQueryBuilder('prod');//*colocamos un alias 
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {//*para que convierte cuando enviamos el titulo en mayuscula y el slug en minuscula
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images','prodImages')//*referenciamos con el alias
        .getOne();
    }


    if ( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  async findOnePlain( term: string ) {//*aplanamos los datos para que se vean de otra forma
    const { images = [], ...rest } = await this.findOne( term );//*usamos este metodo de esta clase
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }

  async update( id: string, updateProductDto: UpdateProductDto, user: User ) {

    const { images, ...toUpdate } = updateProductDto;

    //*necesitamos del id porque en el dto no lo colocamos, es diferente como lo hacen en graphql usando inputs
    //? el preload busca por el id y si lo encuentra carga toda la entidad
    const product = await this.productRepository.preload({ id, ...toUpdate });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    //* Create query runner
    const queryRunner = this.dataSource.createQueryRunner();//*CREAMOS EL QUERY RUNNER
    //*NECESARIO PARA USARLO
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id } });

        product.images = images.map( 
          image => this.productImageRepository.create({ url: image }) 
        )
      }
      
      // await this.productRepository.save( product );
      product.user = user;//*ANTES DE QUE SE GUARDE, colocamos el user

      await queryRunner.manager.save( product );//*NO LO GUARDA AÚN EN LA BASE DE DATOS

      await queryRunner.commitTransaction();//*HACE EL COMMIT, SIMILAR A GITHUB
      await queryRunner.release();

      return this.findOnePlain( id );
      
    } catch (error) {
      //*SI HAY ERRORES, ENTONCES:
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    //*para algo más complejo, se puede usar un query runner como en el update. Se eliminarian las imagenes y luego el producto
    const product = await this.findOne( id );
    await this.productRepository.remove( product );//*pa este caso usamos en el entity, "onDelete"
  }

  private handleDBExceptions( error: any ) : never {//*jamás retornará algo. Por eso se usa el type "never"

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
  //*para eliminar todo
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

}
