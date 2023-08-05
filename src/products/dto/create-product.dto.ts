//*yarn add class-validator class-transformer
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {

    //?documentacion: colocar al ultimo
    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1,
        required: true //*para que sea obligatorio en la documentacion
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({required: false})//*para que no sea obligatorio en la documentacion
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({required: false})
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number; 

    @ApiProperty({required: true})
    @IsString({ each: true })//*verifica que cada valor sea un string en el array
    @IsArray()
    sizes: string[]

    @ApiProperty({required: true})
    @IsIn(['men','women','kid','unisex'])//*solo acepta estos
    gender: string;

    @ApiProperty({required: false})
    @IsString({ each: true })//*verifica que cada valor sea un string en el array
    @IsArray()
    @IsOptional()
    tags: string[]

    @ApiProperty({required: false})
    @IsString({ each: true })//*verifica que cada valor sea un string en el array
    @IsArray()
    @IsOptional()
    images?: string[]
}
