//*yarn add @nestjs/typeorm typeorm pg
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';

//*base de datos
@Entity({ name: 'products'})//*nombre en la base de datos
export class Product {
    
    //*para que aparezcan en la base de datos, necesitan los decoradores

    //?Documentacion: colocar al ultimo
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Product ID',
        uniqueItems: true
    })
    //?va pegado de cada propiedad
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //?Documentacion: colocar al ultimo
    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    //?va pegado de cada propiedad
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('float',{//*Hay algunos tipos que no soporta postgres como "number", en lugar de eso se usa "float"
        default: 0//*tomar en cuenta
    })
    price: number;

    @ApiProperty({
        example: 'Anim reprehenderit nulla in anim mollit minim irure commodo.',
        description: 'Product description',
        default: null,
    })
    @Column({
        type: 'text',//* PUEDE SER DEFINIDO ASÍ
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', {//* O ASÍ
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;
    
    @ApiProperty({
        example: ['M','XL','XXL'],
        description: 'Product sizes',
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;
    
    @ApiProperty()
    @Column('text', {
        array: true,
        default: []//*tomar en cuenta, no lo hace obligatorio
    })
    tags: string[];

    // images
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }//*para que cargue los valores cuando usamos findOne
        //*activamos el cascade para elegir la opcion de en product-image onDelete:Cascade
    )
    images?: ProductImage[];


    //*relacion con el usuario
    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }//*para mostrar el usuarioId completo(incluyendo id,nombre,etc) en todas la respuestas de los productos. Con esto tenemos todas las relaciones
    )
    user: User
    

    @BeforeInsert()//*ANTES DE CREAR
    checkSlugInsert() {

        if ( !this.slug ) {//*si no existe el slug(es opcional, ver en los dtos)
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
        //*Fernando's shirt --> fernandos_shirt

    }
    
    @BeforeUpdate()//*ANTES DE ACTUALIZAR
    checkSlugUpdate() {
        //*YA EXISTE SLUG
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }
    
}
