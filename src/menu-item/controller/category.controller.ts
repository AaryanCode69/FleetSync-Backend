import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryService } from '../service/category.service';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('menuitem')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(':restaurantid/categories')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createCategory(
    @Request() req: RequestWithUser,
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('restaurantid') params: string
  ) {
    return this.categoryService.createCategory(
      createCategoryDto,
      params,
      req.user.id
    );
  }
}
