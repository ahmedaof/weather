import { Injectable, Inject, CACHE_MANAGER, HttpException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import axios from 'axios'

@Injectable()
export class WeatherService {
	constructor(private configService: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	private apiKey = this.configService.get<string>('WEATHER_API_KEY')
	private baseUrl = this.configService.get<string>('WEATHER_API_URL')
	private ttl = parseInt(this.configService.get<string>('CACHE_TTL'), 10) || 300

	async getCurrentWeather(city: string) {
		const cacheKey = `weather_current_${city.toLowerCase()}`
		const cached = await this.cacheManager.get(cacheKey)
		console.log(cached)
		if (cached) return cached

		try {
			const res = await axios.get(`${this.baseUrl}/weather`, {
				params: {
					q: city,
					appid: this.apiKey,
					units: 'metric'
				}
			})

			const result = {
				city: res.data.name,
				temperature: res.data.main.temp,
				description: res.data.weather[0].description,
				humidity: res.data.main.humidity,
				windSpeed: res.data.wind.speed
			}

			await this.cacheManager.set(cacheKey, result, this.ttl)
			return result
		} catch (error) {
			this.handleError(error)
		}
	}

	async getWeatherForecast(city: string) {
		const cacheKey = `weather_forecast_${city.toLowerCase()}`
		const cached = await this.cacheManager.get(cacheKey)
		if (cached) return cached

		try {
			const res = await axios.get(`${this.baseUrl}/forecast`, {
				params: {
					q: city,
					appid: this.apiKey,
					units: 'metric'
				}
			})

			const dailyForecasts = this.groupByDate(res.data.list)

			await this.cacheManager.set(cacheKey, dailyForecasts, this.ttl)
			return dailyForecasts
		} catch (error) {
			this.handleError(error)
		}
	}

	private groupByDate(data: any[]) {
		const daily = {};

		data.forEach((item) => {
			const date = item.dt_txt.split(' ')[0];
			if (!daily[date]) {
				daily[date] = { temps: [], descriptions: [] };
			}

			daily[date].temps.push(item.main.temp);
			daily[date].descriptions.push(item.weather[0].description);
		});

		return Object.keys(daily).map((date) => {
			const { temps, descriptions } = daily[date];
			const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
			const description = this.getDescription(descriptions);

			return {
				date,
				avgTemperature: avgTemp.toFixed(1),
				description,
			};
		});
	}

	private getDescription(descriptions: string[]): string {
		const data = {};
		let mostDesc = descriptions[0];
		let maxCount = 1;

		for (const desc of descriptions) {
			data[desc] = (data[desc] || 0) + 1;
			if (data[desc] > maxCount) {
				mostDesc = desc;
				maxCount = data[desc];
			}
		}

		return mostDesc;
	}


	// always make a file to handle all errors with its translation if it required.
	private handleError(error: any) {
		if (error.response) {
			const status = error.response.status;
			const message = error.response.data?.message || 'Weather API error';

			if (status === 429) {
				throw new HttpException(`Rate limit exceeded. Try again later.`, 429);
			}

			throw new HttpException(message, status); // other API errors
		} else if (error.request) {
			throw new HttpException('Weather API unreachable', 503); //  Connection failure
		} else {
			throw new HttpException('Unexpected server error', 500);
		}
	}

}
