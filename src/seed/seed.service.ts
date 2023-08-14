import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';


@Injectable()
export class SeedService {

  constructor(
    //! la diferencia entre estos dos clases importadas es el Respository. En el primero usamos los metodos de esa misma clase, pero el segundo hacemos consultas usando TypeORM
    private readonly productsService: ProductsService,
    //*para usar el repositorio de usuarios
    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ) {}


  async runSeed() {
    //*en resumen, las dos siguientes lineas eliminan todos los productos y usuarios, respectivamente. Y finalmente insertamos los usarios de la seed-data
    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertNewProducts( adminUser );//*enviamos el argumento usuario, para

    return 'SEED EXECUTED';
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();//!Para eliminar un usuario, primero debemos eliminar los productos, ya que, estos tienen la llave foranea usuarioId. Tambien se eliminarán las imagenes por el cascade
    
    //*finalmente borramos todos los usuarios, similar al deleteAllProducts()
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()

  }
  //*para insertar los usuarios debemos hacer modificaciones en el seed data
  private async insertUsers() {

    const seedUsers = initialData.users;
    
    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push( this.userRepository.create( user ) )//*solo lo crea, no lo guarda
    });
    //*creamos los usuarios
    const dbUsers = await this.userRepository.save( seedUsers )//*lo guarda

    return dbUsers[0];//*necesario mandar esto porque viene con el uuid generado al guardarse
  }


  private async insertNewProducts( user: User ) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push( this.productsService.create( product, user ) );//*este es el create de productsService
    });

    await Promise.all( insertPromises );


    return true;
  }


}
