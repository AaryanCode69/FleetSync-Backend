import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantService } from '../service/restaurant.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { User } from 'src/user/entities/user.entity';
import { GetRestaurantsQueryDto } from '../dto/get-restaurant.dto';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('restaurants')
@UseInterceptors(ClassSerializerInterceptor)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createRestaurant(
    @Request() req: RequestWithUser,
    @Body() restaurantCreateDto: CreateRestaurantDto
  ) {
    return this.restaurantService.createRestaurant(
      restaurantCreateDto,
      req.user
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  findAllRestaurantsByLocation(@Query() query: GetRestaurantsQueryDto) {
    return this.restaurantService.findAllByLocation(
      query.long,
      query.lat,
      query.radius
    );
  }
}
