import { IRequest } from '@presentation/http/types/IRequest'
import { BaseError } from '@shared/exceptions/BaseError'
import { InternalException } from '@shared/exceptions/InternalException'
import { HttpResponse } from '@shared/http/interfaces/IHttpResponse'
import { instanceToPlain } from 'class-transformer'

export default abstract class BaseController {
  abstract execute(request: IRequest): Promise<HttpResponse>

  send(data: unknown) {
    return instanceToPlain({
      data: data,
    })
  }

  sendStatus(status: number) {
    return {
      status: status,
    }
  }

  error(err: BaseError) {
    if (!err.customError) {
      throw new InternalException(`
				Unexpected Error.
				Error: ${JSON.stringify(err)}
			`)
    }

    return {
      error: {
        code: err.statusCode,
        message: {
          type: err.name,
          value: err.message,
        },
      },
    }
  }
}
