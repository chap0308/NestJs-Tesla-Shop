import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false//*por default no se muestra el password en las consultas, cuando se usa el find
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;

    //*Colocar en minusculas antes de crear
    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    //*Colocar en minusculas antes de crear
    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}
