import { IsString, IsOptional, IsNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags: string[];

}