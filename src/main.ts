import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { join } from 'path'
import * as express from 'express'

async function bootstrap() {
	const classSerializerOptions = {
		excludePrefixes: ['']
	}
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	app.enableCors()
	app.setGlobalPrefix('api/v1')
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true
		})
	)
	app.use('/public', express.static(join(__dirname, '..', 'public')))
	const port = process.env.PORT || 3000
	await app.listen(port, '0.0.0.0', () => {
		console.log(`Application is running on: http://localhost:${port}/api/v1/`)
	})

}

bootstrap()
