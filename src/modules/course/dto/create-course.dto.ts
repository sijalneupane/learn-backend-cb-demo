import { IsString, IsOptional, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()   
    fee: number;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}