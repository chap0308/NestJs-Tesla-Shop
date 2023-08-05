import { Product } from './';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'product_images' })//*nombre en la base de datos
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        ( product ) => product.images,
        {  onDelete: 'CASCADE' }//*si se elimina el producto, se eliminan las imagenes
    )
    product: Product

}