import ResaleAppService from '@application/resale/ResaleAppService'
import { tokens } from '@di/tokens'
import { IRequest } from '@presentation/http/types/IRequest'
import { BaseError } from '@shared/exceptions/BaseError'
import BaseController from '@shared/http/controller/BaseController'
import logger from '@shared/logging/Logger'
import { resaleSchema } from '@shared/validators/resaleSchema'
import { inject, injectable } from 'tsyringe'

@injectable()
export default class ResaleCreateController extends BaseController {
  constructor(
    @inject(tokens.ResaleAppService)
    private resaleAppService: ResaleAppService
  ) {
    super()
  }

  public async execute(request: IRequest) {
    const requestId = Math.random().toString(36).substr(2, 9)
    const startTime = Date.now()

    logger.info({
      requestId,
      message: 'Received request to create resale',
      body: request.body,
      timestamp: new Date().toISOString(),
    })

    try {
      const { error, value } = resaleSchema.validate(request.body)

      if (error) {
        logger.warn({
          requestId,
          message: 'Validation failed for resale creation',
          error: error.details[0].message,
          timestamp: new Date().toISOString(),
        })

        throw new BaseError({
          message: error.details[0].message,
          name: 'ValidationError',
          statusCode: 400,
        })
      }

      const result = await this.resaleAppService.create(value)

      logger.info({
        requestId,
        message: 'Resale successfully created',
        resaleId: result.id,
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      })

      return this.send(result)
    } catch (err) {
      logger.error({
        requestId,
        message: 'Error occurred while creating resale',
        error: (err as BaseError).message,
        statusCode: (err as BaseError).statusCode,
        timestamp: new Date().toISOString(),
      })

      return this.error(err as BaseError)
    }
  }
}
