import { Module } from '@nestjs/common'
import { SharedModule } from '@shared/shared.module'
import { ConfigModule } from '@nestjs/config'
import { validateEnviromentVariables } from '@config/validate-env.config'
import { WeatherModule } from './modules/weather/weather.module'

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnviromentVariables }), SharedModule, WeatherModule],
	controllers: []
})
export class AppModule {}
