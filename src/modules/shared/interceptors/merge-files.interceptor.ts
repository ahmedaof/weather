import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class MergeFilesInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest()
		request?.files?.forEach((file: any) => {
			if (request.body[file.fieldname]) {
				if (Array.isArray(request.body[file.fieldname])) {
					request.body[file.fieldname] = [...request.body[file.fieldname], file]
				} else {
					request.body[file.fieldname] = [request.body[file.fieldname], file]
				}
			} else {
				request.body[file.fieldname] = file
			}
		})

		return next.handle()
	}
}
