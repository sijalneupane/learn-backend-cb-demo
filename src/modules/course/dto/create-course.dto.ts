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

    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    users: number[]; // array of user IDs
}