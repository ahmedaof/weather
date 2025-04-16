import { plainToClass } from 'class-transformer'
import { IsNotEmpty, validateSync } from 'class-validator'

class EnvironmentVariables {
	@IsNotEmpty()
	PORT: number

	@IsNotEmpty()
	HOST: string

	@IsNotEmpty()
	CACHE_TTL: string

	@IsNotEmpty()
	RATE_LIMIT: string

	@IsNotEmpty()
	TZ: string

	@IsNotEmpty()
	WEATHER_API_KEY: string

	@IsNotEmpty()
	WEATHER_API_URL: string
}

export function validateEnviromentVariables(configuration: Record<string, unknown>) {
	const finalConfig = plainToClass(EnvironmentVariables, configuration, { enableImplicitConversion: true })

	const errors = validateSync(finalConfig)

	if (errors.length > 0) {
		throw new Error(errors.toString())
	}

	return finalConfig
}
