import { Controller, Get, Query } from '@nestjs/common'
import { WeatherService } from './weather.service'
import {SearchDto} from "./dtos/search.dto";

@Controller('weather')
export class WeatherController {
	constructor(private readonly weatherService: WeatherService) {}

	@Get('current')
	getCurrent(@Query() query: SearchDto) {
		return this.weatherService.getCurrentWeather(query.city)
	}

	@Get('forecast')
	getForecast(@Query() query: SearchDto) {
		return this.weatherService.getWeatherForecast(query.city)
	}
}
