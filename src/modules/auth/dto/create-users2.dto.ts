import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ArrayNotEmpty, ArrayUnique, IsInt } from 'class-validator';
import { Role } from '../enum/role.enum';

export class CreateUsers2Dto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    role: Role;
    // @IsOptional()
    // @ArrayNotEmpty()
    // @ArrayUnique()
    // @IsInt({ each: true })
    // courses?: number[];
}