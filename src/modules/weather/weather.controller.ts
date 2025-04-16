import { Controller, Get, Query } from '@nestjs/common'
import { WeatherService } from './weather.service'

@Controller('weather')
export class WeatherController {
	constructor(private readonly weatherService: WeatherService) {}

	@Get('current')
	getCurrent(@Query('city') city: string) {
		return this.weatherService.getCurrentWeather(city)
	}

	@Get('forecast')
	getForecast(@Query('city') city: string) {
		return this.weatherService.getWeatherForecast(city)
	}
}
