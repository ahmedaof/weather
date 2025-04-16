import { Module } from '@nestjs/common'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
	imports: [
		CacheModule.register({
			ttl: 90000,

			max: 100
		})
	],
	controllers: [WeatherController],
	providers: [WeatherService]
})
export class WeatherModule {}
