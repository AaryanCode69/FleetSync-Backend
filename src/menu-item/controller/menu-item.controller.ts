import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { MenuItemService } from '../service/menu-item.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateMenuItemDto } from '../dto/create-menuitem.dto';
import { User } from 'src/user/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('menuitem')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post('/category/:categoryid/items')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createMenuItem(
    @Param('categoryid') categoryId: string,
    @Body() newMenuItem: CreateMenuItemDto,
    @Request() req: RequestWithUser
  ) {
    return this.menuItemService.addMenuItem(
      req.user.id,
      newMenuItem,
      categoryId
    );
  }
}
