import { PartialType } from "@nestjs/mapped-types";
import { CreateUsers2Dto } from "./create-users2.dto";

export class UpdateUsers2Dto extends PartialType(CreateUsers2Dto) {}