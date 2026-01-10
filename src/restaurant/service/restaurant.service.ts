import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { Point } from 'geojson';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}

  async createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    const { longitude, latitude, ...result } = createRestaurantDto;
    const newLocation = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
    const newRestaurant = this.restaurantRepository.create({
      location: newLocation as Point,
      ...result,
    });

    return await this.restaurantRepository.save(newRestaurant);
  }
}
